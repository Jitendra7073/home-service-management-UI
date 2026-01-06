import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Ban, CheckCircle, Clock, DollarSign, Building2 } from "lucide-react";

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
  isActive: boolean;
  onViewDetails: () => void;
  onBlock?: () => void;
  onUnblock?: () => void;
  isActionPending?: boolean;
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
  isActive,
  onViewDetails,
  onBlock,
  onUnblock,
  isActionPending = false,
}: ServiceCardProps) {
  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow ${isRestricted ? "border-destructive/50" : ""} ${!isActive ? "opacity-60" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base line-clamp-1">{name}</CardTitle>
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
      <CardContent className="space-y-3">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {description}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration} mins</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>
              {currency === "INR" ? "₹" : "$"}{price}
            </span>
          </div>
        </div>

        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            <span className="truncate">{businessName}</span>
          </div>
          <div className="truncate">
            Category: {categoryName}
          </div>
        </div>

        {isRestricted && restrictionReason && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs">
            <p className="font-semibold text-destructive">Reason:</p>
            <p className="text-destructive line-clamp-2">{restrictionReason}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={onViewDetails}
          >
            <Eye className="h-4 w-4" />
            View Details
          </Button>
          {isRestricted && onUnblock ? (
            <Button
              variant="default"
              size="sm"
              className="gap-2"
              onClick={onUnblock}
              disabled={isActionPending}
            >
              <CheckCircle className="h-4 w-4" />
              Unblock
            </Button>
          ) : onBlock ? (
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={onBlock}
              disabled={isActionPending}
            >
              <Ban className="h-4 w-4" />
              Block
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
