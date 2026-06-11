"use client";

import { useState } from "react";
import { Download, ChevronDown, Trash2 } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  STATUS_LABEL,
  type Submission,
  type SubmissionKind,
  type SubmissionStatus,
} from "@/lib/types";

// 행별 상태 변경 버튼 (진행중/완료)
const STATUS_ACTIONS: { status: SubmissionStatus; className: string }[] = [
  {
    status: "in_progress",
    className: "bg-amber-50 text-amber-700 hover:bg-amber-100",
  },
  {
    status: "done",
    className: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  },
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

export default function SubmissionTable({
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
          <span className="ml-1 text-sm font-medium text-slate-500">
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
                  className="px-4 py-10 text-center text-slate-500"
                >
                  접수된 내역이 없습니다.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <SubmissionRow
                key={row.id}
                row={row}
                open={expanded.has(row.id)}
                showSchedule={showSchedule}
                onToggle={() => toggle(row.id)}
                onStatus={onStatus}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SubmissionRow({
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
            {STATUS_ACTIONS.map((action) => (
              <button
                key={action.status}
                onClick={() => onStatus(row.id, action.status)}
                className={`rounded-md px-2 py-1 text-xs font-semibold ${action.className}`}
              >
                {STATUS_LABEL[action.status]}
              </button>
            ))}
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
                <dt className="text-xs font-semibold text-slate-500">
                  제작 종류
                </dt>
                <dd className="text-sm text-slate-700">
                  {row.projectType || "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-slate-500">업종</dt>
                <dd className="text-sm text-slate-700">
                  {row.industry || "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-slate-500">
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
