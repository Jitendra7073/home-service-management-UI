import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Ban, Eye, Shield, User, Building } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserCardProps {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role: "customer" | "provider" | "admin";
  isRestricted: boolean;
  restrictionReason?: string;
  onViewDetails: () => void;
  onBlock?: () => void;
  onUnblock?: () => void;
  isBlocking?: boolean;
}

export function UserCard({
  id,
  name,
  email,
  mobile,
  role,
  isRestricted,
  restrictionReason,
  onViewDetails,
  onBlock,
  onUnblock,
  isBlocking = false,
}: UserCardProps) {
  const router = useRouter();

  const getRoleIcon = () => {
    switch (role) {
      case "customer":
        return <User className="h-4 w-4" />;
      case "provider":
        return <Building className="h-4 w-4" />;
      case "admin":
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow gap-0 p-0">
      <CardHeader className="bg-gray-800 p-5 text-white gap-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-gray-500">
                {name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                {getRoleIcon()}
                <span className="capitalize">{role}</span>
              </div>
            </div>
          </div>
          {isRestricted && (
            <Badge variant="destructive" className="gap-1">
              <Ban className="h-3 w-3" />
              Blocked
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-5">
        <div className="space-y-1 text-sm">
          <p className="text-muted-foreground">Email</p>
          <p className="font-medium">{email}</p>
        </div>
        {mobile && (
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground">Phone</p>
            <p className="font-medium">{mobile}</p>
          </div>
        )}
        {isRestricted && restrictionReason && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3">
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
          {role !== "admin" && onBlock && onUnblock && (
            <Button
              variant={isRestricted ? "default" : "destructive"}
              size="sm"
              className="gap-2"
              onClick={isRestricted ? onUnblock : onBlock}
              disabled={isBlocking}
            >
              {isRestricted ? (
                <>
                  <Shield className="h-4 w-4" />
                  Unblock
                </>
              ) : (
                <>
                  <Ban className="h-4 w-4" />
                  Block
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
