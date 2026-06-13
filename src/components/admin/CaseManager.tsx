"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import type { CaseItem, CaseMetric, NewCase } from "@/lib/cases";

interface FormState {
  name: string;
  category: string;
  summary: string;
  image: string;
  gradient: string;
  metrics: string; // "라벨,값" 줄바꿈
  highlights: string; // 한 줄에 하나
}

const EMPTY_FORM: FormState = {
  name: "",
  category: "",
  summary: "",
  image: "",
  gradient: "",
  metrics: "",
  highlights: "",
};

function metricsToText(metrics: CaseMetric[]): string {
  return metrics.map((m) => `${m.label},${m.value}`).join("\n");
}

function parseMetrics(text: string): CaseMetric[] {
  return text
    .split("\n")
    .map((line) => {
      const [label, ...rest] = line.split(",");
      return { label: (label ?? "").trim(), value: rest.join(",").trim() };
    })
    .filter((m) => m.label && m.value);
}

function linesToText(lines: string[]): string {
  return lines.join("\n");
}

function parseLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function CaseManager({ adminKey }: { adminKey: string }) {
  const [items, setItems] = useState<CaseItem[]>([]);
  const [open, setOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/cases", { cache: "no-store" });
    const data = (await res.json()) as { items: CaseItem[] };
    setItems(data.items);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startCreate() {
    setEditingSlug(null);
    setForm(EMPTY_FORM);
    setError("");
    setOpen(true);
  }

  function startEdit(item: CaseItem) {
    setEditingSlug(item.slug);
    setForm({
      name: item.name,
      category: item.category,
      summary: item.summary,
      image: item.image,
      gradient: item.gradient,
      metrics: metricsToText(item.metrics),
      highlights: linesToText(item.highlights),
    });
    setError("");
    setOpen(true);
  }

  function cancel() {
    setOpen(false);
    setError("");
  }

  function setField(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload: NewCase = {
      name: form.name,
      category: form.category,
      summary: form.summary,
      image: form.image,
      gradient: form.gradient,
      metrics: parseMetrics(form.metrics),
      highlights: parseLines(form.highlights),
    };
    const isNew = editingSlug === null;
    const res = await fetch(isNew ? "/api/cases" : `/api/cases/${editingSlug}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "저장에 실패했습니다.");
      return;
    }
    setOpen(false);
    await load();
  }

  async function remove(slug: string) {
    if (!window.confirm("이 성공사례를 삭제하시겠습니까?")) return;
    await fetch(`/api/cases/${slug}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey },
    });
    await load();
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">성공사례 관리</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            CASE 페이지에 노출되는 성공사례를 추가·수정·삭제합니다.
          </p>
        </div>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" /> 성공사례 추가
        </button>
      </div>

      {open && (
        <form
          onSubmit={save}
          className="space-y-3 border-b border-slate-100 bg-slate-50 px-5 py-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              {editingSlug === null ? "새 성공사례" : "성공사례 수정"}
            </h3>
            <button
              type="button"
              onClick={cancel}
              aria-label="닫기"
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              aria-label="상호명"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="상호명 (예: OO 카페)"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              aria-label="업종"
              value={form.category}
              onChange={(e) => setField("category", e.target.value)}
              placeholder="업종 (예: 카페)"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          <input
            aria-label="요약"
            value={form.summary}
            onChange={(e) => setField("summary", e.target.value)}
            placeholder="한 줄 요약"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              aria-label="이미지 경로"
              value={form.image}
              onChange={(e) => setField("image", e.target.value)}
              placeholder="/cases_카페.jpg"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              aria-label="그라데이션"
              value={form.gradient}
              onChange={(e) => setField("gradient", e.target.value)}
              placeholder="from-brand-500 to-brand-700 (선택)"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          <textarea
            aria-label="지표"
            value={form.metrics}
            onChange={(e) => setField("metrics", e.target.value)}
            rows={2}
            placeholder="지표 (한 줄에 하나, 라벨,값) 예: 상담 문의,+180%"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <textarea
            aria-label="진행 포인트"
            value={form.highlights}
            onChange={(e) => setField("highlights", e.target.value)}
            rows={3}
            placeholder="진행 포인트 (한 줄에 하나)"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              저장
            </button>
            <button
              type="button"
              onClick={cancel}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              취소
            </button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-slate-400">
          등록된 성공사례가 없습니다.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {items.map((item) => (
            <li
              key={item.slug}
              className="flex items-center justify-between gap-4 px-5 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">
                  {item.name}
                  <span className="ml-2 text-xs font-medium text-slate-400">
                    {item.category}
                  </span>
                </p>
                <p className="truncate text-sm text-slate-500">
                  {item.summary}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => startEdit(item)}
                  aria-label={`${item.name} 수정`}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <Pencil className="h-3.5 w-3.5" /> 수정
                </button>
                <button
                  onClick={() => remove(item.slug)}
                  aria-label={`${item.name} 삭제`}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> 삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
