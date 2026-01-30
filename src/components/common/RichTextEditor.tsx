"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill-new/dist/quill.snow.css";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamic import with no SSR to avoid "document is not defined"
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    return ({ forwardedRef, ...props }: any) => (
      <RQ ref={forwardedRef} {...props} />
    );
  },
  {
    ssr: false,
    loading: () => <Skeleton className="h-[300px] w-full rounded-md" />,
  },
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  // Modules for the toolbar
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image"],
        ["clean"],
      ],
    }),
    [],
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-background text-foreground"
      />
      <style jsx global>{`
        .ql-toolbar.ql-snow {
          border-color: hsl(var(--border));
          background-color: hsl(var(--muted) / 0.3);
          border-top-left-radius: var(--radius);
          border-top-right-radius: var(--radius);
        }
        .ql-container.ql-snow {
          border-color: hsl(var(--border));
          border-bottom-left-radius: var(--radius);
          border-bottom-right-radius: var(--radius);
          min-height: 200px;
          font-family: inherit;
          font-size: 0.95rem;
        }
        .ql-editor {
          min-height: 200px;
        }
        /* Prose-like styling inside editor */
        .ql-editor h1 {
          font-size: 1.5em;
          font-weight: bold;
          margin-bottom: 0.5em;
        }
        .ql-editor h2 {
          font-size: 1.3em;
          font-weight: bold;
          margin-bottom: 0.5em;
        }
      `}</style>
    </div>
  );
}
