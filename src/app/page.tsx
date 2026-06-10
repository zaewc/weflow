import Hero from "@/components/home/Hero";
import CarePlanBenefits from "@/components/home/CarePlanBenefits";
import SuccessShowcase from "@/components/home/SuccessShowcase";
import ProcessSection from "@/components/ProcessSection";
import ReviewMarquee from "@/components/ReviewMarquee";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CarePlanBenefits />
      <SuccessShowcase />
      <ProcessSection />
      <ReviewMarquee />
    </>
  );
}
