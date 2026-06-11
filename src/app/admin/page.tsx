"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, LogOut, Download, Loader2, ShieldCheck } from "lucide-react";
import SubmissionTable from "@/components/admin/SubmissionTable";
import type {
  Submission,
  SubmissionKind,
  SubmissionStatus,
} from "@/lib/types";

const STORAGE_KEY = "weflow_admin_key";
const FILTERS: { key: "all" | SubmissionStatus; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "pending", label: "대기" },
  { key: "in_progress", label: "진행중" },
  { key: "done", label: "완료" },
];

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string>("");
  const [authed, setAuthed] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [items, setItems] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<"all" | SubmissionStatus>("all");
  const [refreshing, setRefreshing] = useState(false);

  // 저장된 키 복원
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      setAdminKey(saved);
      setAuthed(true);
    }
  }, []);

  const fetchItems = useCallback(
    async (key: string) => {
      const res = await fetch("/api/submissions", {
        headers: { "x-admin-key": key },
        cache: "no-store",
      });
      if (res.status === 401) {
        throw new Error("unauthorized");
      }
      const data = (await res.json()) as { items: Submission[] };
      setItems(data.items);
    },
    [],
  );

  // 로그인 후 + 실시간 폴링(5초)
  useEffect(() => {
    if (!authed || !adminKey) return;
    let alive = true;
    const run = async () => {
      try {
        await fetchItems(adminKey);
      } catch {
        if (alive) {
          setAuthed(false);
          sessionStorage.removeItem(STORAGE_KEY);
        }
      }
    };
    run();
    const id = setInterval(run, 5000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [authed, adminKey, fetchItems]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    try {
      await fetchItems(keyInput);
      sessionStorage.setItem(STORAGE_KEY, keyInput);
      setAdminKey(keyInput);
      setAuthed(true);
    } catch {
      setLoginError("관리자 키가 올바르지 않습니다.");
    } finally {
      setLoggingIn(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
    setAdminKey("");
    setKeyInput("");
    setItems([]);
  }

  async function manualRefresh() {
    setRefreshing(true);
    try {
      await fetchItems(adminKey);
    } catch {
      /* noop */
    } finally {
      setRefreshing(false);
    }
  }

  async function changeStatus(id: string, status: SubmissionStatus) {
    // 낙관적 업데이트 (실시간 반영)
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status } : it)),
    );
    await fetch(`/api/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ status }),
    });
    fetchItems(adminKey).catch(() => undefined);
  }

  async function remove(id: string) {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
    await fetch(`/api/submissions/${id}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey },
    });
    fetchItems(adminKey).catch(() => undefined);
  }

  async function download(kind: "all" | SubmissionKind) {
    const res = await fetch(`/api/export?kind=${kind}`, {
      headers: { "x-admin-key": adminKey },
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `weflow-${kind}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  if (!authed) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-100 p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-lg"
        >
          <div className="mb-6 flex flex-col items-center text-center">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-600 text-white">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <h1 className="mt-3 text-xl font-bold text-slate-900">
              WEFLOW 관리자
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              관리자 키를 입력해주세요.
            </p>
          </div>
          <input
            type="password"
            aria-label="관리자 키"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="관리자 키"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
          {loginError && (
            <p className="mt-2 text-sm text-red-600">{loginError}</p>
          )}
          <button
            type="submit"
            disabled={loggingIn}
            className="btn-primary mt-4 w-full disabled:opacity-60"
          >
            {loggingIn && <Loader2 className="h-5 w-5 animate-spin" />}
            로그인
          </button>
        </form>
      </div>
    );
  }

  const filtered = items.filter(
    (it) => filter === "all" || it.status === filter,
  );
  const reservations = filtered.filter((it) => it.kind === "reservation");
  const inquiries = filtered.filter((it) => it.kind === "inquiry");

  const counts = {
    all: items.length,
    pending: items.filter((i) => i.status === "pending").length,
    in_progress: items.filter((i) => i.status === "in_progress").length,
    done: items.filter((i) => i.status === "done").length,
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <h1 className="text-lg font-bold text-slate-900">
            WEFLOW 관리자 대시보드
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => download("all")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <Download className="h-4 w-4" /> 전체 엑셀
            </button>
            <button
              onClick={manualRefresh}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              새로고침
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" /> 로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6">
        {/* 상태 필터 */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                filter === f.key
                  ? "bg-brand-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f.label}{" "}
              <span className="opacity-70">{counts[f.key]}</span>
            </button>
          ))}
        </div>

        <SubmissionTable
          title="예약 관리"
          kind="reservation"
          rows={reservations}
          showSchedule
          onStatus={changeStatus}
          onDelete={remove}
          onExport={() => download("reservation")}
        />

        <SubmissionTable
          title="문의 관리"
          kind="inquiry"
          rows={inquiries}
          onStatus={changeStatus}
          onDelete={remove}
          onExport={() => download("inquiry")}
        />
      </main>
    </div>
  );
}
