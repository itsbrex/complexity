import { useMutation } from "@tanstack/react-query";
import { LuLoaderCircle } from "react-icons/lu";
import svgPanZoom from "svg-pan-zoom";

import { Button } from "@/components/ui/button";
import { useColorSchemeStore } from "@/data/color-scheme-store";
import {
  getMirroredCodeBlockByLocation,
  useMirroredCodeBlocksStore,
} from "@/features/plugins/thread/better-code-blocks/store";
import {
  formatCanvasTitle,
  getCanvasTitle,
  isAutonomousCanvasLanguageString,
} from "@/features/plugins/thread/canvas/canvas.types";
import { useCanvasStore } from "@/features/plugins/thread/canvas/store";
import { generatePlantUMLUrl, generateTextPlantUMLUrl } from "@/utils/plantUml";
import UiUtils from "@/utils/UiUtils";

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
      className="tw-flex tw-size-full tw-items-center tw-justify-center tw-animate-in tw-fade-in [&>svg]:!tw-size-full"
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
  const mirroredCodeBlocks = useMirroredCodeBlocksStore(
    (state) => state.blocks,
  );
  const selectedCodeBlock = getMirroredCodeBlockByLocation({
    mirroredCodeBlocks,
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  const code = selectedCodeBlock?.codeString;
  const isInFlight = selectedCodeBlock?.isInFlight;

  const isAutonomousCanvas = isAutonomousCanvasLanguageString(
    selectedCodeBlock?.language,
  );
  const title = formatCanvasTitle(getCanvasTitle(selectedCodeBlock?.language));

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
    <div className="tw-relative tw-size-full">
      {isPending && (
        <div className="tw-absolute tw-inset-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2 tw-animate-in tw-fade-in">
          <LuLoaderCircle className="tw-size-10 tw-animate-spin tw-text-muted-foreground" />
        </div>
      )}
      {!isPending && error && (
        <div className="tw-flex tw-flex-col tw-gap-4 tw-p-4">
          <div className="tw-whitespace-pre tw-font-mono tw-text-red-500 tw-animate-in tw-fade-in">
            <div className="tw-text-lg tw-font-bold">
              An error occurred while rendering the PlantUML code:
            </div>
            <div>{error.message}</div>
          </div>
          <Button
            className="tw-w-max"
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
