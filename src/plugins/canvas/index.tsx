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
          "x-fixed x-right-8 x-my-8 x-h-[calc(100dvh-var(--navbar-height)-11rem)] x-overflow-hidden x-rounded-md x-border x-border-border/50 x-bg-secondary x-text-sm x-transition-all x-animate-in x-fade-in x-slide-in-from-right",
          "xl:x-sticky xl:x-top-6 xl:x-my-0 xl:x-h-[calc(100dvh-var(--navbar-height)-4rem)]",
          {
            "x-w-[80vw] xl:x-w-[200%]": isCanvasOpen,
            "x-w-[30vw] xl:x-w-[20%] xl:x-min-w-[400px]": isCanvasListOpen,
          },
        )}
      >
        {isCanvasListOpen && <CanvasList />}
        {isCanvasOpen && selectedCodeBlock != null && (
          <div className="x-flex x-size-full x-flex-col">
            <CanvasHeader />
            <CanvasContent />
            <CanvasFooter />
          </div>
        )}
      </div>
    </Portal>
  );
}
