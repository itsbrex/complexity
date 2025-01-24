import { LuPlay } from "react-icons/lu";

import CsUiPluginsGuard from "@/components/plugins-guard/CsUiPluginsGuard";
import Tooltip from "@/components/Tooltip";
import {
  isAutonomousCanvasLanguageString,
  isCanvasLanguageString,
} from "@/plugins/canvas/canvas.types";
import { canvasStore } from "@/plugins/canvas/store";
import { useMirroredCodeBlockContext } from "@/plugins/thread-better-code-blocks/MirroredCodeBlockContext";

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
    <CsUiPluginsGuard desktopOnly dependentPluginIds={["thread:canvas"]}>
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
