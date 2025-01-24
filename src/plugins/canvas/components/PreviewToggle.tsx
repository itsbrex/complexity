import { CanvasLanguage } from "@/plugins/canvas/canvas.types";
import {
  CANVAS_LANGUAGE_PREVIEW_TOGGLE_TEXT,
  CANVAS_LANGUAGE_RAW_TOGGLE_TEXT,
} from "@/plugins/canvas/canvases";
import { useCanvasStore } from "@/plugins/canvas/store";

export default function PreviewToggle({
  language,
}: {
  language: CanvasLanguage;
}) {
  const { state, setState } = useCanvasStore();

  return (
    <div
      className="tw-flex tw-cursor-pointer tw-select-none tw-items-center tw-overflow-hidden tw-rounded-md tw-border tw-border-border/50 tw-bg-secondary tw-animate-in tw-fade-in"
      onClick={() => setState(state === "code" ? "preview" : "code")}
    >
      <div
        className={cn("tw-p-1 tw-px-4 tw-text-muted-foreground", {
          "tw-rounded-md tw-bg-primary tw-text-primary-foreground tw-transition-all":
            state === "preview",
        })}
      >
        {CANVAS_LANGUAGE_PREVIEW_TOGGLE_TEXT[language] ??
          t("plugin-canvas:canvas.toggle.preview")}
      </div>
      <div
        className={cn("tw-p-1 tw-px-4 tw-text-muted-foreground", {
          "tw-rounded-md tw-bg-primary tw-text-primary-foreground tw-transition-all":
            state === "code",
        })}
      >
        {CANVAS_LANGUAGE_RAW_TOGGLE_TEXT[language] ??
          t("plugin-canvas:canvas.toggle.code")}
      </div>
    </div>
  );
}
