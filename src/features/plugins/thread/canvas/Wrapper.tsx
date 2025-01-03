import { Portal } from "@/components/ui/portal";
import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import {
  getMirroredCodeBlockByLocation,
  useMirroredCodeBlocksStore,
} from "@/features/plugins/thread/better-code-blocks/store";
import styles from "@/features/plugins/thread/canvas/canvas.css?inline";
import CanvasContent from "@/features/plugins/thread/canvas/components/CanvasContent";
import CanvasFooter from "@/features/plugins/thread/canvas/components/CanvasFooter";
import CanvasHeader from "@/features/plugins/thread/canvas/components/CanvasHeader";
import CanvasList from "@/features/plugins/thread/canvas/components/CanvasList";
import { useCanvasStore } from "@/features/plugins/thread/canvas/store";
import useHandleAutonomousCanvasState from "@/features/plugins/thread/canvas/useHandleAutonomousCanvasState";
import { useHandleCanvasState } from "@/features/plugins/thread/canvas/useHandleCanvasState";
import { useInsertCss } from "@/hooks/useInsertCss";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";

export default function CanvasWrapper() {
  const threadWrapperElement = useGlobalDomObserverStore(
    (state) => state.threadComponents.wrapper,
  );

  useHandleCanvasState();
  useHandleAutonomousCanvasState();

  const isAutonomousMode =
    ExtensionLocalStorageService.getCachedSync().plugins["thread:canvas"]
      .mode === "auto";
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
        {isAutonomousMode && isCanvasListOpen && <CanvasList />}
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
