"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Upload,
  ChevronDown,
  Paperclip,
  X,
  FileText,
  Image,
  File,
  Loader2,
  Search,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SiClaude } from "react-icons/si";
import { TbBrandOpenai } from "react-icons/tb";
import { RiGeminiFill } from "react-icons/ri";
import { FaTools } from "react-icons/fa";

// Constants
const ICON_SIZE = "h-4 w-4";
const DROPDOWN_ANIMATION = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

// Custom SVG Icons
const QwenIcon = ({ className }: { className?: string }) => (
  <svg
    fill="currentColor"
    fillRule="evenodd"
    height="1em"
    style={{ flex: "none", lineHeight: 1 }}
    viewBox="0 0 24 24"
    width="1em"
    className={className}
  >
    <path d="M12.604 1.34c.393.69.784 1.382 1.174 2.075a.18.18 0 00.157.091h5.552c.174 0 .322.11.446.327l1.454 2.57c.19.337.24.478.024.837-.26.43-.513.864-.76 1.3l-.367.658c-.106.196-.223.28-.04.512l2.652 4.637c.172.301.111.494-.043.77-.437.785-.882 1.564-1.335 2.34-.159.272-.352.375-.68.37-.777-.016-1.552-.01-2.327.016a.099.099 0 00-.081.05 575.097 575.097 0 01-2.705 4.74c-.169.293-.38.363-.725.364-.997.003-2.002.004-3.017.002a.537.537 0 01-.465-.271l-1.335-2.323a.09.09 0 00-.083-.049H4.982c-.285.03-.553-.001-.805-.092l-1.603-2.77a.543.543 0 01-.002-.54l1.207-2.12a.198.198 0 000-.197 550.951 550.951 0 01-1.875-3.272l-.79-1.395c-.16-.31-.173-.496.095-.965.465-.813.927-1.625 1.387-2.436.132-.234.304-.334.584-.335a338.3 338.3 0 012.589-.001.124.124 0 00.107-.063l2.806-4.895a.488.488 0 01.422-.246c.524-.001 1.053 0 1.583-.006L11.704 1c.341-.003.724.032.9.34zm-3.432.403a.06.06 0 00-.052.03L6.254 6.788a.157.157 0 01-.135.078H3.253c-.056 0-.07.025-.041.074l5.81 10.156c.025.042.013.062-.034.063l-2.795.015a.218.218 0 00-.2.116l-1.32 2.31c-.044.078-.021.118.068.118l5.716.008c.046 0 .08.02.104.061l1.403 2.454c.046.081.092.082.139 0l5.006-8.76.783-1.382a.055.055 0 01.096 0l1.424 2.53a.122.122 0 00.107.062l2.763-.02a.04.04 0 00.035-.02.041.041 0 000-.04l-2.9-5.086a.108.108 0 010-.113l.293-.507 1.12-1.977c.024-.041.012-.062-.035-.062H9.2c-.059 0-.073-.026-.043-.077l1.434-2.505a.107.107 0 000-.114L9.225 1.774a.06.06 0 00-.053-.031zm6.29 8.02c.046 0 .058.02.034.06l-.832 1.465-2.613 4.585a.056.056 0 01-.05.029.058.058 0 01-.05-.029L8.498 9.841c-.02-.034-.01-.052.028-.054l.216-.012 6.722-.012z" />
  </svg>
);

const DeepSeekIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    style={{ flex: "none", lineHeight: 1 }}
    className={className}
  >
    <path
      fill="currentColor"
      d="M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 0 1-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 0 0-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 0 1-.465.137 9.597 9.597 0 0 0-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 0 0 1.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 0 1 1.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 0 1 .415-.287.302.302 0 0 1 .2.288.306.306 0 0 1-.31.307.303.303 0 0 1-.304-.308zm3.11 1.596c-.2.081-.399.151-.59.16a1.245 1.245 0 0 1-.798-.254c-.274-.23-.47-.358-.552-.758a1.73 1.73 0 0 1 .016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559 0 0 1-.254-.078.253.253 0 0 1-.114-.358c.028-.054.16-.186.192-.21.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z"
    />
  </svg>
);

// AI Models data
const AI_MODELS = {
  claude: [
    {
      id: "claude-sonnet-4",
      name: "Claude Sonnet 4",
      icon: <SiClaude className="h-4 w-4" />,
    },
    {
      id: "claude-sonnet-4.5",
      name: "Claude Sonnet 4.5",
      icon: <SiClaude className="h-4 w-4" />,
    },
    {
      id: "claude-haiku-3.5",
      name: "Claude Haiku 3.5",
      icon: <SiClaude className="h-4 w-4" />,
    },
  ],
  google: [
    {
      id: "gemini-2.5-pro",
      name: "Gemini 2.5 Pro",
      icon: <RiGeminiFill className="h-4 w-4" />,
    },
    {
      id: "gemini-2.5-flash",
      name: "Gemini 2.5 Flash",
      icon: <RiGeminiFill className="h-4 w-4" />,
    },
  ],
  openai: [
    {
      id: "openai-5",
      name: "OpenAI 5",
      icon: <TbBrandOpenai className="h-4 w-4" />,
    },
    {
      id: "openai-5-nano",
      name: "OpenAI 5 Nano",
      icon: <TbBrandOpenai className="h-4 w-4" />,
    },
    {
      id: "openai-5-mini",
      name: "OpenAI 5 Mini",
      icon: <TbBrandOpenai className="h-4 w-4" />,
    },
    {
      id: "openai-o4-mini",
      name: "OpenAI o4 Mini",
      icon: <TbBrandOpenai className="h-4 w-4" />,
    },
  ],
  qwen: [
    {
      id: "qwen-3-max",
      name: "Qwen3 Max",
      icon: <QwenIcon className="h-4 w-4" />,
    },
    {
      id: "qwen-3-235b-a22b",
      name: "Qwen3 235B A22B",
      icon: <QwenIcon className="h-4 w-4" />,
    },
    {
      id: "qwen-3-30b-a3b-thinking-2507",
      name: "Qwen3 30B A3B Thinking 2507",
      icon: <QwenIcon className="h-4 w-4" />,
    },
  ],
  deepseek: [
    {
      id: "deepseek-r1-fast",
      name: "DeepSeek R1 Fast",
      icon: <DeepSeekIcon className="h-4 w-4" />,
    },
    {
      id: "deepseek-v3.1",
      name: "DeepSeek V3.1",
      icon: <DeepSeekIcon className="h-4 w-4" />,
    },
  ],
};

// Style options
const STYLE_OPTIONS = [
  {
    id: "technical",
    name: "Technical",
    description: "Detailed technical explanations",
  },
  {
    id: "study",
    name: "Study",
    description: "Educational and learning focused",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional and formal tone",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Business and work appropriate",
  },
  { id: "formal", name: "Formal", description: "Structured and official" },
];

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  isUploading: boolean;
  progress: number;
}

interface ChatInputBoxProps {
  className?: string;
}

export default function ChatInputBox({ className }: ChatInputBoxProps) {
  const [message, setMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("claude-sonnet-4");
  const [selectedStyle, setSelectedStyle] = useState("classic");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const [modelSearchQuery, setModelSearchQuery] = useState("");
  const [webSearch, setWebSearch] = useState(false);
  const [redditSearch, setRedditSearch] = useState(false);
  const [createImage, setCreateImage] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);

  // Get selected model details
  const getSelectedModelDetails = useCallback(() => {
    for (const category of Object.values(AI_MODELS)) {
      const model = category.find((m) => m.id === selectedModel);
      if (model) return model;
    }
    return AI_MODELS.claude[0];
  }, [selectedModel]);

  const selectedModelDetails = getSelectedModelDetails();

  // Get selected style details
  const getSelectedStyleDetails = useCallback(() => {
    return (
      STYLE_OPTIONS.find((style) => style.id === selectedStyle) ||
      STYLE_OPTIONS[2]
    ); // Default to classic
  }, [selectedStyle]);

  const selectedStyleDetails = getSelectedStyleDetails();

  // Filter models based on search query
  const getFilteredModels = useCallback(() => {
    if (!modelSearchQuery.trim()) return AI_MODELS;

    const filtered: Partial<typeof AI_MODELS> = {};
    Object.entries(AI_MODELS).forEach(([category, models]) => {
      const filteredModels = models.filter(
        (model) =>
          model.name.toLowerCase().includes(modelSearchQuery.toLowerCase()) ||
          category.toLowerCase().includes(modelSearchQuery.toLowerCase())
      );
      if (filteredModels.length > 0) {
        filtered[category as keyof typeof AI_MODELS] = filteredModels;
      }
    });
    return filtered;
  }, [modelSearchQuery]);

  const filteredModels = getFilteredModels();

  // Utility functions
  const getFileIcon = useCallback((type: string) => {
    if (type.startsWith("image/")) return <Image className={ICON_SIZE} />;
    if (type === "application/pdf" || type.includes("document"))
      return <FileText className={ICON_SIZE} />;
    return <File className={ICON_SIZE} />;
  }, []);

  // File processing helpers
  const createUploadedFile = useCallback(
    (file: File, customName?: string): UploadedFile => ({
      id: Math.random().toString(36).substring(2, 11),
      name: customName || file.name,
      size: file.size,
      type: file.type,
      isUploading: true,
      progress: 0,
    }),
    []
  );

  // Simulate file upload with progress
  const simulateUpload = useCallback(
    (file: UploadedFile, actualFile?: File) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? {
                    ...f,
                    isUploading: false,
                    progress: 100,
                    url:
                      actualFile && file.type.startsWith("image/")
                        ? URL.createObjectURL(actualFile)
                        : undefined,
                  }
                : f
            )
          );
        } else {
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === file.id ? { ...f, progress } : f))
          );
        }
      }, 200);
    },
    []
  );

  const processFileUpload = useCallback(
    (file: File, customName?: string) => {
      const uploadedFile = createUploadedFile(file, customName);
      setUploadedFiles((prev) => [...prev, uploadedFile]);
      simulateUpload(uploadedFile, file);
    },
    [createUploadedFile, simulateUpload]
  );

  // Remove uploaded file
  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove?.url && fileToRemove.url.startsWith("blob:")) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        Array.from(files).forEach((file) => processFileUpload(file));
        // Reset input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [processFileUpload]
  );

  // Handle paste
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      Array.from(items).forEach((item) => {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            processFileUpload(file, `pasted-image-${Date.now()}.png`);
          }
        }
      });
    },
    [processFileUpload]
  );

  // Drag and drop handlers
  const handleDragEvents = useCallback(
    (e: React.DragEvent, type: "enter" | "leave" | "over" | "drop") => {
      e.preventDefault();
      e.stopPropagation();

      switch (type) {
        case "enter":
          setIsDragOver(true);
          break;
        case "leave":
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragOver(false);
          }
          break;
        case "drop":
          setIsDragOver(false);
          const files = Array.from(e.dataTransfer.files);
          files.forEach((file) => processFileUpload(file));
          break;
      }
    },
    [processFileUpload]
  );

  // Handle send message
  const handleSend = useCallback(() => {
    if (message.trim()) {
      console.log("Sending message:", {
        message: message.trim(),
        model: selectedModel,
        style: selectedStyle,
        webSearch,
        redditSearch,
        createImage,
      });
      setMessage("");
    }
  }, [
    message,
    selectedModel,
    selectedStyle,
    webSearch,
    redditSearch,
    createImage,
  ]);

  // Handle Enter key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      uploadedFiles.forEach((file) => {
        if (file.url && file.url.startsWith("blob:")) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [uploadedFiles]);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Close model dropdown if clicked outside
      if (
        showModelDropdown &&
        modelDropdownRef.current &&
        !modelDropdownRef.current.contains(target)
      ) {
        setShowModelDropdown(false);
        setModelSearchQuery(""); // Clear search when closing
      }

      // Close tools dropdown if clicked outside (but not if clicking on style dropdown)
      if (
        showToolsDropdown &&
        toolsDropdownRef.current &&
        !toolsDropdownRef.current.contains(target)
      ) {
        setShowToolsDropdown(false);
        setShowStyleDropdown(false); // Also close style dropdown when tools dropdown closes
      }

      // Close style dropdown if tools dropdown is closed
      if (!showToolsDropdown && showStyleDropdown) {
        setShowStyleDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModelDropdown, showToolsDropdown, showStyleDropdown]);

  return (
    <div className="">
      {/* File Preview Section */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2"
          >
            <div className="flex flex-wrap gap-3">
              {uploadedFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  {/* File Preview Card */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-fd-border bg-fd-background/50 flex items-center justify-center">
                    {file.isUploading ? (
                      // Loading State
                      <Loader2 className="h-8 w-8 animate-spin text-fd-primary" />
                    ) : file.type.startsWith("image/") && file.url ? (
                      // Image Preview
                      <img
                        src={file.url}
                        alt={`Preview of ${file.name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      // File Icon
                      <div className="flex items-center justify-center">
                        {getFileIcon(file.type)}
                      </div>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-fd-background border border-fd-border hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-3 w-3 text-fd-accent-foreground" />
                  </button>

                  {/* File Name Tooltip */}
                  <div className="absolute bottom-0 left-0 right-0 bg-fd-background/90 backdrop-blur-sm px-2 py-1 text-xs text-fd-foreground rounded-b-xl truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {file.name}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={cn(
          "w-full max-w-4xl mx-auto rounded-3xl border-2 transition-all duration-200 outline-2 outline-fd-accent bg-fd-card/40 backdrop-blur-sm relative",
          isDragOver
            ? "border-fd-primary bg-fd-primary/5 scale-[1.02]"
            : "border-fd-border",
          className
        )}
        onDragEnter={(e) => handleDragEvents(e, "enter")}
        onDragLeave={(e) => handleDragEvents(e, "leave")}
        onDragOver={(e) => handleDragEvents(e, "over")}
        onDrop={(e) => handleDragEvents(e, "drop")}
      >
        {/* Drag Overlay */}
        {isDragOver && (
          <div className="absolute inset-0 rounded-3xl bg-fd-primary/10 border-2 border-dashed border-fd-primary flex items-center justify-center z-10">
            <div className="text-center">
              <Upload className="h-8 w-8 text-fd-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-fd-primary">
                Drop files here to upload
              </p>
            </div>
          </div>
        )}
        {/* Main Input Row */}
        <div className="flex pt-2 px-4 items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="Ask anything you want !!"
              className="w-full min-h-[48px] max-h-32 px-2 py-3 pr-12 rounded-2xl border-transparent  text-fd-foreground placeholder:text-fd-muted-foreground resize-none focus:outline-none focus:ring-none transition-all"
              rows={1}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            />
          </div>
        </div>

        <div className="h-[1px] bg-fd-border w-full"></div>

        {/* Controls Row */}
        <div className="flex items-center p-4 justify-between flex-wrap">
          <div className="flex justify-center gap-1.5 md:gap-2">
            {/* Tools Dropdown */}
            <div className="relative" ref={toolsDropdownRef}>
              <button
                type="button"
                onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                className="flex items-center gap-2 p-3 rounded-lg border border-fd-border bg-fd-background/50 hover:bg-fd-accent transition-colors"
              >
                <FaTools className={`${ICON_SIZE} text-fd-muted-foreground`} />
                {/* <span className="text-sm font-medium">Tools</span> */}
                {/* <ChevronDown className="h-4 w-4 text-fd-muted-foreground" /> */}
              </button>

              <AnimatePresence>
                {showToolsDropdown && (
                  <motion.div
                    {...DROPDOWN_ANIMATION}
                    className="absolute top-full left-0 mt-2 w-48 md:w-64 rounded-xl border border-fd-border bg-fd-card backdrop-blur-xl shadow-xl z-[100]"
                  >
                    <div className="p-4">
                      {/* Style Selector */}
                      <div className="relative mb-4">
                        <button
                          type="button"
                          onClick={() =>
                            setShowStyleDropdown(!showStyleDropdown)
                          }
                          className="w-full flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">Style:</span>
                            <span className="text-sm text-fd-muted-foreground">
                              {selectedStyleDetails.name}
                            </span>
                          </div>
                          <ChevronDown
                            className={cn(
                              `${ICON_SIZE} text-fd-muted-foreground transition-transform duration-200`,
                              showStyleDropdown && "rotate-180"
                            )}
                          />
                        </button>

                        <AnimatePresence>
                          {showStyleDropdown && (
                            <motion.div
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              className="absolute top-0 left-full ml-2 w-44 md:w-64 rounded-xl border border-fd-border bg-fd-card backdrop-blur-xl shadow-xl z-[110]"
                            >
                              <div className="py-1 px-2  overflow-y-auto">
                                {STYLE_OPTIONS.map((style) => (
                                  <button
                                    key={style.id}
                                    onClick={() => {
                                      setSelectedStyle(style.id);
                                      setShowStyleDropdown(false);
                                    }}
                                    className={cn(
                                      "w-full text-left my-2 px-3 py-1.5 rounded-lg hover:bg-fd-accent transition-colors flex items-center justify-between",
                                      selectedStyle === style.id &&
                                        "bg-fd-accent ring-1 ring-fd-primary/20"
                                    )}
                                  >
                                    <div className="flex-1">
                                      <div className="font-medium text-sm">
                                        {style.name}
                                      </div>
                                      <div className="text-xs truncate w-28 md:truncate-none md:w-auto text-fd-muted-foreground">
                                        {style.description}
                                      </div>
                                    </div>
                                    {selectedStyle === style.id && (
                                      <Check className="h-4 w-4 text-fd-primary flex-shrink-0 ml-2" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Separator */}
                      <div className="border-t border-fd-border my-4"></div>

                      {/* Toggle Options */}
                      <div className="space-y-4">
                        <label className="flex items-center justify-between py-1">
                          <span className="text-sm font-medium">
                            Web Search
                          </span>
                          <button
                            type="button"
                            onClick={() => setWebSearch(!webSearch)}
                            className={cn(
                              "relative w-11 h-6 rounded-full transition-colors",
                              webSearch ? "bg-fd-primary" : "bg-fd-muted"
                            )}
                          >
                            <div
                              className={cn(
                                "absolute top-0.5 w-5 h-5 bg-fd-muted-foreground rounded-full transition-transform shadow-sm",
                                webSearch
                                  ? "translate-x-5  "
                                  : "translate-x-0.5 "
                              )}
                            />
                          </button>
                        </label>

                        <label className="flex items-center justify-between py-1">
                          <span className="text-sm font-medium">
                            Reddit Search
                          </span>
                          <button
                            type="button"
                            onClick={() => setRedditSearch(!redditSearch)}
                            className={cn(
                              "relative w-11 h-6 rounded-full transition-colors",
                              redditSearch ? "bg-fd-primary" : "bg-fd-muted"
                            )}
                          >
                            <div
                              className={cn(
                                "absolute top-0.5 w-5 h-5 bg-fd-muted-foreground  rounded-full transition-transform shadow-sm",
                                redditSearch
                                  ? "translate-x-5"
                                  : "translate-x-0.5"
                              )}
                            />
                          </button>
                        </label>

                        <label className="flex items-center justify-between py-1">
                          <span className="text-sm font-medium">
                            Create Image
                          </span>
                          <button
                            type="button"
                            onClick={() => setCreateImage(!createImage)}
                            className={cn(
                              "relative w-11 h-6 rounded-full transition-colors",
                              createImage ? "bg-fd-primary" : "bg-fd-muted"
                            )}
                          >
                            <div
                              className={cn(
                                "absolute top-0.5 w-5 h-5 bg-fd-muted-foreground  rounded-full transition-transform shadow-sm",
                                createImage
                                  ? "translate-x-5"
                                  : "translate-x-0.5"
                              )}
                            />
                          </button>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Upload Button */}
            <button
              type="button"
              onClick={handleFileUpload}
              className="p-2 rounded-lg border border-fd-border bg-fd-background/50 hover:bg-fd-accent transition-colors"
            >
              <Paperclip className="h-5 w-5 text-fd-muted-foreground" />
            </button>

            {/* Model Selector */}
            <div className="relative" ref={modelDropdownRef}>
              <button
                type="button"
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg  border border-fd-border bg-fd-background/50 hover:bg-fd-accent transition-colors"
              >
                {selectedModelDetails.icon}
                <span className="text-sm font-medium w-24 md:w-auto truncate">
                  {selectedModelDetails.name}
                </span>
                <ChevronDown
                  className={cn(
                    `${ICON_SIZE} text-fd-muted-foreground transition-transform duration-200`,
                    showModelDropdown && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {showModelDropdown && (
                  <motion.div
                    {...DROPDOWN_ANIMATION}
                    className="absolute top-full left-0 mt-2 w-56 md:w-72 rounded-xl border border-fd-border bg-fd-card backdrop-blur-xl shadow-xl z-[100]"
                  >
                    {/* Search Input */}
                    <div className="p-2 border-b border-fd-border">
                      <div className="relative">
                        <Search
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${ICON_SIZE} text-fd-muted-foreground`}
                        />
                        <input
                          type="text"
                          placeholder="Search models..."
                          value={modelSearchQuery}
                          onChange={(e) => setModelSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 text-sm   rounded-lg focus:outline-none focus:ring-none transition-colors"
                        />
                      </div>
                    </div>

                    <div
                      className="p-2 max-h-72 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-fd-muted/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-fd-muted/70"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(156, 163, 175, 0.5) transparent",
                      }}
                    >
                      {Object.entries(filteredModels).length === 0 ? (
                        <div className="px-3 py-8 text-center text-sm text-fd-muted-foreground">
                          No models found matching &quot;{modelSearchQuery}
                          &quot;
                        </div>
                      ) : (
                        Object.entries(filteredModels).map(
                          ([category, models]) => (
                            <div key={category} className="mb-3 last:mb-0">
                              <div className="px-3 py-1 text-xs font-semibold text-fd-muted-foreground uppercase tracking-wide">
                                {category}
                              </div>
                              {models.map((model) => (
                                <button
                                  key={model.id}
                                  onClick={() => {
                                    setSelectedModel(model.id);
                                    setShowModelDropdown(false);
                                    setModelSearchQuery(""); // Clear search when selecting
                                  }}
                                  className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-fd-accent transition-colors",
                                    selectedModel === model.id && "bg-fd-accent"
                                  )}
                                >
                                  {model.icon}
                                  <span className="text-sm truncate w-40 md:truncate-none md:w-auto">
                                    {model.name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )
                        )
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            {/* Send Button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={!message.trim()}
              className="p-3  rounded-lg bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.txt,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
