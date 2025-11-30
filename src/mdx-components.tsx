import defaultMdxComponents from "fumadocs-ui/mdx";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import type { MDXComponents } from "mdx/types";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { Step, Steps } from "fumadocs-ui/components/steps";
import dynamic from "next/dynamic";
import { CopyPromptButton } from "@/components/ui/copy-prompt-button";
import { SourceCodeBlock } from "@/components/ui/source-code-block";

// Lazy load heavy components to improve initial page load
const TeamCard = dynamic(() => import("./components/components/TeamCard").then(mod => mod.TeamCard), {
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-xl h-64 w-full" />,
});

const AIChat = dynamic(() => import("@/components/AIapplicationsComponents/ai-chat"), {
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-xl h-96 w-full" />,
});

const PinChat = dynamic(() => import("@/components/AIapplicationsComponents/pin-chat"), {
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-xl h-64 w-full" />,
});

const ChatInputBox = dynamic(() => import("@/components/AIapplicationsComponents/chat-input-box"), {
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-xl h-32 w-full" />,
});

const CalendarRange = dynamic(() => import("@/components/components/calenderRange").then(mod => mod.CalendarRange), {
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-xl h-80 w-full" />,
});

const CalendarCurrent = dynamic(() => import("@/components/components/calenderCurent").then(mod => mod.CalendarCurrent), {
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-xl h-80 w-full" />,
});

const SpamNotifications = dynamic(() => import("@/components/components/spam-notifications"), {
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-xl h-64 w-full" />,
});

const Puzzle = dynamic(() => import("@/components/components/puzzle").then(mod => mod.Puzzle), {
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-xl h-64 w-full" />,
});

const ImagePuzzle = dynamic(() => import("@/components/components/image-puzzle").then(mod => mod.ImagePuzzle), {
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-xl h-64 w-full" />,
});

const MultiFactor = dynamic(() => import("@/components/components/MultiFactor").then(mod => mod.MultiFactor), {
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-xl h-64 w-full" />,
});

const ResumeBuilder = dynamic(() => import("./components/AIapplicationsComponents/resume-builder"), {
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-xl h-96 w-full" />,
});

const ToolGrid = dynamic(() => import("./components/AIapplicationsComponents/tool-grid"), {
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-xl h-64 w-full" />,
});

const BiometricSecurity = dynamic(() => import("./components/components/BiometricSecurity").then(mod => mod.BiometricSecurity), {
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-xl h-64 w-full" />,
});

const SecureApp = dynamic(() => import("./components/components/secure-app").then(mod => mod.SecureApp), {
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-xl h-64 w-full" />,
});

const SecureVault = dynamic(() => import("./components/components/secure-vault").then(mod => mod.SecureVault), {
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-xl h-64 w-full" />,
});

const BookAppointment = dynamic(() => import("./components/components/book-appointment").then(mod => mod.BookAppointment), {
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-xl h-80 w-full" />,
});

const WaveEffectCard = dynamic(() => import("./components/components/wave-effect-card").then(mod => mod.WaveEffectCard), {
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-xl h-64 w-full" />,
});

const RealTimeEditor = dynamic(() => import("./components/components/real-time-editor").then(mod => mod.RealTimeEditor), {
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-xl h-80 w-full" />,
});

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    Step,
    Steps,
    AIChat,
    PinChat,
    BiometricSecurity,
    ChatInputBox,
    CalendarRange,
    ResumeBuilder,
    ToolGrid,
    CalendarCurrent,
    SecureApp,
    SecureVault,
    BookAppointment,
    TeamCard,
    WaveEffectCard,
    RealTimeEditor,
    Puzzle,
    ImagePuzzle,
    MultiFactor,
    SpamNotifications,
    CopyPromptButton,
    SourceCodeBlock,
    pre: ({ ...props }) => (
      <CodeBlock {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
    ...components,
  };
}
