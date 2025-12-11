import OnboardSteps from "./onboard-steps";
// import { getProviderOnboardingStatus } from "@/lib/provider";

const OnBoard = async () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <OnboardSteps />
    </div>
  );
};

export default OnBoard;
