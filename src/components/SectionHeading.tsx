// 섹션 제목 블록 (eyebrow 칩 + h2 + 선택적 설명, 가운데 정렬)

export default function SectionHeading({
  eyebrow,
  title,
  description,
  className = "mb-10",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={`${className} text-center`}>
      <span className="chip">{eyebrow}</span>
      <h2 className="section-title mt-3">{title}</h2>
      {description && <p className="mt-2 text-slate-500">{description}</p>}
    </div>
  );
}
