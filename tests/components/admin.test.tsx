import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import AdminPage from "@/app/admin/page";
import type { Submission } from "@/lib/types";

const KEY = "weflow2026";

function seed(): Submission[] {
  return [
    {
      id: "r1",
      kind: "reservation",
      status: "pending",
      name: "예약자1",
      phone: "010-1",
      projectType: "홈페이지 제작",
      industry: "카페",
      note: "메모",
      schedule: "2026-06-12 14:30",
      createdAt: "2026-06-10T01:00:00.000Z",
    },
    {
      id: "r2",
      kind: "reservation",
      status: "in_progress",
      name: "예약자2",
      phone: "010-2",
      projectType: "랜딩페이지 제작",
      industry: "PT샵",
      note: "",
      schedule: "",
      createdAt: "2026-06-10T02:00:00.000Z",
    },
    {
      id: "i1",
      kind: "inquiry",
      status: "pending",
      name: "문의자1",
      phone: "010-3",
      projectType: "",
      industry: "",
      note: "",
      schedule: "",
      createdAt: "2026-06-10T03:00:00.000Z",
    },
    {
      id: "i2",
      kind: "inquiry",
      status: "done",
      name: "문의자2",
      phone: "010-4",
      projectType: "기타(WEFLOW 케어플랜)",
      industry: "미용실",
      note: "급함",
      createdAt: "2026-06-10T04:00:00.000Z",
      schedule: "",
    },
  ];
}

let items: Submission[];
let exportOk = true;
let listShouldThrow = false;

function installFetch() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, opts?: RequestInit) => {
      const method = opts?.method ?? "GET";
      const headers = (opts?.headers ?? {}) as Record<string, string>;
      const key = headers["x-admin-key"];

      if (url.startsWith("/api/submissions") && method === "GET") {
        if (key !== KEY) return { status: 401, json: async () => ({}) };
        if (listShouldThrow) throw new Error("boom");
        return { status: 200, json: async () => ({ items }) };
      }
      if (url.startsWith("/api/submissions/") && method === "PATCH") {
        const id = url.split("/").pop()!;
        const body = JSON.parse(opts!.body as string);
        items = items.map((it) =>
          it.id === id ? { ...it, status: body.status } : it,
        );
        return { ok: true, json: async () => ({}) };
      }
      if (url.startsWith("/api/submissions/") && method === "DELETE") {
        const id = url.split("/").pop()!;
        items = items.filter((it) => it.id !== id);
        return { ok: true, json: async () => ({}) };
      }
      if (url.startsWith("/api/export")) {
        return exportOk
          ? { ok: true, blob: async () => new Blob(["x"]) }
          : { ok: false };
      }
      return { ok: true, json: async () => ({}) };
    }),
  );
}

async function login() {
  render(<AdminPage />);
  fireEvent.change(screen.getByPlaceholderText("관리자 키"), {
    target: { value: KEY },
  });
  fireEvent.click(screen.getByRole("button", { name: "로그인" }));
  await waitFor(() =>
    expect(screen.getByText("WEFLOW 관리자 대시보드")).toBeInTheDocument(),
  );
}

beforeEach(() => {
  items = seed();
  exportOk = true;
  listShouldThrow = false;
  sessionStorage.clear();
  installFetch();
  (URL as unknown as { createObjectURL: unknown }).createObjectURL = vi.fn(
    () => "blob:x",
  );
  (URL as unknown as { revokeObjectURL: unknown }).revokeObjectURL = vi.fn();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("AdminPage login", () => {
  it("shows error on wrong key", async () => {
    render(<AdminPage />);
    fireEvent.change(screen.getByPlaceholderText("관리자 키"), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByRole("button", { name: "로그인" }));
    await waitFor(() =>
      expect(
        screen.getByText("관리자 키가 올바르지 않습니다."),
      ).toBeInTheDocument(),
    );
  });

  it("restores session from storage and logs in", async () => {
    sessionStorage.setItem("weflow_admin_key", KEY);
    render(<AdminPage />);
    await waitFor(() =>
      expect(screen.getByText("WEFLOW 관리자 대시보드")).toBeInTheDocument(),
    );
  });

  it("logs out on polling failure when session restored", async () => {
    sessionStorage.setItem("weflow_admin_key", KEY);
    listShouldThrow = true;
    render(<AdminPage />);
    await waitFor(() =>
      expect(screen.getByPlaceholderText("관리자 키")).toBeInTheDocument(),
    );
    expect(sessionStorage.getItem("weflow_admin_key")).toBeNull();
  });
});

describe("AdminPage dashboard", () => {
  it("renders both tables with counts and details", async () => {
    await login();
    expect(screen.getByText("예약 관리")).toBeInTheDocument();
    expect(screen.getByText("문의 관리")).toBeInTheDocument();
    // 필터 버튼 카운트 (전체 4 / 대기 2 / 진행중 1 / 완료 1)
    expect(screen.getByRole("button", { name: "전체 4" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "대기 2" })).toBeInTheDocument();
    expect(screen.getByText("예약자1")).toBeInTheDocument();

    // 상세 펼치기 (문의자1 — 빈 값들이 "-"로 표시)
    const expandButtons = screen.getAllByLabelText("상세 보기");
    fireEvent.click(expandButtons[expandButtons.length - 1]!);
    expect(screen.getAllByText("-").length).toBeGreaterThan(0);
  });

  it("filters by status", async () => {
    await login();
    fireEvent.click(screen.getByRole("button", { name: "완료 1" }));
    // 완료는 i2뿐 → 예약 테이블 비어있음 (colSpan 7 분기)
    expect(screen.getByText("문의자2")).toBeInTheDocument();
    expect(screen.queryByText("예약자1")).not.toBeInTheDocument();
    expect(screen.getAllByText("접수된 내역이 없습니다.").length).toBeGreaterThan(
      0,
    );

    // 진행중 → 문의 테이블 비어있음 (colSpan 6 분기)
    fireEvent.click(screen.getByRole("button", { name: "진행중 1" }));
    expect(screen.getByText("예약자2")).toBeInTheDocument();
  });

  it("changes status optimistically and persists", async () => {
    await login();
    const getRow = () =>
      within(screen.getByText("예약 관리").closest("section")!)
        .getByText("예약자1")
        .closest("tr")!;
    // 변경 전: 행 안에 "완료"는 버튼 1개뿐 (배지는 "대기")
    expect(within(getRow()).getAllByText("완료")).toHaveLength(1);
    fireEvent.click(within(getRow()).getByRole("button", { name: "완료" }));
    // 변경 후: 배지도 "완료" → 2개
    await waitFor(() =>
      expect(within(getRow()).getAllByText("완료")).toHaveLength(2),
    );
  });

  it("deletes after confirm, keeps row when cancelled", async () => {
    await login();
    const table = screen.getByText("예약 관리").closest("section")!;

    vi.spyOn(window, "confirm").mockReturnValueOnce(false);
    const row = within(table).getByText("예약자1").closest("tr")!;
    fireEvent.click(within(row).getByLabelText("삭제"));
    expect(screen.getByText("예약자1")).toBeInTheDocument();

    vi.spyOn(window, "confirm").mockReturnValue(true);
    fireEvent.click(within(row).getByLabelText("삭제"));
    await waitFor(() =>
      expect(screen.queryByText("예약자1")).not.toBeInTheDocument(),
    );
  });

  it("downloads excel (all + section) and skips when response not ok", async () => {
    await login();
    const createObjectURL = (
      URL as unknown as { createObjectURL: ReturnType<typeof vi.fn> }
    ).createObjectURL;

    fireEvent.click(screen.getByRole("button", { name: /전체 엑셀/ }));
    await waitFor(() => expect(createObjectURL).toHaveBeenCalledTimes(1));

    const sectionBtns = screen.getAllByRole("button", { name: /엑셀 다운/ });
    fireEvent.click(sectionBtns[0]!);
    await waitFor(() => expect(createObjectURL).toHaveBeenCalledTimes(2));

    // 응답 실패 시 다운로드 스킵
    exportOk = false;
    fireEvent.click(screen.getByRole("button", { name: /전체 엑셀/ }));
    await new Promise((r) => setTimeout(r, 10));
    expect(createObjectURL).toHaveBeenCalledTimes(2);
  });

  it("manual refresh and logout", async () => {
    await login();
    fireEvent.click(screen.getByRole("button", { name: /새로고침/ }));
    await waitFor(() =>
      expect(screen.getByText("예약자1")).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole("button", { name: /로그아웃/ }));
    expect(screen.getByPlaceholderText("관리자 키")).toBeInTheDocument();
  });
});
