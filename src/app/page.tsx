import Hero from "@/components/home/Hero";
import CarePlanBenefits from "@/components/home/CarePlanBenefits";
import SuccessGallery from "@/components/home/SuccessGallery";
import ProcessSection from "@/components/ProcessSection";
import ReviewMarquee from "@/components/ReviewMarquee";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CarePlanBenefits />
      <SuccessGallery />
      <ProcessSection />
      <ReviewMarquee />
    </>
  );
}
