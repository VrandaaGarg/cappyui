import { readFileSync } from "fs";
import { resolve } from "path";
import { codeToHtml } from "shiki";
import { CopyButton } from "./copy-button";

interface SourceCodeBlockProps {
  filePath: string;
  language?: string;
  title?: string;
}

export async function SourceCodeBlock({
  filePath,
  language,
  title,
}: SourceCodeBlockProps) {
  let content: string;
  let detectedLanguage: string;
  let html: string;

  try {
    // Resolve the file path relative to the project root
    const absolutePath = resolve(process.cwd(), filePath);
    content = readFileSync(absolutePath, "utf-8");

    // Auto-detect language from file extension if not provided
    if (!language) {
      const ext = filePath.split(".").pop()?.toLowerCase();
      const languageMap: Record<string, string> = {
        tsx: "tsx",
        ts: "typescript",
        jsx: "jsx",
        js: "javascript",
        py: "python",
        rb: "ruby",
        go: "go",
        rs: "rust",
        java: "java",
        cpp: "cpp",
        c: "c",
        css: "css",
        scss: "scss",
        html: "html",
        json: "json",
        yaml: "yaml",
        yml: "yaml",
        md: "markdown",
        sh: "bash",
        bash: "bash",
      };
      detectedLanguage = languageMap[ext || ""] || "typescript";
    } else {
      detectedLanguage = language;
    }

    // Generate highlighted HTML using Shiki
    html = await codeToHtml(content, {
      lang: detectedLanguage,
      themes: {
        light: "github-light",
        dark: "github-dark-default",
      },
      defaultColor: false,
    });
  } catch (error) {
    content = `Error: Could not read file at path "${filePath}"\n${
      error instanceof Error ? error.message : String(error)
    }`;
    html = `<pre><code>${content}</code></pre>`;
  }

  return (
    <div className="not-prose my-6 rounded-lg border border-fd-border bg-fd-background dark:bg-neutral-950/50">
      <div className="flex items-center justify-between px-4 py-2 border-b border-fd-border bg-fd-muted/30 dark:bg-neutral-900/50">
        <div className="text-sm font-medium text-fd-muted-foreground">
          {title || filePath}
        </div>
        <CopyButton content={content} />
      </div>
      <div
        className="overflow-auto max-h-[800px] [&>pre]:!mt-0 [&>pre]:!mb-0 [&>pre]:!bg-transparent [&>pre]:!border-0 [&>pre]:rounded-none [&>pre]:p-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-fd-muted/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-fd-muted/70"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(156, 163, 175, 0.5) transparent",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
