"use client";

import {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, FileText, Loader2, UploadCloud } from "lucide-react";

import { cn } from "@/lib/utils";

const LOCAL_STORAGE_KEY = "resume-builder-demo";
const STEP_DELAY = 1100;

type StepStatus = "pending" | "active" | "complete";
type ViewState = "idle" | "processing";

interface ResumeBuilderProps {
  className?: string;
}

interface StoredResume {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

const PROCESSING_STEPS = [
  "Parsing data from resume",
  "Collecting and analysing experience",
  "Extracting skills and keywords",
  "Preparing tailored resume output",
];



const ResumeBuilder = ({ className }: ResumeBuilderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timersRef = useRef<number[]>([]);

  const [viewState, setViewState] = useState<ViewState>("idle");
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(
    PROCESSING_STEPS.map(() => "pending")
  );
  const [currentFile, setCurrentFile] = useState<StoredResume | null>(null);
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  const resetFlow = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    setStepStatuses(PROCESSING_STEPS.map(() => "pending"));
    setCurrentFile(null);
    setJustCompleted(false);
  }, []);

  const persistFile = useCallback(async (file: File) => {
    const payload: StoredResume = {
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
      uploadedAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    }
  }, []);

  const beginProcessing = useCallback(
    (file: File) => {
      resetFlow();

      const metadata: StoredResume = {
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        uploadedAt: new Date().toISOString(),
      };

      setCurrentFile(metadata);
      setViewState("processing");
      setStepStatuses(
        PROCESSING_STEPS.map((_, index) => (index === 0 ? "active" : "pending"))
      );

      PROCESSING_STEPS.forEach((_, index) => {
        const timer = window.setTimeout(() => {
          setStepStatuses((prev) =>
            prev.map((status, idx) => {
              if (idx < index) return "complete";
              if (idx === index) return "active";
              return "pending";
            })
          );
        }, index * STEP_DELAY);
        timersRef.current.push(timer);
      });

      const completionTimer = window.setTimeout(async () => {
        setStepStatuses(PROCESSING_STEPS.map(() => "complete"));
        await persistFile(file);
        setStepStatuses(PROCESSING_STEPS.map(() => "pending"));
        setCurrentFile(null);
        setViewState("idle");
        setJustCompleted(true);

        const successTimer = window.setTimeout(() => {
          setJustCompleted(false);
        }, 2200);
        timersRef.current.push(successTimer);
      }, PROCESSING_STEPS.length * STEP_DELAY + 500);

      timersRef.current.push(completionTimer);
    },
    [persistFile, resetFlow]
  );

  const handleFileSelect = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      beginProcessing(file);
      event.target.value = "";
    },
    [beginProcessing]
  );

  const triggerFilePicker = useCallback(() => {
    if (viewState === "processing") return;
    fileInputRef.current?.click();
  }, [viewState]);



  return (
    <div
      className={cn(
        "relative max-w-xl mx-auto flex min-h-[24rem] items-center justify-center overflow-hidden rounded-lg border border-neutral-200/60 bg-neutral-50/70 p-3 md:p-8 shadow-xl backdrop-blur dark:border-neutral-800/70 dark:bg-neutral-900/50",
        className
      )}
    >
      <AnimatePresence>
        {justCompleted && (
          <motion.div
            key="resume-toast"
            className="absolute top-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full min-w-[280px] bg-neutral-900 px-3 md:px-4 py-2 text-sm font-medium text-white shadow-lg shadow-neutral-900/20 dark:bg-white dark:text-neutral-900"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Resume processed successfully
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-36 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-br from-violet-400/30 via-sky-300/20 to-transparent blur-3xl dark:from-blue-500/20 dark:via-violet-600/10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.rtf"
        className="hidden"
        onChange={handleFileSelect}
      />

      <AnimatePresence mode="wait">
        {viewState === "idle" && (
          <motion.div
            key="idle"
            className="relative flex w-full max-w-md flex-col items-center gap-3 rounded-xl border-2 border-dashed border-neutral-300/80 bg-white/80 p-10 text-center shadow-sm dark:border-neutral-700/60 dark:bg-neutral-950/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              <UploadCloud className="h-7 w-7" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xl font-semibold text-neutral-900 dark:text-white">
                Upload resume
              </span>
              <span className="mx-auto max-w-xs text-xs text-neutral-500 dark:text-neutral-400">
                Choose a PDF or DOCX to preview the AI resume building journey.
              </span>
            </div>
            <motion.button
              type="button"
              onClick={triggerFilePicker}
              className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
              whileTap={{ scale: 0.97 }}
            >
              Select file
            </motion.button>
            <AnimatePresence></AnimatePresence>
          </motion.div>
        )}

        {viewState === "processing" && (
          <motion.div
            key="processing"
            className="w-full max-w-md z-50 rounded-lg border border-neutral-200/70 bg-white/90 p-4 md:p-8 shadow-xl dark:border-neutral-800/60 dark:bg-neutral-950/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200/80 bg-neutral-100/70 px-3 py-4 dark:border-neutral-800/70 dark:bg-neutral-900/60">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    Processing resume
                  </span>
                  <span className="text-[14px] font-semibold text-neutral-900 dark:text-white">
                    {currentFile?.name ?? "resume.pdf"}
                  </span>
                </div>
              </div>
              <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
            </div>

            <div className="mt-5 space-y-2.5">
              {PROCESSING_STEPS.map((label, index) => {
                const state = stepStatuses[index];
                return (
                  <motion.div
                    key={label}
                    className="flex items-center gap-3 rounded-lg border border-neutral-200/70 bg-white/80 px-2 py-0.5 dark:border-neutral-800/70 dark:bg-neutral-900/70"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200/70 bg-neutral-100/60 dark:border-neutral-800/70 dark:bg-neutral-900/60">
                      <FileText className="h-4 w-4 text-neutral-400" />
                    </div>
                    <p className="flex-1 text-sm font-medium text-neutral-600 dark:text-neutral-300">
                      {label}
                    </p>
                    <div className="flex h-6 w-6 items-center justify-center">
                      {state === "complete" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : state === "active" ? (
                        <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeBuilder;
