import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Ban, CheckCircle, Clock, Building2 } from "lucide-react";

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  currency?: string;
  businessName: string;
  categoryName: string;
  isRestricted: boolean;
  restrictionReason?: string;
  restrictionRequestMessage?: string;
  isActive: boolean;
  onViewDetails: () => void;
  onBlock?: () => void;
  onUnblock?: () => void;
  isActionPending?: boolean;
  className?: string;
}

export function ServiceCard({
  id,
  name,
  description,
  duration,
  price,
  currency = "INR",
  businessName,
  categoryName,
  isRestricted,
  restrictionReason,
  restrictionRequestMessage,
  isActive,
  onViewDetails,
  onBlock,
  onUnblock,
  isActionPending = false,
  className,
}: ServiceCardProps) {
  return (
    <Card
      className={`overflow-hidden p-0 w-full gap-0 border-0 hover:shadow-md transition-shadow ${
        isRestricted ? "border-1 border-destructive/50" : ""
      } ${!isActive ? "opacity-60" : ""} ${className || ""}`}>
      <CardHeader className="bg-gray-800 p-5 text-white gap-0">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold capitalize">
            {name}
          </CardTitle>
          <div className="flex gap-1">
            {isRestricted && (
              <Badge variant="destructive" className="gap-1">
                <Ban className="h-3 w-3" />
                Blocked
              </Badge>
            )}
            {!isActive && (
              <Badge variant="secondary" className="gap-1">
                Inactive
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-5">
        <p className="text-sm text-muted-foreground">
          <i>
            {description &&
              description.charAt(0).toUpperCase() + description.slice(1)}
          </i>
        </p>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration} mins</span>
          </div>
          <div className="flex items-center gap-1">
            <span>
              {currency === "INR" ? "₹" : "$"}
              {price}
            </span>
          </div>
        </div>

        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            <span className="truncate">{businessName}</span>
          </div>
          <div className="truncate">Category: {categoryName}</div>
        </div>

        {isRestricted && restrictionReason && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3">
            <p className="mb-1 text-xs font-semibold text-destructive">
              Restriction Reason
            </p>
            <p className="text-sm text-destructive">
              {restrictionReason &&
                restrictionReason.charAt(0).toUpperCase() +
                  restrictionReason.slice(1)}
            </p>
          </div>
        )}

        <div className="flex w-fit gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 w-[300px] gap-2 cursor-pointer"
            onClick={onViewDetails}>
            <Eye className="h-4 w-4" />
            View Details
          </Button>
          {isRestricted && onUnblock ? (
            <Button
              variant="default"
              size="sm"
              className="gap-2 cursor-pointer"
              onClick={onUnblock}
              disabled={isActionPending}>
              {isActionPending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              {isActionPending ? "Unblocking..." : "Unblock"}
            </Button>
          ) : onBlock ? (
            <Button
              variant="destructive"
              size="sm"
              className="gap-2 cursor-pointer"
              onClick={onBlock}
              disabled={isActionPending}>
              {isActionPending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Ban className="h-4 w-4" />
              )}
              {isActionPending ? "Blocking..." : "Block"}
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
