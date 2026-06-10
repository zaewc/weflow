import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReservationBooker from "@/components/ReservationBooker";

// 고정 시각: 2026-06-15 (월) 13:00
const FIXED = new Date(2026, 5, 15, 13, 0, 0);

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(FIXED);
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

function dayButton(day: string) {
  return screen
    .getAllByRole("button")
    .find((b) => b.textContent === day && b.getAttribute("aria-label") === null);
}

describe("ReservationBooker", () => {
  it("renders 20 time slots and the current month", () => {
    render(<ReservationBooker />);
    expect(screen.getByText("2026년 6월")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "09:00" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "18:30" })).toBeInTheDocument();
  });

  it("navigates months with year wrap-around", () => {
    render(<ReservationBooker />);
    const next = screen.getByLabelText("다음 달");
    for (let i = 0; i < 7; i += 1) fireEvent.click(next); // 6월 → 다음해 1월
    expect(screen.getByText("2027년 1월")).toBeInTheDocument();

    const prev = screen.getByLabelText("이전 달");
    for (let i = 0; i < 13; i += 1) fireEvent.click(prev); // 2027.1 → 2025.12
    expect(screen.getByText("2025년 12월")).toBeInTheDocument();
  });

  it("disables past time slots when today is selected", () => {
    render(<ReservationBooker />);
    const today = dayButton("15");
    expect(today).toBeDefined();
    fireEvent.click(today!);
    // 13:00 이전/이하 비활성, 13:30 이후 활성
    expect(screen.getByRole("button", { name: "09:00" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "13:00" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "13:30" })).toBeEnabled();
  });

  it("requires a date then a time before submitting", () => {
    render(<ReservationBooker />);
    const submit = screen.getByRole("button", { name: "예약 신청하기" });

    fireEvent.click(submit);
    expect(screen.getByText("예약 날짜를 선택해주세요.")).toBeInTheDocument();

    fireEvent.click(dayButton("20")!);
    fireEvent.click(submit);
    expect(
      screen.getByText("예약 시간을 선택하거나 직접 입력해주세요."),
    ).toBeInTheDocument();
  });

  it("toggles between slot selection and custom time", () => {
    render(<ReservationBooker />);
    fireEvent.click(dayButton("20")!);

    const slot = screen.getByRole("button", { name: "10:00" });
    fireEvent.click(slot);
    expect(slot.className).toContain("bg-brand-600");
    expect(screen.getByText("선택한 일정: 2026-06-20 10:00")).toBeInTheDocument();

    const custom = screen.getByPlaceholderText("예: 19:00");
    fireEvent.change(custom, { target: { value: "19:00" } });
    expect(slot.className).not.toContain("bg-brand-600");
    expect(screen.getByText("선택한 일정: 2026-06-20 19:00")).toBeInTheDocument();

    // 커스텀 비우기 → if 거짓 분기
    fireEvent.change(custom, { target: { value: "" } });
    // 슬롯 다시 클릭 → customTime 초기화
    fireEvent.click(slot);
    expect(screen.getByText("선택한 일정: 2026-06-20 10:00")).toBeInTheDocument();
  });

  it("submits a complete reservation", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true } as Response));
    render(<ReservationBooker />);
    fireEvent.click(dayButton("20")!);
    fireEvent.click(screen.getByRole("button", { name: "11:00" }));

    fireEvent.change(screen.getByPlaceholderText("홍길동"), {
      target: { value: "예약자" },
    });
    fireEvent.change(screen.getByPlaceholderText("010-0000-0000"), {
      target: { value: "010-1111-2222" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "예약 신청하기" }));

    await waitFor(() =>
      expect(screen.getByText("접수가 완료되었습니다!")).toBeInTheDocument(),
    );
    const body = JSON.parse(
      (vi.mocked(fetch).mock.calls[0]![1]!.body as string) ?? "{}",
    );
    expect(body.kind).toBe("reservation");
    expect(body.schedule).toBe("2026-06-20 11:00");
  });

  it("prevents selecting past days", () => {
    render(<ReservationBooker />);
    // 1일 (과거) 버튼은 disabled
    const past = dayButton("1");
    expect(past).toBeDisabled();
  });
});
