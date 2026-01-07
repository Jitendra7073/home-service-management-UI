import { ShieldAlert, Clock, RefreshCw, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface ProviderBlockScreenProps {
  status: "pending" | "restricted" | "rejected";
  reason?: string;
}

export default function ProviderBlockScreen({ status, reason }: ProviderBlockScreenProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        toast.error("Failed to log out");
        return;
      }

      const data = await res.json();
      toast.success(data.message || "Logout Successful");

      // Clear stored tokens (now handled by httpOnly cookies)
      // No need to manually clear localStorage

      router.push("/auth/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-md shadow-xl p-8 text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
          {status === "pending" ? (
            <Clock className="h-10 w-10 text-orange-500 animate-pulse" />
          ) : (
            <ShieldAlert className="h-10 w-10 text-destructive" />
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {status === "pending"
              ? "Approval Pending"
              : status === "rejected"
              ? "Account Rejected"
              : "Access Restricted"}
          </h1>
          
          <p className="text-gray-600">
            {status === "pending" && (
              "Your provider account is currently pending administrative approval. You will receive an email once your account is activated."
            )}
            {status === "rejected" && (
              "Your provider application has been rejected by the administration."
            )}
            {status === "restricted" && (
              "Your provider account has been restricted. You cannot access the dashboard at this time."
            )}
          </p>
        </div>

        {(reason && (status === "restricted" || status === "rejected")) && (
          <div className="bg-red-50 border border-red-100 rounded-md p-4 text-left">
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">
              Reason Provided
            </p>
            <p className="text-sm text-red-800">
              {reason}
            </p>
          </div>
        )}

        <div className="pt-4 flex flex-col gap-3">
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
