import { Star, TrendingUp, Users, Banknote } from "lucide-react";
import { ServiceData } from "./types";
import { Card, CardContent } from "@/components/ui/card";

export function ServiceStats({ data }: { data: ServiceData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard icon={Star} label="Rating" value={data.averageRating} sub={`${data.reviewCount} Reviews`} />
      <StatCard icon={Banknote} label="Price" value={data.price} sub={data.currency} />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }: any) {
  return (
    <Card>
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-xs text-gray-400">{sub}</p>
        </div>
        <Icon className="w-8 h-8 text-blue-500 opacity-20" />
      </CardContent>
    </Card>
  );
}