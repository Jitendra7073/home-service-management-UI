import { Clock, AlertTriangle } from "lucide-react";

interface PaymentTimerProps {
  timeLeft: {
    minutes: number;
    seconds: number;
  };
}

export default function PaymentTimer({ timeLeft }: PaymentTimerProps) {
  const isExpired =
    timeLeft.minutes === 0 && timeLeft.seconds === 0;

  const isUrgent =
    timeLeft.minutes === 0 && timeLeft.seconds <= 60;

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 text-destructive bg-destructive/10 px-3 py-2 rounded-md border border-destructive/20">
        <AlertTriangle className="w-4 h-4" />
        <span className="text-sm font-medium">
          Payment link expired
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-md border ${
        isUrgent
          ? "text-destructive bg-destructive/10 border-destructive/20"
          : "text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-950/20 dark:border-orange-800/30"
      }`}
    >
      <Clock className="w-4 h-4" />
      <span className="text-sm font-medium">
        {timeLeft.minutes.toString().padStart(2, "0")}:
        {timeLeft.seconds.toString().padStart(2, "0")} remaining
      </span>
    </div>
  );
}
