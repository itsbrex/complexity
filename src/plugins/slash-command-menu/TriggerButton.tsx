import { LuSquareSlash } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { UiUtils } from "@/utils/ui-utils";

export default function SlashCommandMenuTriggerButton() {
  const handleTrigger = async () => {
    const $activeQueryBoxTextarea = UiUtils.getActiveQueryBoxTextarea();

    if (!$activeQueryBoxTextarea.length) return;

    $activeQueryBoxTextarea.trigger("focus");

    const textarea = $activeQueryBoxTextarea[0] as HTMLTextAreaElement;
    const { selectionStart, value } = textarea;

    // Check characters before and after cursor
    const needsSpaceBefore =
      selectionStart > 0 && value[selectionStart - 1] !== " ";
    const needsSpaceAfter =
      selectionStart < value.length && value[selectionStart] !== " ";

    let textToInsert = "";
    if (needsSpaceBefore) textToInsert += " ";
    textToInsert += "/";
    if (needsSpaceAfter) textToInsert += " ";

    const event = new KeyboardEvent("keydown", {
      key: "/",
      bubbles: true,
      cancelable: true,
    });
    textarea.dispatchEvent(event);

    document.execCommand("insertText", false, textToInsert);

    // Calculate new caret position (right after the slash)
    const newPosition = selectionStart + (needsSpaceBefore ? 2 : 1);
    textarea.setSelectionRange(newPosition, newPosition);
  };

  return (
    <Tooltip
      content={t(
        "plugin-slash-command-menu:slashCommandMenu.triggerButton.label",
      )}
    >
      <button
        className="x-flex x-min-h-8 x-w-max x-cursor-pointer x-items-center x-justify-between x-gap-1 x-rounded-md x-px-2 x-text-center x-text-sm x-font-medium x-text-muted-foreground x-outline-none x-transition-all x-duration-150 placeholder:x-text-muted-foreground hover:x-bg-primary-foreground hover:x-text-foreground focus-visible:x-bg-primary-foreground focus-visible:x-outline-none active:x-scale-95 disabled:x-cursor-not-allowed disabled:x-opacity-50 [&>span]:!x-truncate"
        onClick={handleTrigger}
      >
        <LuSquareSlash className="x-size-4" />
      </button>
    </Tooltip>
  );
}
