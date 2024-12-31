import { CanvasLanguage } from "@/features/plugins/thread/canvas/canvas.types";
import { CANVAS_RENDERER } from "@/features/plugins/thread/canvas/canvases";

export default function CanvasPreview({
  language,
}: {
  language: CanvasLanguage;
}) {
  const Component = CANVAS_RENDERER[language];

  if (Component == null) return null;

  return (
    <div className="tw-size-full">
      <Component />
    </div>
  );
}
