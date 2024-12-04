import { HTMLProps, useMemo } from "react";

import usePlatformDetection from "@/hooks/usePlatformDetection";

export default function KeyCombo({
  keys,
  className,
  ...props
}: HTMLProps<HTMLSpanElement> & { keys: string[] }) {
  const isMac = usePlatformDetection() === "mac";

  const processedKeys = useMemo(() => {
    return keys.map((key) => {
      if (key.toLowerCase() === "ctrl" || key.toLowerCase() === "control") {
        return isMac ? "⌘" : "Ctrl";
      }
      if (key.toLowerCase() === "alt") {
        return isMac ? "⌥" : "Alt";
      }
      return key;
    });
  }, [keys, isMac]);

  return (
    <span className={cn("tw-inline-flex tw-gap-1", className)} {...props}>
      {processedKeys.map((key, idx) => (
        <span
          key={idx}
          className="tw-rounded-sm tw-border tw-border-border/50 tw-px-1 tw-font-mono"
        >
          {key}
        </span>
      ))}
    </span>
  );
}
