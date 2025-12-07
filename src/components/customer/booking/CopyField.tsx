"use client";

import { Copy, CheckCheck } from "lucide-react";

export default function CopyField({
    id,
    value,
    copiedField,
    onCopy,
}: {
    id: string;
    value: string;
    copiedField: string | null;
    onCopy: (id: string, value: string) => void;
}) {
    const isCopied = copiedField === id;

    return (
        <div
            className="flex justify-between items-center gap-2 cursor-pointer"
            onClick={() => onCopy(id, value)}
        >
            <p className="text-xs font-mono text-gray-600 break-all">
                {value.slice(0, 12)}...
            </p>

            {isCopied ? (
                <CheckCheck className="w-4 h-4 text-green-600" />
            ) : (
                <Copy className="w-4 h-4 text-gray-500" />
            )}
        </div>
    );
}
