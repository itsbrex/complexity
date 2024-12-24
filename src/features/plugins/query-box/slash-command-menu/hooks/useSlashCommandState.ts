import UiUtils from "@/utils/UiUtils";

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
  const ignoreLeftCount = useRef<number | null>(null);
  const ignoreRightCount = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      ignoreLeftCount.current = null;
      ignoreRightCount.current = null;
    }
  }, [isOpen]);

  const handleOpenState = useCallback(
    (e: JQuery.KeyDownEvent) => {
      setTimeout(() => {
        if (!isOpen) {
          const { word } = UiUtils.getWordOnCaret($textarea[0]);
          const isSlashCommand = (() => {
            return e.key === "/" && word === "/";
          })();
          const isBackSpaceOnSlash = (() => {
            return e.key === Key.Backspace && word === "/";
          })();

          if (isSlashCommand || isBackSpaceOnSlash) {
            ignoreLeftCount.current = $textarea[0].selectionStart;
            setIsOpen(true);
          }
        } else {
          if (e.key === Key.Escape) {
            setIsOpen(false);
            return;
          }

          if (
            ignoreLeftCount.current != null &&
            ignoreRightCount.current == null
          ) {
            const relativeSpacePos = $textarea[0].value
              .slice(ignoreLeftCount.current - 1)
              .search(/\s/);

            if (relativeSpacePos === -1) {
              ignoreRightCount.current = 0;
            } else {
              const absoluteSpacePos =
                relativeSpacePos + ignoreLeftCount.current;

              const isLastCharSpace =
                absoluteSpacePos === $textarea[0].value.length - 1;

              if (isLastCharSpace) {
                ignoreRightCount.current = 0;
              } else {
                const totalCharsFromSpacePosToEnd =
                  $textarea[0].value.length - absoluteSpacePos;

                ignoreRightCount.current = totalCharsFromSpacePosToEnd + 1;
              }
            }
          }

          const isCaretOutsideBoundary =
            !(
              ignoreLeftCount.current == null ||
              ignoreRightCount.current == null
            ) &&
            ($textarea[0].selectionStart < ignoreLeftCount.current! ||
              $textarea[0].selectionStart >
                $textarea[0].value.length - ignoreRightCount.current!);

          if (
            ignoreLeftCount.current == null ||
            ignoreRightCount.current == null ||
            isCaretOutsideBoundary
          )
            return setIsOpen(false);

          const text = $textarea[0].value;

          const recordedText = text.slice(
            ignoreLeftCount.current - 1,
            text.length - ignoreRightCount.current,
          );

          if (!recordedText.startsWith("/")) return setIsOpen(false);

          setSearchValue(recordedText.slice(1));
        }
      }, 0);
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
