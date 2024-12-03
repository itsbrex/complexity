import { LuList } from "react-icons/lu";

import { usePanelPosition } from "@/features/plugins/thread/toc/usePanelPosition";

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
        "tw-fixed -tw-right-3 tw-top-[--panel-top] tw-flex tw-h-16 tw-w-8 tw-items-center tw-justify-center tw-rounded-md tw-border tw-border-border/50 tw-bg-secondary tw-text-muted-foreground tw-shadow-lg tw-transition-colors tw-animate-in tw-fade-in hover:tw-text-foreground",
        {
          "tw-hidden": isOpen,
        },
      )}
      style={
        {
          ["--panel-top"]: `${top}px`,
        } as React.CSSProperties
      }
      onClick={onClick}
    >
      <LuList className="tw-size-4" />
    </div>
  );
}
