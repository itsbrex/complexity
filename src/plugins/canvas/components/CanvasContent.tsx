import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  CanvasLanguage,
  getInterpretedCanvasLanguage,
} from "@/plugins/canvas/canvas.types";
import { CANVAS_INITIAL_STATE } from "@/plugins/canvas/canvases";
import CanvasCodeView from "@/plugins/canvas/components/CodeView";
import CanvasPreview from "@/plugins/canvas/components/Preview";
import { useCanvasStore } from "@/plugins/canvas/store";
import {
  getMirroredCodeBlockByLocation,
  useMirroredCodeBlocksStore,
} from "@/plugins/thread-better-code-blocks/store";

export default function CanvasContent() {
  const selectedCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );
  const mirroredCodeBlocks = useMirroredCodeBlocksStore(
    (state) => state.blocks,
  );
  const selectedCodeBlock = getMirroredCodeBlockByLocation({
    mirroredCodeBlocks,
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });
  const isInFlight = selectedCodeBlock?.isInFlight;
  const canvasViewMode = useCanvasStore((state) => state.state);
  const language = getInterpretedCanvasLanguage(
    selectedCodeBlock?.language ?? "text",
  ) as CanvasLanguage;
  const previewKey = useCanvasStore((state) => state.refreshPreviewKey);
  const isValidCanvasCode = useCanvasStore((state) => state.isValidCanvasCode);

  if (!isValidCanvasCode) return null;

  return (
    <Tabs
      lazyMount
      value={
        isInFlight && CANVAS_INITIAL_STATE[language] === "code"
          ? "code"
          : canvasViewMode
      }
      className="custom-scrollbar tw-size-full tw-overflow-auto"
    >
      <TabsContent value="code" className="tw-size-full">
        <CanvasCodeView />
      </TabsContent>
      <TabsContent
        value="preview"
        className={cn("tw-size-full", {
          "tw-hidden":
            isInFlight && CANVAS_INITIAL_STATE[language] !== "preview",
        })}
      >
        <CanvasPreview key={`${previewKey}`} language={language} />
      </TabsContent>
    </Tabs>
  );
}
