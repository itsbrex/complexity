import { useHotkeys, useRecordHotkeys } from "react-hotkeys-hook";

import KeyCombo from "@/components/KeyCombo";
import { Button } from "@/components/ui/button";
import usePlatformDetection from "@/hooks/usePlatformDetection";

const MODIFIER_KEYS = new Set(
  [Key.Meta, Key.Control, Key.Alt, Key.Shift, "ctrl"].map((k) =>
    k.toLowerCase(),
  ),
);

function orderKeys(keys: string[]): string[] {
  const modifierOrder: Record<string, number> = {
    control: 1,
    ctrl: 1,
    meta: 1,
    shift: 2,
    alt: 3,
  };

  return [...keys].sort((a, b) => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    const aIsModifier = MODIFIER_KEYS.has(aLower);
    const bIsModifier = MODIFIER_KEYS.has(bLower);

    if (aIsModifier && bIsModifier) {
      const aOrder = modifierOrder[aLower] ?? 0;
      const bOrder = modifierOrder[bLower] ?? 0;
      return aOrder - bOrder;
    }
    if (aIsModifier) return -1;
    if (bIsModifier) return 1;
    return 0;
  });
}

function isValidKeyCombination(keys: Set<string>): boolean {
  if (!keys?.size) return false;

  const keyArray = Array.from(keys).map((k) => k.toLowerCase());
  const hasModifier = keyArray.some((k) => MODIFIER_KEYS.has(k));
  const nonModifierKeys = keyArray.filter((k) => !MODIFIER_KEYS.has(k));

  return hasModifier && nonModifierKeys.length === 1;
}

type UseHotkeyRecorderProps = {
  defaultKeys: string[];
  onSave?: (keys: string[]) => void;
};

export function useHotkeyRecorder({
  defaultKeys,
  onSave,
}: UseHotkeyRecorderProps) {
  const isMac = usePlatformDetection() === "mac";
  const [recordedKeys, { isRecording, resetKeys, start, stop }] =
    useRecordHotkeys();

  useHotkeys(Key.Escape, () => stop(), { preventDefault: true });

  const displayKeys = isRecording
    ? recordedKeys?.size
      ? orderKeys(Array.from(recordedKeys))
      : []
    : orderKeys(defaultKeys);

  useEffect(() => {
    if (!recordedKeys?.size) return;

    const nonModifierKeys = Array.from(recordedKeys)
      .map((k) => k.toLowerCase())
      .filter((k) => !MODIFIER_KEYS.has(k));

    if (nonModifierKeys.length > 1) {
      resetKeys();
      stop();
    }
  }, [recordedKeys, resetKeys, stop]);

  const handleStartRecording = () => {
    resetKeys();
    start();
  };

  const handleStopRecording = () => {
    if (!isValidKeyCombination(recordedKeys)) {
      resetKeys();
    } else if (onSave && recordedKeys != null) {
      onSave(orderKeys(Array.from(recordedKeys)));
    }
    stop();
  };

  const isValidCombination =
    recordedKeys != null ? isValidKeyCombination(recordedKeys) : true;

  const HotkeyRecorderUI = () => (
    <div className="tw-flex tw-flex-col tw-gap-3">
      <div className="tw-flex tw-items-center tw-gap-3">
        <div
          className={cn(
            "tw-flex tw-items-center tw-rounded-md",
            isRecording &&
              "tw-border tw-border-border/50 tw-bg-secondary tw-px-3 tw-py-1.5",
          )}
        >
          {isRecording && !recordedKeys?.size ? (
            <div className="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-text-muted-foreground">
              <div className="tw-h-1.5 tw-w-1.5 tw-animate-pulse tw-rounded-full tw-bg-primary" />
              Recording...
            </div>
          ) : (
            <KeyCombo keys={displayKeys} />
          )}
        </div>
        {isRecording ? (
          !isValidCombination ? null : (
            <Button
              variant="outline"
              size="sm"
              className="tw-min-w-[80px]"
              onClick={handleStopRecording}
            >
              Save
            </Button>
          )
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="tw-min-w-[80px]"
            onClick={handleStartRecording}
          >
            Record
          </Button>
        )}
      </div>
      {isRecording && !isValidCombination && recordedKeys?.size > 0 && (
        <div className="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-text-destructive">
          <div className="tw-i-lucide-alert-circle tw-h-4 tw-w-4" />
          Invalid combination. Use one modifier key ({isMac
            ? "⌘"
            : "Ctrl"}, {isMac ? "Option" : "Alt"}, {isMac ? "Shift" : "Shift"})
          + one regular key
        </div>
      )}
    </div>
  );

  return {
    HotkeyRecorderUI,
    isRecording,
    keys: recordedKeys != null ? orderKeys(Array.from(recordedKeys)) : [],
    startRecording: handleStartRecording,
    stopRecording: handleStopRecording,
    isValidCombination,
  };
}
