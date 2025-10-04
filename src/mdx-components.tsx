import defaultMdxComponents from "fumadocs-ui/mdx";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import type { MDXComponents } from "mdx/types";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { TeamCard } from "./components/components/TeamCard";
import AIChat from "@/components/AIapplicationsComponents/ai-chat";
import PinChat from "@/components/AIapplicationsComponents/pin-chat";
import ChatInputBox from "@/components/AIapplicationsComponents/chat-input-box";
import { CalendarRange } from "@/components/components/calenderRange";
import { CalendarCurrent } from "@/components/components/calenderCurent";
import { Puzzle } from "@/components/components/puzzle";
import { ImagePuzzle } from "@/components/components/image-puzzle";
import { MultiFactor } from "@/components/components/MultiFactor";
import { CopyPromptButton } from "@/components/ui/copy-prompt-button";
import { SourceCodeBlock } from "@/components/ui/source-code-block";

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    Step,
    Steps,
    AIChat,
    PinChat,
    ChatInputBox,
    CalendarRange,
    CalendarCurrent,
    TeamCard,
    Puzzle,
    ImagePuzzle,
    MultiFactor,
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
