import { Badge } from "@/components/ui/badge";

export default function StatusBadge({ status }: { status: string }) {
    const variants: Record<string, string> = {
        Pending: "bg-yellow-50 text-yellow-700 border-yellow-300",
        Confirmed: "bg-green-50 text-green-700 border-green-300",
        Inprogress: "bg-blue-50 text-blue-700 border-blue-300",
        OnHold: "bg-purple-50 text-purple-700 border-purple-300",
        Completed: "bg-emerald-50 text-emerald-700 border-emerald-300",
        Cancelled: "bg-red-50 text-red-700 border-red-300",
        Rejected: "bg-rose-50 text-rose-700 border-rose-300",
        Failed: "bg-orange-50 text-orange-700 border-orange-300",
        Refunded: "bg-indigo-50 text-indigo-700 border-indigo-300",
        Closed: "bg-slate-50 text-slate-700 border-slate-300",
    };

    return (
        <Badge
            className={`border font-medium px-2 py-1 ${variants[status] || "bg-gray-50 text-gray-700 border-gray-200"
                }`}
        >
            {status}
        </Badge>
    );
}
