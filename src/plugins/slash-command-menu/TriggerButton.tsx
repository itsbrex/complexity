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
        className="tw-flex tw-min-h-8 tw-w-max tw-cursor-pointer tw-items-center tw-justify-between tw-gap-1 tw-rounded-md tw-px-2 tw-text-center tw-text-sm tw-font-medium tw-text-muted-foreground tw-outline-none tw-transition-all tw-duration-150 placeholder:tw-text-muted-foreground hover:tw-bg-primary-foreground hover:tw-text-foreground focus-visible:tw-bg-primary-foreground focus-visible:tw-outline-none active:tw-scale-95 disabled:tw-cursor-not-allowed disabled:tw-opacity-50 [&>span]:!tw-truncate"
        onClick={handleTrigger}
      >
        <LuSquareSlash className="tw-size-4" />
      </button>
    </Tooltip>
  );
}
