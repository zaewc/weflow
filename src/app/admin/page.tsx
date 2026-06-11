"use client";

import { useCallback, useEffect, useState } from "react";
import {
  RefreshCw,
  LogOut,
  Download,
  ChevronDown,
  Trash2,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  STATUS_LABEL,
  type Submission,
  type SubmissionKind,
  type SubmissionStatus,
} from "@/lib/types";

const STORAGE_KEY = "weflow_admin_key";
const FILTERS: { key: "all" | SubmissionStatus; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "pending", label: "대기" },
  { key: "in_progress", label: "진행중" },
  { key: "done", label: "완료" },
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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

function SubmissionTable({
  title,
  rows,
  showSchedule = false,
  onStatus,
  onDelete,
  onExport,
}: {
  title: string;
  kind: SubmissionKind;
  rows: Submission[];
  showSchedule?: boolean;
  onStatus: (id: string, status: SubmissionStatus) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="font-bold text-slate-900">
          {title}{" "}
          <span className="ml-1 text-sm font-medium text-slate-400">
            {rows.length}건
          </span>
        </h2>
        <button
          onClick={onExport}
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
        >
          <Download className="h-4 w-4" /> 엑셀 다운
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
            <tr>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3">이름</th>
              <th className="px-4 py-3">연락처</th>
              <th className="px-4 py-3">접수일</th>
              {showSchedule && <th className="px-4 py-3">희망 일정</th>}
              <th className="px-4 py-3">관리</th>
              <th className="px-4 py-3 text-center">상세</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={showSchedule ? 7 : 6}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  접수된 내역이 없습니다.
                </td>
              </tr>
            )}
            {rows.map((row) => {
              const open = expanded.has(row.id);
              return (
                <FragmentRow
                  key={row.id}
                  row={row}
                  open={open}
                  showSchedule={showSchedule}
                  onToggle={() => toggle(row.id)}
                  onStatus={onStatus}
                  onDelete={onDelete}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FragmentRow({
  row,
  open,
  showSchedule,
  onToggle,
  onStatus,
  onDelete,
}: {
  row: Submission;
  open: boolean;
  showSchedule: boolean;
  onToggle: () => void;
  onStatus: (id: string, status: SubmissionStatus) => void;
  onDelete: (id: string) => void;
}) {
  const colSpan = showSchedule ? 7 : 6;
  return (
    <>
      <tr className="text-slate-700">
        <td className="px-4 py-3">
          <StatusBadge status={row.status} />
        </td>
        <td className="px-4 py-3 font-medium">{row.name}</td>
        <td className="px-4 py-3">
          <a href={`tel:${row.phone}`} className="hover:text-brand-700">
            {row.phone}
          </a>
        </td>
        <td className="px-4 py-3 text-slate-500">{formatDate(row.createdAt)}</td>
        {showSchedule && (
          <td className="px-4 py-3 text-slate-500">{row.schedule || "-"}</td>
        )}
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => onStatus(row.id, "in_progress")}
              className="rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-100"
            >
              {STATUS_LABEL.in_progress}
            </button>
            <button
              onClick={() => onStatus(row.id, "done")}
              className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              {STATUS_LABEL.done}
            </button>
            <button
              onClick={() => onDelete(row.id)}
              className="rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
              aria-label="삭제"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </td>
        <td className="px-4 py-3 text-center">
          <button
            onClick={onToggle}
            className="grid h-7 w-7 place-items-center rounded-md hover:bg-slate-100"
            aria-label="상세 보기"
            aria-expanded={open}
          >
            <ChevronDown
              className={`h-4 w-4 text-slate-500 transition ${open ? "rotate-180" : ""}`}
            />
          </button>
        </td>
      </tr>
      {open && (
        <tr className="bg-slate-50">
          <td colSpan={colSpan} className="px-4 py-4">
            <dl className="grid gap-3 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-semibold text-slate-400">
                  제작 종류
                </dt>
                <dd className="text-sm text-slate-700">
                  {row.projectType || "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-slate-400">업종</dt>
                <dd className="text-sm text-slate-700">
                  {row.industry || "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-slate-400">
                  추가요청사항
                </dt>
                <dd className="whitespace-pre-wrap text-sm text-slate-700">
                  {row.note || "-"}
                </dd>
              </div>
            </dl>
          </td>
        </tr>
      )}
    </>
  );
}
