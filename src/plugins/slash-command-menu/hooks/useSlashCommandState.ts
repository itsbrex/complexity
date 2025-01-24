import {
  slashCommandMenuStore,
  useSlashCommandMenuStore,
} from "@/plugins/slash-command-menu/store";
import { UiUtils } from "@/utils/ui-utils";

export function useSlashCommandState({
  queryBoxAnchor,
  isOpen,
  setIsOpen,
  setSearchValue,
}: {
  queryBoxAnchor: HTMLElement | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setSearchValue: (value: string) => void;
}) {
  const $textarea = $(queryBoxAnchor ?? {}).find("textarea");
  const setSearchValueBoundary = useSlashCommandMenuStore(
    (state) => state.actions.setSearchValueBoundary,
  );

  useEffect(() => {
    if (!isOpen) {
      setSearchValueBoundary({ ignoreLeftCount: null, ignoreRightCount: null });
    }
  }, [isOpen, setSearchValueBoundary]);

  const handleOpenState = useCallback(
    (e: JQuery.KeyDownEvent) => {
      setTimeout(() => {
        if (!isOpen) {
          const { word } = UiUtils.getWordOnCaret($textarea[0]);
          const isSlashCommand = e.key === "/" && word === "/";
          const isBackSpaceOnSlash = e.key === Key.Backspace && word === "/";

          if (!isSlashCommand && !isBackSpaceOnSlash) return;

          setIsOpen(true);
          slashCommandMenuStore.setState((draft) => {
            draft.searchValueBoundary.ignoreLeftCount =
              $textarea[0].selectionStart;

            const relativeSpacePos = $textarea[0].value
              .slice(draft.searchValueBoundary.ignoreLeftCount - 1)
              .search(/\s/);

            let newIgnoreRightCount: number;
            if (relativeSpacePos === -1) {
              newIgnoreRightCount = 0;
            } else {
              const absoluteSpacePos =
                relativeSpacePos + draft.searchValueBoundary.ignoreLeftCount;
              const isLastCharSpace =
                absoluteSpacePos === $textarea[0].value.length - 1;

              if (isLastCharSpace) {
                newIgnoreRightCount = 0;
              } else {
                const totalCharsFromSpacePosToEnd =
                  $textarea[0].value.length - absoluteSpacePos;
                newIgnoreRightCount = totalCharsFromSpacePosToEnd + 1;
              }
            }

            draft.searchValueBoundary.ignoreRightCount = newIgnoreRightCount;
          });
        } else {
          if (e.key === Key.Escape) {
            setIsOpen(false);
            return;
          }

          const currentBoundary =
            useSlashCommandMenuStore.getState().searchValueBoundary;
          const isCaretOutsideBoundary =
            !(
              currentBoundary.ignoreLeftCount == null ||
              currentBoundary.ignoreRightCount == null
            ) &&
            ($textarea[0].selectionStart < currentBoundary.ignoreLeftCount! ||
              $textarea[0].selectionStart >
                $textarea[0].value.length - currentBoundary.ignoreRightCount!);

          if (
            currentBoundary.ignoreLeftCount == null ||
            currentBoundary.ignoreRightCount == null ||
            isCaretOutsideBoundary
          )
            return setIsOpen(false);

          const recordedText = $textarea[0].value.slice(
            currentBoundary.ignoreLeftCount - 1,
            $textarea[0].value.length - currentBoundary.ignoreRightCount,
          );

          if (!recordedText.startsWith("/")) return setIsOpen(false);

          setSearchValue(recordedText.slice(1));
        }
      }, 10);
    },
    [$textarea, isOpen, setIsOpen, setSearchValue],
  );

  useEffect(() => {
    if (!$textarea.length) return;
    $textarea.on("keydown", handleOpenState);
    return () => {
      $textarea.off("keydown", handleOpenState);
    };
  }, [$textarea, handleOpenState]);
}
