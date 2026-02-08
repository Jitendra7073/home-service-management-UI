import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    {
      href: "/admin/businesses?status=pending",
      title: "Pending Approvals",
      description: "Review and approve businesses",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      titleColor: "text-amber-900",
      descriptionColor: "text-amber-700",
      iconBgColor: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      href: "/admin/users",
      title: "Manage Users",
      description: "View and manage all users",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      titleColor: "text-blue-900",
      descriptionColor: "text-blue-700",
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      href: "/admin/businesses?status=restricted",
      title: "Restricted Content",
      description: "View restricted businesses",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
      titleColor: "text-rose-900",
      descriptionColor: "text-rose-700",
      iconBgColor: "bg-rose-100",
      iconColor: "text-rose-600",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`group flex items-center justify-between rounded-sm border ${action.borderColor} ${action.bgColor} p-4 transition-all hover:shadow-md`}
          >
            <div className="flex-1">
              <p className={`font-medium ${action.titleColor}`}>{action.title}</p>
              <p className={`text-sm ${action.descriptionColor}`}>
                {action.description}
              </p>
            </div>
            <ArrowRight className={`h-5 w-5 ${action.iconColor} transition-transform group-hover:translate-x-1 flex-shrink-0 ml-2`} />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
