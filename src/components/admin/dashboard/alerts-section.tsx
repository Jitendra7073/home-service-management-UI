import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ban } from "lucide-react";

interface AlertsSectionProps {
  restrictedUsers?: number;
  restrictedBusinesses?: number;
}

export function AlertsSection({ restrictedUsers = 0, restrictedBusinesses = 0 }: AlertsSectionProps) {
  if (restrictedUsers === 0 && restrictedBusinesses === 0) {
    return null;
  }

  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <Ban className="h-5 w-5" />
          Attention Required
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-destructive">
          {restrictedUsers > 0 && `${restrictedUsers} restricted user${restrictedUsers > 1 ? "s" : ""}. `}
          {restrictedBusinesses > 0 && `${restrictedBusinesses} restricted business${restrictedBusinesses > 1 ? "es" : ""}.`}
        </p>
      </CardContent>
    </Card>
  );
}
