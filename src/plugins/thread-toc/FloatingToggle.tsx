import { LuList } from "react-icons/lu";

import { usePanelPosition } from "@/plugins/thread-toc/usePanelPosition";

type FloatingToggleProps = {
  isOpen: boolean;
  onClick: () => void;
};

export default function FloatingToggle({
  isOpen,
  onClick,
}: FloatingToggleProps) {
  const { position } = usePanelPosition() ?? {};

  if (position == null) return null;

  const { top } = position;

  return (
    <div
      role="button"
      className={cn(
        "x-fixed -x-right-3 x-top-[--panel-top] x-flex x-h-16 x-w-8 x-items-center x-justify-center x-rounded-md x-border x-border-border/50 x-bg-secondary x-text-muted-foreground x-shadow-lg x-transition-colors x-animate-in x-fade-in hover:x-text-foreground",
        {
          "x-hidden": isOpen,
        },
      )}
      style={
        {
          ["--panel-top"]: `${top}px`,
        } as React.CSSProperties
      }
      onClick={onClick}
    >
      <LuList className="x-size-4" />
    </div>
  );
}
