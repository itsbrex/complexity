import type { Tooltip as ArkTooltip } from "@ark-ui/react";
import { ReactNode } from "react";

import {
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export type TooltipProps = {
  children: ReactNode;
  disabled?: boolean;
  content: ReactNode;
  className?: string;
  positioning?: ArkTooltip.RootProps["positioning"];
  defaultOpen?: boolean;
  portal?: boolean;
};

export default function Tooltip({
  children,
  disabled,
  content,
  className,
  positioning,
  defaultOpen,
  portal = true,
}: TooltipProps) {
  return (
    <TooltipRoot
      unmountOnExit
      lazyMount={true}
      openDelay={0}
      closeDelay={0}
      positioning={{
        placement: "top",
        ...positioning,
      }}
      disabled={disabled}
      defaultOpen={defaultOpen}
    >
      <TooltipTrigger asChild>
        <span className={className}>{children}</span>
      </TooltipTrigger>
      {!(typeof content === "string" && content.length === 0) && (
        <TooltipContent asChild portal={portal}>
          <div className="tw-font-medium">{content}</div>
        </TooltipContent>
      )}
    </TooltipRoot>
  );
}
