"use client";

import { Check, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/cn";

interface CopyPromptButtonProps {
  prompt?: string;
  promptPath?: string;
  className?: string;
}

export function CopyPromptButton({
  prompt,
  promptPath,
  className,
}: CopyPromptButtonProps) {
  const [copied, setCopied] = useState(false);
  const [promptContent, setPromptContent] = useState(prompt || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (promptPath && !prompt) {
      setLoading(true);
      fetch(`/${promptPath}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to load prompt: ${res.statusText}`);
          }
          return res.text();
        })
        .then((text) => {
          setPromptContent(text);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load prompt:", err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [promptPath, prompt]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (error) {
    return (
      <div className="text-sm text-red-500">Error loading prompt: {error}</div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={loading || !promptContent}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-foreground px-4 py-2 text-sm font-medium text-fd-background transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {loading ? (
        <>
          <Copy className="h-4 w-4 animate-pulse" />
          Loading...
        </>
      ) : copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copy Prompt
        </>
      )}
    </button>
  );
}
