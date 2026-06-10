import type { Metadata } from "next";
import ReservationBooker from "@/components/ReservationBooker";

export const metadata: Metadata = {
  title: "예약 | WEFLOW",
  description:
    "원하는 날짜와 시간을 선택해 상담을 예약하세요. 9시부터 18시 30분까지 30분 간격으로 예약 가능합니다.",
};

export default function ReservationPage() {
  return (
    <section className="bg-gradient-to-b from-brand-50 to-white py-12 sm:py-16">
      <div className="container-w">
        <div className="mb-10 text-center">
          <span className="chip">RESERVATION</span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            상담 예약
          </h1>
          <p className="mt-3 text-slate-600">
            원하는 날짜와 시간을 선택하시면 담당자가 맞춰 상담드립니다.
          </p>
        </div>
        <ReservationBooker />
      </div>
    </section>
  );
}
