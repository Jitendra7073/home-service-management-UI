"use client";

import { useEffect, useState } from "react";
import ConfettiBurst from "./ConfettiBurst";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WelcomeScreen() {
  const router = useRouter();
  const fireConfetti = ConfettiBurst();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    fireConfetti();
    // const timer = setInterval(() => {
    //   setCountdown((prev) => {
    //     if (prev <= 1) {
    //       clearInterval(timer);
    //       router.push("/provider/dashboard");
    //     }
    //     return prev - 1;
    //   });
    //   fireConfetti();
    // }, 2000);

    // return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      {/* Success Icon */}
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold mt-6 text-gray-900">
        Welcome Onboard! 🎉
      </h1>

      {/* Message */}
      <p className="text-gray-600 mt-3 max-w-md text-base sm:text-lg">
        Your provider account is successfully set up. You will now be redirected
        to your provider dashboard.
      </p>

      {/* Countdown */}
      <p className="mt-6 text-gray-700 font-medium text-lg">
        Redirecting in <span className="text-blue-600">{countdown}</span>{" "}
        seconds...
      </p>

      {/* Loader */}
      <div className="mt-8">
        <div className="w-10 h-10 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    </div>
  );
}
