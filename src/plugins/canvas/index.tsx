import { Portal } from "@/components/ui/portal";
import { useInsertCss } from "@/hooks/useInsertCss";
import { useGlobalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";
import styles from "@/plugins/canvas/canvas.css?inline";
import CanvasContent from "@/plugins/canvas/components/CanvasContent";
import CanvasFooter from "@/plugins/canvas/components/CanvasFooter";
import CanvasHeader from "@/plugins/canvas/components/CanvasHeader";
import CanvasList from "@/plugins/canvas/components/CanvasList";
import { useCanvasStore } from "@/plugins/canvas/store";
import useHandleAutonomousCanvasState from "@/plugins/canvas/useHandleAutonomousCanvasState";
import { useHandleCanvasState } from "@/plugins/canvas/useHandleCanvasState";
import {
  getMirroredCodeBlockByLocation,
  useMirroredCodeBlocksStore,
} from "@/plugins/thread-better-code-blocks/store";

export default function CanvasWrapper() {
  const threadWrapperElement = useGlobalDomObserverStore(
    (state) => state.threadComponents.wrapper,
  );

  useHandleCanvasState();
  useHandleAutonomousCanvasState();

  const selectedCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );
  const isCanvasOpen = selectedCodeBlockLocation !== null;
  const mirroredCodeBlocks = useMirroredCodeBlocksStore(
    (state) => state.blocks,
  );
  const selectedCodeBlock = getMirroredCodeBlockByLocation({
    mirroredCodeBlocks,
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });
  const isCanvasListOpen = useCanvasStore((state) => state.isCanvasListOpen);

  useInsertCss({
    id: "canvas",
    css: styles,
    inject: isCanvasOpen || isCanvasListOpen,
  });

  useEffect(() => {
    if (!isCanvasOpen && !isCanvasListOpen) {
      $(document.body).removeAttr("data-cplx-canvas-active-panel");
      return;
    }

    $(document.body).attr(
      "data-cplx-canvas-active-panel",
      isCanvasListOpen ? "list" : "canvas",
    );
  }, [isCanvasOpen, isCanvasListOpen]);

  if (!isCanvasOpen && !isCanvasListOpen) return null;

  return (
    <Portal container={threadWrapperElement}>
      <div
        className={cn(
          "tw-fixed tw-right-8 tw-my-8 tw-h-[calc(100dvh-var(--navbar-height)-11rem)] tw-overflow-hidden tw-rounded-md tw-border tw-border-border/50 tw-bg-secondary tw-text-sm tw-transition-all tw-animate-in tw-fade-in tw-slide-in-from-right xl:tw-sticky xl:tw-top-[calc(var(--navbar-height)+2rem)] xl:tw-my-0 xl:tw-h-[calc(100dvh-var(--navbar-height)-4rem)]",
          {
            "tw-w-[80vw] xl:tw-w-[200%]": isCanvasOpen,
            "tw-w-[30vw] xl:tw-w-[20%] xl:tw-min-w-[400px]": isCanvasListOpen,
          },
        )}
      >
        {isCanvasListOpen && <CanvasList />}
        {isCanvasOpen && selectedCodeBlock != null && (
          <div className="tw-flex tw-size-full tw-flex-col">
            <CanvasHeader />
            <CanvasContent />
            <CanvasFooter />
          </div>
        )}
      </div>
    </Portal>
  );
}
