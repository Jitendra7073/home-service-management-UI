import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Ban, CheckCircle, XCircle, Clock, Mail, Phone, MapPin } from "lucide-react";

interface BusinessCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  ownerName: string;
  ownerEmail: string;
  email?: string;
  phone?: string;
  address: string;
  isApproved: boolean;
  isRejected: boolean;
  isRestricted: boolean;
  restrictionReason?: string;
  onViewDetails: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onBlock?: () => void;
  onUnblock?: () => void;
  isActionPending?: boolean;
}

export function BusinessCard({
  id,
  name,
  description,
  category,
  ownerName,
  ownerEmail,
  email,
  phone,
  address,
  isApproved,
  isRejected,
  isRestricted,
  restrictionReason,
  onViewDetails,
  onApprove,
  onReject,
  onBlock,
  onUnblock,
  isActionPending = false,
}: BusinessCardProps) {
  const getStatusBadge = () => {
    if (isRestricted) {
      return (
        <Badge variant="destructive" className="gap-1">
          <Ban className="h-3 w-3" />
          Blocked
        </Badge>
      );
    }

    if (!isApproved && !isRejected) {
      return (
        <Badge variant="outline" className="gap-1 border-yellow-600 text-yellow-700">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    }

    if (isRejected) {
      return (
        <Badge variant="secondary" className="gap-1">
          <XCircle className="h-3 w-3" />
          Rejected
        </Badge>
      );
    }

    return (
      <Badge variant="default" className="gap-1 bg-emerald-600 hover:bg-emerald-700">
        <CheckCircle className="h-3 w-3" />
        Approved
      </Badge>
    );
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="mb-2 text-xl">{name}</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              {getStatusBadge()}
              <Badge variant="outline">{category}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-4">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {description}
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="truncate">{ownerName}</span>
          </div>
          {email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="truncate">{email}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{phone}</span>
            </div>
          )}
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{address}</span>
          </div>
        </div>

        {isRestricted && restrictionReason && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3">
            <p className="mb-1 text-xs font-semibold text-destructive">
              Restriction Reason
            </p>
            <p className="text-sm text-destructive">{restrictionReason}</p>
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

          {!isApproved && !isRejected && onApprove && onReject ? (
            <>
              <Button
                variant="default"
                size="sm"
                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                onClick={onApprove}
                disabled={isActionPending}
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="gap-2"
                onClick={onReject}
                disabled={isActionPending}
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
            </>
          ) : isRestricted && onUnblock ? (
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
