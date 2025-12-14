"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

/* ================= TYPES ================= */

type CreateServicePayload = {
    name: string;
    description: string;
    durationInMinutes: number;
    price: number;
    currency: "INR" | "USD" | "EUR";
    isActive: boolean;
    coverImage?: string[];
    images?: string[];
};

interface AddServiceModalProps {
    open: boolean;
    onClose: () => void;
}

/* ================= COMPONENT ================= */

export default function AddServiceModal({
    open,
    onClose,
}: AddServiceModalProps) {
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState<CreateServicePayload>({
        name: "",
        description: "",
        durationInMinutes: 30,
        price: 0,
        currency: "INR",
        isActive: true,
        coverImage: [],
        images: [],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    /* ================= VALIDATION (CREATE ONLY) ================= */

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!form.name || form.name.length < 5) {
            newErrors.name = "Name must be at least 5 characters";
        }

        if (!form.description || form.description.length < 10) {
            newErrors.description = "Description must be at least 10 characters";
        }

        if (!form.durationInMinutes || form.durationInMinutes <= 0) {
            newErrors.durationInMinutes = "Duration must be greater than 0";
        }

        if (form.price < 0) {
            newErrors.price = "Price must be 0 or more";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ================= IMAGE HANDLERS ================= */

    const addCoverImage = (url: string) => {
        if (!url) return;
        setForm({ ...form, coverImage: [url] });
    };

    const addServiceImage = (url: string) => {
        if (!url) return;
        setForm({ ...form, images: [...(form.images || []), url] });
    };

    const removeServiceImage = (index: number) => {
        const updated = [...(form.images || [])];
        updated.splice(index, 1);
        setForm({ ...form, images: updated });
    };

    /* ================= SUBMIT ================= */

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setLoading(true);

            const payload = {
                ...form,
                coverImage: form.coverImage?.length ? form.coverImage : undefined,
                images: form.images?.length ? form.images : undefined,
            };

            const res = await fetch("/api/provider/service", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data?.msg || "Failed to create service");
                return;
            }

            toast.success("Service created successfully");
            onClose();

            setForm({
                name: "",
                description: "",
                durationInMinutes: 30,
                price: 0,
                currency: "INR",
                isActive: true,
                coverImage: [],
                images: [],
            });
            setErrors({});
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    /* ================= UI ================= */

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add New Service</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Name */}
                    <Field label="Service Name *" error={errors.name}>
                        <Input
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            placeholder="Enter service name"
                        />
                    </Field>

                    {/* Description */}
                    <Field label="Description *" error={errors.description}>
                        <Textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                            placeholder="Describe your service"
                        />
                    </Field>

                    {/* Duration */}
                    <Field
                        label="Duration (minutes) *"
                        error={errors.durationInMinutes}
                    >
                        <Input
                            type="number"
                            value={form.durationInMinutes}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    durationInMinutes: Number(e.target.value),
                                })
                            }
                        />
                    </Field>

                    {/* Price */}
                    <Field label="Price *" error={errors.price}>
                        <Input
                            type="number"
                            value={form.price}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    price: Number(e.target.value),
                                })
                            }
                        />
                    </Field>

                    {/* Currency */}
                    <Field label="Currency">
                        <Select
                            value={form.currency}
                            onValueChange={(value) =>
                                setForm({ ...form, currency: value as any })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="INR">INR</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>

                    {/* Cover Image */}
                    <Field label="Cover Image (URL)">
                        <Input
                            placeholder="Paste cover image URL"
                            onBlur={(e) => addCoverImage(e.target.value)}
                        />
                        {form.coverImage?.[0] && (
                            <p className="text-xs text-green-600">
                                Cover image added
                            </p>
                        )}
                    </Field>

                    {/* Service Images */}
                    <Field label="Service Images (URLs)">
                        <Input
                            placeholder="Paste image URL and press enter"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addServiceImage(
                                        (e.target as HTMLInputElement).value
                                    );
                                    (e.target as HTMLInputElement).value = "";
                                }
                            }}
                        />

                        {form.images?.length ? (
                            <ul className="space-y-1 text-sm">
                                {form.images.map((img, idx) => (
                                    <li
                                        key={idx}
                                        className="flex justify-between items-center"
                                    >
                                        <span className="truncate">{img}</span>
                                        <button
                                            onClick={() => removeServiceImage(idx)}
                                            className="text-red-500 text-xs"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </Field>

                    {/* Active */}
                    <div className="flex items-center justify-between pt-2">
                        <Label>Active</Label>
                        <Switch
                            checked={form.isActive}
                            onCheckedChange={(val) =>
                                setForm({ ...form, isActive: val })
                            }
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? "Creating..." : "Create Service"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

/* ================= REUSABLE FIELD ================= */

function Field({
    label,
    children,
    error,
}: {
    label: string;
    children: React.ReactNode;
    error?: string;
}) {
    return (
        <div className="space-y-1">
            <Label>{label}</Label>
            {children}
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
