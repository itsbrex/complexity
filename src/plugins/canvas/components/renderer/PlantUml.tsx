import { useMutation } from "@tanstack/react-query";
import { LuLoaderCircle } from "react-icons/lu";
import svgPanZoom from "svg-pan-zoom";

import { Button } from "@/components/ui/button";
import { useColorSchemeStore } from "@/data/color-scheme-store";
import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import {
  formatCanvasTitle,
  getCanvasTitle,
  isAutonomousCanvasLanguageString,
} from "@/plugins/canvas/canvas.types";
import { useCanvasStore } from "@/plugins/canvas/store";
import {
  generatePlantUMLUrl,
  generateTextPlantUMLUrl,
} from "@/utils/plant-uml";
import { UiUtils } from "@/utils/ui-utils";

const SVGContent = memo(function SVGContent({ svg }: { svg: string }) {
  useEffect(() => {
    const $svg = $("#canvas-plantuml-container").find("svg");
    svgPanZoom($svg[0], {
      center: true,
      fit: true,
      contain: true,
      dblClickZoomEnabled: true,
    });
  }, []);

  return (
    <div
      id="canvas-plantuml-container"
      className="x-flex x-size-full x-items-center x-justify-center x-animate-in x-fade-in [&>svg]:!x-size-full"
      dangerouslySetInnerHTML={{
        __html: svg,
      }}
    />
  );
});

export default function PlantUmlRenderer() {
  const { colorScheme } = useColorSchemeStore();

  const selectedCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  const code = selectedCodeBlock?.content.code;
  const isInFlight = selectedCodeBlock?.states.isInFlight;

  const isAutonomousCanvas = isAutonomousCanvasLanguageString(
    selectedCodeBlock?.content.language,
  );
  const title = formatCanvasTitle(
    getCanvasTitle(selectedCodeBlock?.content.language),
  );

  const {
    mutate,
    isPending,
    isError,
    error,
    data: svg,
  } = useMutation({
    mutationFn: async () => {
      if (!code) {
        return null;
      }

      const resp = await fetch(
        generatePlantUMLUrl(code, colorScheme === "dark"),
      );

      const svg = await resp.text();

      if (!resp.ok) {
        const errorMessageFallback = $(svg)
          .find("text")
          .map((_, el) => $(el).text())
          .get()
          .join("\n");

        const errorMessageResp = await fetch(generateTextPlantUMLUrl(code));
        const errorMessage = await errorMessageResp.text();

        throw new Error(
          errorMessage.length > 0 ? errorMessage : errorMessageFallback,
        );
      }

      return svg;
    },
  });

  useEffect(() => {
    if (isInFlight) return;
    mutate();
  }, [code, mutate, isInFlight, colorScheme]);

  return (
    <div className="x-relative x-size-full">
      {isPending && (
        <div className="x-absolute x-inset-1/2 -x-translate-x-1/2 -x-translate-y-1/2 x-animate-in x-fade-in">
          <LuLoaderCircle className="x-size-10 x-animate-spin x-text-muted-foreground" />
        </div>
      )}
      {!isPending && error && (
        <div className="x-flex x-flex-col x-gap-4 x-p-4">
          <div className="x-whitespace-pre x-font-mono x-text-red-500 x-animate-in x-fade-in">
            <div className="x-text-lg x-font-bold">
              An error occurred while rendering the PlantUML code:
            </div>
            <div>{error.message}</div>
          </div>
          <Button
            className="x-w-max"
            variant="destructive"
            onClick={() => {
              if (!error.message) return;

              const $textarea = UiUtils.getActiveQueryBoxTextarea();

              if (!$textarea.length) return;

              const errorText = `${isAutonomousCanvas && title ? `An error occurred while rendering "${title}": ` : ""}\n\n${error.message}`;

              $textarea.trigger("focus");

              document.execCommand("insertText", false, errorText);
            }}
          >
            Fix Error
          </Button>
        </div>
      )}
      {!isPending && !isError && svg && <SVGContent svg={svg} />}
    </div>
  );
}
