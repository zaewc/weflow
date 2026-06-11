"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, Clock } from "lucide-react";
import SubmissionForm from "@/components/SubmissionForm";

// 9:00 ~ 18:30, 30분 간격 = 총 20개 (가로 5 × 세로 4)
function buildSlots(): string[] {
  const slots: string[] = [];
  for (let m = 9 * 60; m <= 18 * 60 + 30; m += 30) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
  }
  return slots;
}

const SLOTS = buildSlots();
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export default function ReservationBooker() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [customTime, setCustomTime] = useState<string>("");

  // 달력 셀 구성
  const cells = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const arr: (Date | null)[] = [];
    for (let i = 0; i < startPad; i += 1) arr.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) {
      arr.push(new Date(viewYear, viewMonth, day));
    }
    return arr;
  }, [viewYear, viewMonth]);

  const isToday = (d: Date) => ymd(d) === ymd(today);
  const isPastDay = (d: Date) => d.getTime() < today.getTime();
  const isSelectedDay = (d: Date) =>
    selectedDate !== null && ymd(d) === ymd(selectedDate);

  // 현재 시간 기준, 오늘 선택 시 지난 시간대 비활성화
  const now = new Date();
  const slotDisabled = (slot: string): boolean => {
    if (!selectedDate || !isToday(selectedDate)) return false;
    const parts = slot.split(":");
    const h = Number(parts[0]);
    const m = Number(parts[1]);
    const slotMinutes = h * 60 + m;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    return slotMinutes <= nowMinutes;
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const effectiveTime = customTime.trim() || selectedTime;
  const schedule =
    selectedDate && effectiveTime
      ? `${ymd(selectedDate)} ${effectiveTime}`
      : "";

  const validateSchedule = (): string | null => {
    if (!selectedDate) return "예약 날짜를 선택해주세요.";
    if (!effectiveTime) return "예약 시간을 선택하거나 직접 입력해주세요.";
    return null;
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      {/* 달력 + 시간 */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-bold text-slate-900">
              <CalendarDays className="h-5 w-5 text-brand-600" /> 날짜 선택
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevMonth}
                className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                aria-label="이전 달"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="w-28 text-center text-sm font-semibold text-slate-800">
                {viewYear}년 {viewMonth + 1}월
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                aria-label="다음 달"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((w, i) => (
              <div
                key={w}
                className={`py-1 text-xs font-semibold ${
                  i === 0 ? "text-red-500" : "text-slate-500"
                }`}
              >
                {w}
              </div>
            ))}
            {cells.map((d, i) => {
              if (!d) return <div key={`pad-${i}`} />;
              const disabled = isPastDay(d);
              const selected = isSelectedDay(d);
              return (
                <button
                  key={ymd(d)}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    setSelectedDate(d);
                    setSelectedTime("");
                  }}
                  className={`aspect-square rounded-lg text-sm font-medium transition ${
                    selected
                      ? "bg-brand-600 text-white shadow-brand"
                      : disabled
                        ? "cursor-not-allowed text-slate-300"
                        : "text-slate-700 hover:bg-brand-50"
                  } ${isToday(d) && !selected ? "ring-1 ring-brand-300" : ""}`}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
            <Clock className="h-5 w-5 text-brand-600" /> 시간대 선택
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {SLOTS.map((slot) => {
              const disabled = slotDisabled(slot);
              const active = selectedTime === slot && !customTime.trim();
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    setSelectedTime(slot);
                    setCustomTime("");
                  }}
                  className={`rounded-lg border py-2 text-sm font-medium transition ${
                    active
                      ? "border-brand-600 bg-brand-600 text-white"
                      : disabled
                        ? "cursor-not-allowed border-slate-100 text-slate-300"
                        : "border-slate-200 text-slate-700 hover:border-brand-300"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>

          <div className="mt-4">
            <label
              htmlFor="reservation-custom-time"
              className="mb-1 block text-sm font-semibold text-slate-700"
            >
              원하시는 시간대 (직접 입력)
            </label>
            <input
              id="reservation-custom-time"
              value={customTime}
              onChange={(e) => {
                setCustomTime(e.target.value);
                if (e.target.value.trim()) setSelectedTime("");
              }}
              placeholder="예: 19:00"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>
      </div>

      {/* 예약 정보 폼 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
        <h2 className="mb-1 text-xl font-bold text-slate-900">예약 정보 입력</h2>
        <p className="mb-4 text-sm text-slate-500">
          {schedule
            ? `선택한 일정: ${schedule}`
            : "왼쪽에서 날짜와 시간을 먼저 선택해주세요."}
        </p>
        <SubmissionForm
          kind="reservation"
          schedule={schedule}
          beforeSubmit={validateSchedule}
          submitLabel="예약 신청하기"
        />
      </div>
    </div>
  );
}
