import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SubmissionForm from "@/components/SubmissionForm";

function fill(name = "홍길동", phone = "010-1234-5678") {
  fireEvent.change(screen.getByPlaceholderText("홍길동"), {
    target: { value: name },
  });
  fireEvent.change(screen.getByPlaceholderText("010-0000-0000"), {
    target: { value: phone },
  });
}

function agree() {
  fireEvent.click(screen.getByRole("checkbox"));
}

describe("SubmissionForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("shows error when name missing", () => {
    render(<SubmissionForm kind="inquiry" />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("이름을 입력해주세요.")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("shows error when phone missing", () => {
    render(<SubmissionForm kind="inquiry" />);
    fireEvent.change(screen.getByPlaceholderText("홍길동"), {
      target: { value: "홍" },
    });
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("연락처를 입력해주세요.")).toBeInTheDocument();
  });

  it("shows error when not agreed", () => {
    render(<SubmissionForm kind="inquiry" />);
    fill();
    fireEvent.click(screen.getByRole("button"));
    expect(
      screen.getByText("개인정보 수집 및 이용 동의가 필요합니다."),
    ).toBeInTheDocument();
  });

  it("blocks submit when beforeSubmit returns a message", () => {
    render(
      <SubmissionForm kind="reservation" beforeSubmit={() => "일정을 선택"} />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("일정을 선택")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("submits successfully and shows confirmation", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);
    render(
      <SubmissionForm
        kind="reservation"
        schedule="2026-06-12 14:30"
        beforeSubmit={() => null}
        compact
      />,
    );
    fill();
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "홈페이지 제작" },
    });
    fireEvent.change(screen.getByPlaceholderText(/PT샵/), {
      target: { value: "카페" },
    });
    fireEvent.change(screen.getByPlaceholderText(/자유롭게/), {
      target: { value: "메모" },
    });
    agree();
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(screen.getByText("접수가 완료되었습니다!")).toBeInTheDocument(),
    );
    const body = JSON.parse(
      vi.mocked(fetch).mock.calls[0]![1]!.body as string,
    );
    expect(body).toMatchObject({
      kind: "reservation",
      schedule: "2026-06-12 14:30",
      agreed: true,
    });
  });

  it("shows server error message on failure response", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "서버 거부" }),
    } as Response);
    render(<SubmissionForm kind="inquiry" />);
    fill();
    agree();
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() =>
      expect(screen.getByText("서버 거부")).toBeInTheDocument(),
    );
  });

  it("uses default error when response has no error field", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as Response);
    render(<SubmissionForm kind="inquiry" />);
    fill();
    agree();
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() =>
      expect(screen.getByText("접수에 실패했습니다.")).toBeInTheDocument(),
    );
  });

  it("handles non-Error rejection with a generic message", async () => {
    vi.mocked(fetch).mockRejectedValue("network down");
    render(<SubmissionForm kind="inquiry" />);
    fill();
    agree();
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() =>
      expect(screen.getByText("오류가 발생했습니다.")).toBeInTheDocument(),
    );
  });
});
