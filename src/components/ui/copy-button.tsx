"use client";

import { Check, Clipboard } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

interface CopyButtonProps {
  content: string;
  className?: string;
}

export function CopyButton({ content, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-fd-muted-foreground transition-colors  hover:text-fd-accent-foreground",
        className
      )}
      aria-label="Copy code to clipboard"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
        </>
      ) : (
        <>
          <Clipboard className="h-4 w-4" />
        </>
      )}
    </button>
  );
}
