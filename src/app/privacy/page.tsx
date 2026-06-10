import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "개인정보처리방침 | WEFLOW",
};

export default function PrivacyPage() {
  return (
    <div className="container-w py-16">
      <h1 className="text-3xl font-extrabold text-slate-900">
        개인정보처리방침
      </h1>
      <div className="prose mt-6 max-w-3xl space-y-4 text-slate-600">
        <p>
          WEFLOW(이하 “회사”)는 이용자의 개인정보를 중요시하며, 관련 법령을
          준수합니다. 회사는 상담 및 견적 제공을 위해 아래의 개인정보를
          수집·이용합니다.
        </p>
        <h2 className="text-xl font-bold text-slate-900">1. 수집 항목</h2>
        <p>이름, 연락처, 제작 종류, 업종, 추가요청사항, 희망 상담 일정</p>
        <h2 className="text-xl font-bold text-slate-900">2. 이용 목적</h2>
        <p>상담 진행, 견적 안내, 서비스 제공 및 고객 관리</p>
        <h2 className="text-xl font-bold text-slate-900">3. 보유 기간</h2>
        <p>상담 종료 후 관련 법령에 따라 보관하며, 목적 달성 시 파기합니다.</p>
        <h2 className="text-xl font-bold text-slate-900">4. 문의</h2>
        <p>개인정보 관련 문의: {SITE.email}</p>
      </div>
    </div>
  );
}
