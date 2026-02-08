import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex min-h-[300px] flex-col items-center justify-center p-6">
        <Icon className="mb-4 h-16 w-16 text-muted-foreground/50" />
        <p className="text-lg font-semibold">{title}</p>
        <p className="mt-2 text-center text-sm text-muted-foreground max-w-md">
          {description}
        </p>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"
          >
            {actionLabel}
          </button>
        )}
      </CardContent>
    </Card>
  );
}
