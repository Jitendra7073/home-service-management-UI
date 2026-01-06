import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  substats?: Array<{
    label: string;
    value: number | string;
    icon?: LucideIcon;
    iconColor?: string;
    textColor?: string;
  }>;
  isLoading?: boolean;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  substats,
  isLoading = false,
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-16" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && (
          <p className="mt-2 text-xs text-muted-foreground">{description}</p>
        )}
        {substats && substats.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            {substats.map((stat, index) => (
              <div key={index} className="flex items-center gap-1">
                {stat.icon && (
                  <stat.icon className={`h-3 w-3 ${stat.iconColor || "text-muted-foreground"}`} />
                )}
                <span className="text-muted-foreground">{stat.label}: </span>
                <span className={`font-medium ${stat.textColor || "text-foreground"}`}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
