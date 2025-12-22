"use client";

import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Assuming you have an AlertDialog component

interface TeamListProps {
  serviceId: string;
  isEditing: boolean;
}

interface TeamMemberForm {
  id?: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  role: string;
  status: "Available" | "Busy" | "Off";
}

interface MemberData {
  id: string;
  name: string;
  role: string;
  status: string;
  avatar?: string;
  email: string;
  phone: string;
  description: string;
}

export function TeamList({ serviceId, isEditing }: TeamListProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false); // For Add/Edit Modal
  const [deleteOpen, setDeleteOpen] = useState(false); // For Delete Confirmation
  const [form, setForm] = useState<TeamMemberForm | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["service-teams", serviceId],
    queryFn: async () => {
      const res = await fetch(`/api/provider/teams/${serviceId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || "Failed to fetch team members");
      }
      const data = await res.json();
      return data.members as MemberData[]; 
    },
    enabled: !!serviceId, 
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: TeamMemberForm) => {
      const isUpdate = !!payload.id;
      let url = `/api/provider/teams/${serviceId}`;
      let method: "POST" | "PATCH" = "POST";

      if (isUpdate) {
        method = "PATCH";
        url = `${url}?memberId=${payload.id}`;
      }

      const bodyToSend = { ...payload };
      if (!isUpdate) delete bodyToSend.id;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyToSend),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || "API request failed");
      }
      return res.json();
    },
    onSuccess: (data, variables) => {
      const action = variables.id ? "updated" : "created";
      toast.success(`Team member ${action} successfully`);
      setOpen(false);
      setForm(null);
      // Invalidate the query to refetch the list
      queryClient.invalidateQueries({
        queryKey: ["service-teams", serviceId],
      });
    },
    onError: (error) => toast.error(error.message || "Something went wrong during save."),
  });

  /* 3. DELETE MUTATION */
  const deleteMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const url = `/api/provider/teams/${serviceId}?memberId=${memberId}`;
      const res = await fetch(url, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || "API request failed");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Team member deleted successfully");
      setDeleteOpen(false);
      setForm(null);
      queryClient.invalidateQueries({
        queryKey: ["service-teams", serviceId],
      });
    },
    onError: (error) => toast.error(error.message || "Failed to delete member."),
  });

  const openCreate = () => {
    setForm({
      name: "",
      description: "",
      email: "",
      phone: "",
      role: "",
      status: "Available",
    });
    setOpen(true);
  };

  const openEdit = (member: MemberData) => {
    setForm({
      id: member.id,
      name: member.name,
      description: member.description,
      email: member.email,
      phone: member.phone,
      role: member.role,
      status: member.status as TeamMemberForm["status"],
    });
    setOpen(true);
  };

  const openDeleteConfirmation = (member: MemberData) => {
    setForm({
      id: member.id,
      name: member.name,
      description: member.description,
      email: member.email,
      phone: member.phone,
      role: member.role,
      status: member.status as TeamMemberForm["status"],
    });
    setDeleteOpen(true);
  }

  const handleDelete = () => {
    if (form?.id) {
      deleteMutation.mutate(form.id);
    }
  }


  return (
    <>
      <Card className="rounded-md border-gray-200 space-y-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Team Members</CardTitle>
          {isEditing && (
            <Button size="sm" variant="outline" onClick={openCreate}>
              <Plus className="w-3 h-3" />
            </Button>
          )}
        </CardHeader>

        <CardDescription className="px-6">
          List of team members who can provide this service.
        </CardDescription>

        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4 text-sm text-muted-foreground">Loading team...</div>
          ) : (
            data?.length === 0 ? (
                <div className="text-center py-4 text-sm text-muted-foreground">No team members assigned yet.</div>
            ) : (
                data?.map((member: MemberData) => (
                    <div key={member.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border">
                          {/* Use member.avatar if available, otherwise use a placeholder */}
                          <AvatarImage src={"https://palms-awss3-repository.s3-us-west-2.amazonaws.com/MyODP_Content/Course+Content/Provider+Profile/icons/provider+profile.png"} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`
                              ${member.status.toLowerCase() === "available" ? "bg-green-50 text-green-700 border-green-200" : ""}
                              ${member.status.toLowerCase() === "busy" ? "bg-amber-50 text-amber-700 border-amber-200" : ""}
                              ${member.status.toLowerCase() === "off" ? "bg-gray-100 text-gray-600 border-gray-300" : ""}
                            `}>
                            {member.status}
                          </Badge>

                          {isEditing && (
                              <>
                                  <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 text-gray-500 hover:text-blue-600"
                                      onClick={() => openEdit(member)}>
                                      <Pencil className="w-3 h-3" />
                                  </Button>
                                  <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 text-gray-500 hover:text-red-600"
                                      onClick={() => openDeleteConfirmation(member)}>
                                      <Trash2 className="w-3 h-3" />
                                  </Button>
                              </>
                          )}
                      </div>
                    </div>
                  ))
            )
          )}

          {!isEditing && (
            <div className="py-2 px-3 rounded-sm bg-blue-50 border border-blue-200 text-[12px] text-blue-800 font-medium">
              You can also add team partners for this service. (click on Edit)
            </div>
          )}
        </CardContent>
      </Card>

      {/* ------------------------------ ADD/EDIT MODAL ------------------------------ */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {form?.id ? "Edit Team Member" : "Add Team Member"}
            </DialogTitle>
          </DialogHeader>

          {form && (
            <div className="space-y-4">
              <Input
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <Textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <Input
                  placeholder="Phone"
                  type="tel" // Use type tel for better mobile usability
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  placeholder="Role (e.g., Technician, Assistant)"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                />

                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v as any })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Busy">Busy</SelectItem>
                    <SelectItem value="Off">Off</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              disabled={isPending || !form?.name || !form?.email} // Simple validation
              onClick={() => mutate(form!)}
              className="w-full">
              {isPending ? "Saving..." : "Save Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* ------------------------------ DELETE CONFIRMATION ------------------------------ */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action will permanently delete <b>{form?.name}</b> from this service team. 
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                      onClick={handleDelete} 
                      disabled={deleteMutation.isPending}
                      className="bg-red-600 hover:bg-red-700">
                      {deleteMutation.isPending ? "Deleting..." : "Delete Member"}
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}