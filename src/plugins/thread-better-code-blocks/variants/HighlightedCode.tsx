import { useWindowSize } from "@uidotdev/usehooks";
import { ReactNode, RefObject } from "react";

import CodeHighlighter from "@/components/CodeHighlighter";
import { BetterCodeBlockFineGrainedOptions } from "@/data/dashboard/better-code-blocks/better-code-blocks-options.types";
import { getInterpretedCanvasLanguage } from "@/plugins/canvas/canvas.types";
import { useMirroredCodeBlockContext } from "@/plugins/thread-better-code-blocks/MirroredCodeBlockContext";
import { getBetterCodeBlockOptions } from "@/plugins/thread-better-code-blocks/utils";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { ExtensionLocalStorage } from "@/services/extension-local-storage/extension-local-storage.types";

const HighlightedCodeWrapper = memo(() => {
  const { codeBlock, maxHeight, isWrapped } = useMirroredCodeBlockContext();

  const isInFlight = codeBlock?.states.isInFlight;
  const code = codeBlock?.content.code ?? "";
  const language = codeBlock?.content.language;

  const interpretedLanguage = getInterpretedCanvasLanguage(language ?? "text");

  const wrapperRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  const fineGrainedSettings = getBetterCodeBlockOptions(language ?? "text");
  const globalSettings =
    ExtensionLocalStorageService.getCachedSync().plugins[
      "thread:betterCodeBlocks"
    ];

  useOverflowing({
    wrapperRef,
    codeRef,
    fineGrainedSettings: fineGrainedSettings ?? globalSettings,
  });

  if (!codeBlock) return null;

  return (
    <div
      ref={wrapperRef}
      style={{
        maxHeight,
      }}
      className="x-overflow-auto x-rounded-b-md"
    >
      <div
        className={cn(
          "[&>pre]:x-m-0 [&>pre]:x-rounded-t-none [&>pre]:!x-p-2 [&>pre]:!x-px-4",
          {
            "x-text-pretty [&_code]:!x-whitespace-pre-wrap": isWrapped,
            "[&_span]:x-duration-300 [&_span]:x-animate-in [&_span]:x-fade-in":
              isInFlight,
          },
        )}
      >
        <CodeHighlighter
          language={interpretedLanguage}
          codeRef={codeRef}
          PreTag={PreTag}
        >
          {code}
        </CodeHighlighter>
      </div>
    </div>
  );
});

function PreTag({ children }: { children: ReactNode }) {
  return <pre className="x-px-4 x-py-2">{children}</pre>;
}

export default HighlightedCodeWrapper;

function useOverflowing({
  wrapperRef,
  codeRef,
  fineGrainedSettings,
}: {
  wrapperRef: RefObject<HTMLDivElement | null>;
  codeRef: RefObject<HTMLDivElement | null>;
  fineGrainedSettings:
    | BetterCodeBlockFineGrainedOptions
    | ExtensionLocalStorage["plugins"]["thread:betterCodeBlocks"];
}) {
  const windowSize = useWindowSize();

  const [initialWidth, setInitialWidth] = useState(0);

  const { setIsHorizontalOverflowing, setIsVerticalOverflowing } =
    useMirroredCodeBlockContext();

  useEffect(() => {
    if (!wrapperRef.current) {
      return;
    }

    if (initialWidth === 0) {
      setInitialWidth(wrapperRef.current.scrollWidth);
    }
  }, [initialWidth, wrapperRef]);

  useEffect(() => {
    if (!wrapperRef.current || !codeRef.current) {
      return;
    }

    setIsHorizontalOverflowing(
      codeRef.current.getBoundingClientRect().width >
        wrapperRef.current.getBoundingClientRect().width,
    );
    setIsVerticalOverflowing(
      codeRef.current.getBoundingClientRect().height >
        fineGrainedSettings.maxHeight.value,
    );
  }, [
    codeRef,
    fineGrainedSettings.maxHeight.value,
    setIsHorizontalOverflowing,
    setIsVerticalOverflowing,
    wrapperRef,
    windowSize,
  ]);
}
