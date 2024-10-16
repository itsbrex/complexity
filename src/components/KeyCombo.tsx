import { HTMLProps, useMemo } from "react";

export default function KeyCombo({
  keys,
  className,
  ...props
}: HTMLProps<HTMLSpanElement> & { keys: string[] }) {
  const isMac = useMemo(() => {
    if (typeof navigator === "undefined") return false;

    if ((navigator as any).userAgentData?.platform != null) {
      return /macOS/.test((navigator as any).userAgentData.platform);
    }

    // Fallback
    return /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
  }, []);

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
          className="tw-rounded-sm tw-border tw-px-1 tw-font-mono"
        >
          {key}
        </span>
      ))}
    </span>
  );
}
