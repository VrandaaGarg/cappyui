import defaultMdxComponents from "fumadocs-ui/mdx";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import type { MDXComponents } from "mdx/types";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { Step, Steps } from "fumadocs-ui/components/steps";

import AIChat from "@/components/AIapplicationsComponents/ai-chat";
import { CalendarRange } from "@/components/components/calenderRange";
import { CalendarCurrent } from "@/components/components/calenderCurent";
import { CopyPromptButton } from "@/components/ui/copy-prompt-button";

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    Step,
    Steps,
    AIChat,
    CalendarRange,
    CalendarCurrent,
    CopyPromptButton,
    pre: ({ ...props }) => (
      <CodeBlock {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
    ...components,
  };
}
