import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Gallery4, type Gallery4Item } from "@/components/ui/gallery4";
import { CASES } from "@/lib/cases";

const ITEMS: Gallery4Item[] = CASES.map((c) => ({
  id: c.slug,
  title: c.name,
  description: c.summary,
  href: `/cases/${c.slug}`,
  image: c.image,
}));

// 홈 성공사례 — 가로 캐러셀(Gallery4) (메뉴얼 page 2)
export default function SuccessGallery() {
  return (
    <section className="bg-slate-50">
      <Gallery4
        title="성공사례"
        description="어디서도 볼 수 없는 업종별 전환 최적화 사례를 직접 확인하세요."
        items={ITEMS}
      />
      <div className="container-w pb-20 text-center">
        <Link href="/cases" className="btn-primary">
          성공사례 더보기 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
