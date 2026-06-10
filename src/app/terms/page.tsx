import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 | WEFLOW",
};

export default function TermsPage() {
  return (
    <div className="container-w py-16">
      <h1 className="text-3xl font-extrabold text-slate-900">이용약관</h1>
      <div className="prose mt-6 max-w-3xl space-y-4 text-slate-600">
        <h2 className="text-xl font-bold text-slate-900">제1조 (목적)</h2>
        <p>
          본 약관은 WEFLOW가 제공하는 홈페이지·랜딩페이지 제작 및 광고 운영
          서비스의 이용 조건과 절차에 관한 사항을 규정합니다.
        </p>
        <h2 className="text-xl font-bold text-slate-900">제2조 (서비스 범위)</h2>
        <p>
          제작, 광고 연동·운영, 유지보수 및 사후관리를 포함합니다. 도메인 비용
          및 광고비는 별도이며, 광고비는 고객 계정에서 직접 결제됩니다.
        </p>
        <h2 className="text-xl font-bold text-slate-900">제3조 (유지보수)</h2>
        <p>
          유지보수는 텍스트, 이미지, 링크 등 경미한 수정을 기준으로 하며, 페이지
          추가 및 기능 개발은 별도 비용이 발생할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
