import CategoryList from "@/components/customer/business-profile-list";
import HeroSection from "@/components/customer/HeroSection";
import HowItWorks from "@/components/customer/how-it-works";

export default async function Customer() {
  return (
    <>
      <HeroSection />
      <CategoryList isVisible={true} search={false} />
      <HowItWorks />
    </>
  );
}
