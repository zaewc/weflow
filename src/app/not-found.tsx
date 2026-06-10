import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-w grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-6xl font-extrabold text-brand-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          페이지를 찾을 수 없습니다.
        </h1>
        <p className="mt-2 text-slate-500">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <Link href="/" className="btn-primary mt-6">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
