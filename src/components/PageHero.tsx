// 페이지 상단 히어로 (그라데이션 배경 + eyebrow/제목/설명, 가운데 정렬)

export default function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="bg-gradient-to-b from-brand-50 to-white py-16">
      <div className="container-w text-center">
        <span className="chip">{eyebrow}</span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-slate-600">{description}</p>
      </div>
    </section>
  );
}
