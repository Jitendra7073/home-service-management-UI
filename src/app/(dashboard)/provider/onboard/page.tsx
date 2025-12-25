import OnboardSteps from "./onboard-steps";
import { Suspense } from "react";

export default function OnBoard() {
  return (
    <Suspense fallback={<OnBoardLoading />}>
      <div className="min-h-screen flex items-center justify-center">
      <OnboardSteps />
    </div>
    </Suspense>
  );
}

function OnBoardLoading() {
  return (
    <div className="p-6 text-center text-muted-foreground">
      OnBoard fallback loading...
    </div>
  );
}
