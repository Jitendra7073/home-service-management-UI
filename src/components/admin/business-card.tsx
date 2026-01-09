import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  User,
} from "lucide-react";

interface BusinessCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  ownerName: string;
  ownerEmail: string;
  email?: string;
  phone?: string;
  isApproved: boolean;
  isRejected: boolean;
  isRestricted: boolean;
  restrictionReason?: string;
  onViewDetails: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onBlock?: () => void;
  onUnblock?: () => void;
  actionLoading?: string | null;
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
  isApproved,
  isRejected,
  isRestricted,
  restrictionReason,
  onViewDetails,
  onApprove,
  onReject,
  onBlock,
  onUnblock,
  actionLoading = null,
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
        <Badge
          variant="outline"
          className="gap-1 border-yellow-600 text-yellow-700">
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
      <Badge
        variant="default"
        className="gap-1 bg-emerald-600 hover:bg-emerald-700">
        <CheckCircle className="h-3 w-3" />
        Approved
      </Badge>
    );
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow gap-0 p-0">
      <CardHeader className="bg-gray-800 p-5 text-white gap-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="mb-3 text-xl">{name}</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              {getStatusBadge()}
              <Badge
                variant="outline"
                className="text-gray-400 border-gray-400">
                {category}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-between h-full p-5 space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
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

        <div className="flex w-auto gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 w-[300px] gap-2 cursor-pointer"
            onClick={onViewDetails}>
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
                disabled={!!actionLoading}>
                {actionLoading === "approve" ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Approve
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="gap-2"
                onClick={onReject}
                disabled={!!actionLoading}>
                {actionLoading === "reject" ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                Reject
              </Button>
            </>
          ) : isRestricted && onUnblock ? (
            <Button
              variant="default"
              size="sm"
              className="gap-2"
              onClick={onUnblock}
              disabled={!!actionLoading}>
              {actionLoading === "unblock" ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Unblock
            </Button>
          ) : onBlock ? (
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={onBlock}
              disabled={!!actionLoading}>
              {actionLoading === "block" ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Ban className="h-4 w-4" />
              )}
              Block
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
