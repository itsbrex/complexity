import { LuPlay } from "react-icons/lu";

import CsUiPluginsGuard from "@/components/CsUiPluginsGuard";
import Tooltip from "@/components/Tooltip";
import { useMirroredCodeBlockContext } from "@/features/plugins/thread/better-code-blocks/MirroredCodeBlockContext";
import {
  isAutonomousCanvasLanguageString,
  isCanvasLanguageString,
} from "@/features/plugins/thread/canvas/canvas.types";
import { canvasStore } from "@/features/plugins/thread/canvas/store";

export default function CanvasSimpleModeRenderButton() {
  const { messageBlockIndex, codeBlockIndex, language } =
    useMirroredCodeBlockContext()((state) => ({
      language: state.language,
      messageBlockIndex: state.sourceMessageBlockIndex,
      codeBlockIndex: state.sourceCodeBlockIndex,
    }));

  if (
    !isCanvasLanguageString(language) &&
    !isAutonomousCanvasLanguageString(language)
  )
    return null;

  return (
    <CsUiPluginsGuard dependentPluginIds={["thread:canvas"]}>
      <Tooltip content="Render in Canvas">
        <div
          className="tw-cursor-pointer tw-text-muted-foreground tw-transition-colors hover:tw-text-foreground"
          onClick={() => {
            canvasStore.setState((draft) => {
              draft.selectedCodeBlockLocation = {
                messageBlockIndex,
                codeBlockIndex,
              };
              draft.state = "preview";
            });
          }}
        >
          <LuPlay className="tw-size-4" />
        </div>
      </Tooltip>
    </CsUiPluginsGuard>
  );
}
