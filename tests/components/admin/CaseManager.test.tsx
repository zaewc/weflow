import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CaseManager from "@/components/admin/CaseManager";
import type { CaseItem } from "@/lib/cases";

const KEY = "weflow2026";

function seed(): CaseItem[] {
  return [
    {
      slug: "cafe",
      name: "OO 카페",
      category: "카페",
      summary: "모바일 최적화",
      image: "/cases_카페.jpg",
      gradient: "from-yellow-400 to-amber-600",
      metrics: [{ label: "방문", value: "+160%" }],
      highlights: ["갤러리", "지도"],
    },
  ];
}

let cases: CaseItem[];
let saveMode: "ok" | "error" | "errorNoJson";

function installFetch() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, opts?: RequestInit) => {
      const method = opts?.method ?? "GET";

      if (url === "/api/cases" && method === "GET") {
        return { status: 200, ok: true, json: async () => ({ items: cases }) };
      }
      if (url === "/api/cases" && method === "POST") {
        if (saveMode === "error") {
          return { ok: false, json: async () => ({ error: "중복 슬러그" }) };
        }
        if (saveMode === "errorNoJson") {
          return {
            ok: false,
            json: async () => {
              throw new Error("no json");
            },
          };
        }
        const body = JSON.parse(opts!.body as string) as CaseItem;
        cases = [...cases, { ...body, slug: "new-slug" }];
        return { ok: true, json: async () => ({}) };
      }
      if (url.startsWith("/api/cases/") && method === "PATCH") {
        const slug = url.split("/").pop()!;
        const body = JSON.parse(opts!.body as string) as CaseItem;
        cases = cases.map((c) => (c.slug === slug ? { ...body, slug } : c));
        return { ok: true, json: async () => ({}) };
      }
      if (url.startsWith("/api/cases/") && method === "DELETE") {
        const slug = url.split("/").pop()!;
        cases = cases.filter((c) => c.slug !== slug);
        return { ok: true, json: async () => ({}) };
      }
      return { ok: true, json: async () => ({}) };
    }),
  );
}

function fillForm(values: {
  name: string;
  category: string;
  summary: string;
  image: string;
  gradient: string;
  metrics: string;
  highlights: string;
}) {
  fireEvent.change(screen.getByLabelText("상호명"), {
    target: { value: values.name },
  });
  fireEvent.change(screen.getByLabelText("업종"), {
    target: { value: values.category },
  });
  fireEvent.change(screen.getByLabelText("요약"), {
    target: { value: values.summary },
  });
  fireEvent.change(screen.getByLabelText("이미지 경로"), {
    target: { value: values.image },
  });
  fireEvent.change(screen.getByLabelText("그라데이션"), {
    target: { value: values.gradient },
  });
  fireEvent.change(screen.getByLabelText("지표"), {
    target: { value: values.metrics },
  });
  fireEvent.change(screen.getByLabelText("진행 포인트"), {
    target: { value: values.highlights },
  });
}

beforeEach(() => {
  cases = seed();
  saveMode = "ok";
  installFetch();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("CaseManager", () => {
  it("lists existing cases on mount", async () => {
    render(<CaseManager adminKey={KEY} />);
    expect(await screen.findByText("OO 카페")).toBeInTheDocument();
    expect(screen.getByText("성공사례 관리")).toBeInTheDocument();
  });

  it("shows an empty state when there are no cases", async () => {
    cases = [];
    render(<CaseManager adminKey={KEY} />);
    expect(
      await screen.findByText("등록된 성공사례가 없습니다."),
    ).toBeInTheDocument();
  });

  it("creates a new case (parses metrics/highlights) and reloads", async () => {
    render(<CaseManager adminKey={KEY} />);
    await screen.findByText("OO 카페");

    fireEvent.click(screen.getByRole("button", { name: /성공사례 추가/ }));
    expect(screen.getByText("새 성공사례")).toBeInTheDocument();

    fillForm({
      name: "OO 신규샵",
      category: "신규업종",
      summary: "신규 요약",
      image: "/cases_new.jpg",
      gradient: "from-brand-500 to-brand-700",
      // 유효 1줄 + 무효 1줄(값 없음)
      metrics: "상담,+200%\n빈값",
      // 유효 + 공백줄
      highlights: "포인트1\n\n포인트2",
    });

    fireEvent.click(screen.getByRole("button", { name: "저장" }));
    expect(await screen.findByText("OO 신규샵")).toBeInTheDocument();
    // 폼이 닫힘
    expect(screen.queryByText("새 성공사례")).not.toBeInTheDocument();
  });

  it("edits an existing case (prefills form) and saves via PATCH", async () => {
    render(<CaseManager adminKey={KEY} />);
    await screen.findByText("OO 카페");

    fireEvent.click(screen.getByRole("button", { name: "OO 카페 수정" }));
    expect(screen.getByText("성공사례 수정")).toBeInTheDocument();
    // 기존 값이 채워짐
    expect(screen.getByLabelText("상호명")).toHaveValue("OO 카페");
    expect(screen.getByLabelText("지표")).toHaveValue("방문,+160%");

    fireEvent.change(screen.getByLabelText("상호명"), {
      target: { value: "OO 카페 (수정)" },
    });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));
    expect(await screen.findByText("OO 카페 (수정)")).toBeInTheDocument();
  });

  it("shows a server error message on save failure", async () => {
    saveMode = "error";
    render(<CaseManager adminKey={KEY} />);
    await screen.findByText("OO 카페");

    fireEvent.click(screen.getByRole("button", { name: /성공사례 추가/ }));
    fillForm({
      name: "X",
      category: "Y",
      summary: "Z",
      image: "/x.jpg",
      gradient: "",
      metrics: "",
      highlights: "",
    });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));
    expect(await screen.findByText("중복 슬러그")).toBeInTheDocument();
  });

  it("falls back to a default error message when the error body is unreadable", async () => {
    saveMode = "errorNoJson";
    render(<CaseManager adminKey={KEY} />);
    await screen.findByText("OO 카페");

    fireEvent.click(screen.getByRole("button", { name: /성공사례 추가/ }));
    fillForm({
      name: "X",
      category: "Y",
      summary: "Z",
      image: "/x.jpg",
      gradient: "",
      metrics: "",
      highlights: "",
    });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));
    expect(
      await screen.findByText("저장에 실패했습니다."),
    ).toBeInTheDocument();
  });

  it("cancels the form without saving", async () => {
    render(<CaseManager adminKey={KEY} />);
    await screen.findByText("OO 카페");
    fireEvent.click(screen.getByRole("button", { name: /성공사례 추가/ }));
    expect(screen.getByText("새 성공사례")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "취소" }));
    expect(screen.queryByText("새 성공사례")).not.toBeInTheDocument();
  });

  it("deletes after confirm and keeps the case when cancelled", async () => {
    render(<CaseManager adminKey={KEY} />);
    await screen.findByText("OO 카페");

    // 취소 → 유지
    vi.spyOn(window, "confirm").mockReturnValueOnce(false);
    fireEvent.click(screen.getByRole("button", { name: "OO 카페 삭제" }));
    expect(screen.getByText("OO 카페")).toBeInTheDocument();

    // 확인 → 삭제
    vi.spyOn(window, "confirm").mockReturnValue(true);
    fireEvent.click(screen.getByRole("button", { name: "OO 카페 삭제" }));
    await waitFor(() =>
      expect(screen.queryByText("OO 카페")).not.toBeInTheDocument(),
    );
  });
});
