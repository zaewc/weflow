import Hero from "@/components/home/Hero";
import CarePlanBenefits from "@/components/home/CarePlanBenefits";
import SuccessShowcase from "@/components/home/SuccessShowcase";
import ProcessSection from "@/components/ProcessSection";
import ReviewMarquee from "@/components/ReviewMarquee";
import { listCases } from "@/lib/store";

// 성공사례는 관리자가 수정할 수 있으므로 매 요청 최신값을 읽는다.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cases = await listCases();
  return (
    <>
      <Hero />
      <CarePlanBenefits />
      <SuccessShowcase cases={cases} />
      <ProcessSection />
      <ReviewMarquee />
    </>
  );
}
