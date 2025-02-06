import { SandpackPreviewRef } from "@codesandbox/sandpack-react";
import { ComponentType, SVGProps } from "react";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { spaRouteChangeCompleteSubscribe } from "@/plugins/_api/spa-router/listeners";
import {
  CanvasLanguage,
  CanvasState,
  formatCanvasTitle,
  getCanvasTitle,
  getInterpretedCanvasLanguage,
  isAutonomousCanvasLanguageString,
} from "@/plugins/canvas/canvas.types";
import { CANVAS_PLACEHOLDERS } from "@/plugins/canvas/canvases";
import { mirroredCodeBlocksStore } from "@/plugins/thread-better-code-blocks/store";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS } from "@/utils/dom-selectors";
import { scrollToElement, whereAmI } from "@/utils/utils";

type CodeBlockLocation = {
  messageBlockIndex: number;
  codeBlockIndex: number;
};

type CanvasBlock = {
  Icon: ComponentType<SVGProps<SVGElement>>;
  count: number;
  title: string;
  description: string;
  onClick: () => void;
  isInFlight: boolean;
  location: CodeBlockLocation[];
};

type CanvasStoreType = {
  isCanvasListOpen: boolean;
  openCanvasList: () => void;
  closeCanvasList: () => void;
  canvasBlocks: Record<string, CanvasBlock>;
  selectedCodeBlockLocation: CodeBlockLocation | null;
  setselectedCodeBlockLocation: (location: CodeBlockLocation) => void;
  state: CanvasState;
  setState: (state: CanvasState) => void;
  isValidCanvasCode: boolean;
  hasAutoPreviewTriggered: boolean;
  lastAutoOpenCodeBlockLocation: CodeBlockLocation | null;
  setHasAutoPreviewTriggered: (value: boolean) => void;
  setLastAutoOpenCodeBlockLocation: (value: CodeBlockLocation | null) => void;
  close: () => void;
  refreshPreviewKey: number;
  refreshPreview: () => void;
  sandpackPreviewRef: SandpackPreviewRef | null;
  setSandpackPreviewRef: (ref: SandpackPreviewRef | null) => void;
};

export const canvasStore = createWithEqualityFn<CanvasStoreType>()(
  subscribeWithSelector(
    immer(
      (set): CanvasStoreType => ({
        isCanvasListOpen: false,
        canvasBlocks: {},
        selectedCodeBlockLocation: null,
        state: "code",
        isValidCanvasCode: false,
        hasAutoPreviewTriggered: false,
        lastAutoOpenCodeBlockLocation: null,
        refreshPreviewKey: 0,

        openCanvasList: () => {
          set({ isCanvasListOpen: true, selectedCodeBlockLocation: null });
        },
        closeCanvasList: () => set({ isCanvasListOpen: false }),
        setselectedCodeBlockLocation: (location) =>
          set({ selectedCodeBlockLocation: location }),
        setState: (state) => set({ state }),
        setHasAutoPreviewTriggered: (value) =>
          set((draft) => {
            draft.hasAutoPreviewTriggered = value;
          }),
        setLastAutoOpenCodeBlockLocation: (value) =>
          set((draft) => {
            draft.lastAutoOpenCodeBlockLocation = value;
          }),
        close: () =>
          set((draft) => {
            draft.selectedCodeBlockLocation = null;
          }),
        refreshPreview: () =>
          set((draft) => {
            draft.refreshPreviewKey++;
          }),
        sandpackPreviewRef: null,
        setSandpackPreviewRef: (ref) => set({ sandpackPreviewRef: ref }),
      }),
    ),
  ),
);

csLoaderRegistry.register({
  id: "plugin:thread:canvas:resetOpenStateOnRouteChange",
  dependencies: ["cache:pluginsStates"],
  loader: () => {
    const isCanvasEnabled =
      PluginsStatesService.getCachedSync().pluginsEnableStates["thread:canvas"];
    if (!isCanvasEnabled) return;

    spaRouteChangeCompleteSubscribe((url) => {
      if (whereAmI(url) !== "thread")
        canvasStore.setState({
          isCanvasListOpen: false,
          selectedCodeBlockLocation: null,
        });
    });

    initializeAutonomousMode();

    emitResizeEvent();
  },
});

const initializeAutonomousMode = () => {
  mirroredCodeBlocksStore.subscribe(
    (state) => state.blocks,
    (blocks, prevBlocks) => {
      const getTotalBlocks = (blocks: any[]) =>
        blocks.reduce((acc, block) => acc + block.length, 0);

      if (getTotalBlocks(blocks) !== getTotalBlocks(prevBlocks)) {
        canvasStore.getState().setLastAutoOpenCodeBlockLocation(null);
      }
    },
  );

  mirroredCodeBlocksStore.subscribe(({ blocks }) => {
    requestIdleCallback(
      () => {
        const newCanvasBlocks: Record<string, CanvasBlock> = {};

        blocks.forEach((messageBlock, messageBlockIndex) => {
          messageBlock.forEach((codeBlock, codeBlockIndex) => {
            if (
              !codeBlock.language ||
              !isAutonomousCanvasLanguageString(codeBlock.language)
            )
              return;

            const key = getCanvasTitle(codeBlock.language);
            const interpretedLanguage = getInterpretedCanvasLanguage(
              codeBlock.language,
            );

            if (!(interpretedLanguage in CANVAS_PLACEHOLDERS)) return;

            updateCanvasBlocks({
              key,
              newCanvasBlocks,
              codeBlock,
              messageBlockIndex,
              codeBlockIndex,
              interpretedLanguage: interpretedLanguage as CanvasLanguage,
            });
          });
        });

        canvasStore.setState((draft) => {
          draft.canvasBlocks = newCanvasBlocks;
        });
      },
      { timeout: 2000 },
    );
  });

  canvasStore.subscribe((state, prevState) => {
    if (state.isCanvasListOpen && prevState.selectedCodeBlockLocation != null) {
      setTimeout(() => window.dispatchEvent(new Event("resize")), 300);
    }
  });
};

const updateCanvasBlocks = ({
  newCanvasBlocks,
  key,
  codeBlock,
  messageBlockIndex,
  codeBlockIndex,
  interpretedLanguage,
}: {
  newCanvasBlocks: Record<string, CanvasBlock>;
  key: string;
  codeBlock: any;
  messageBlockIndex: number;
  codeBlockIndex: number;
  interpretedLanguage: CanvasLanguage;
}) => {
  const location = { messageBlockIndex, codeBlockIndex };
  const placeholder = CANVAS_PLACEHOLDERS[interpretedLanguage];
  const title = formatCanvasTitle(key) || placeholder.defaultTitle;

  if (newCanvasBlocks[key]) {
    newCanvasBlocks[key].count++;
    newCanvasBlocks[key].isInFlight = codeBlock.isInFlight;
    newCanvasBlocks[key].location.push(location);
  } else {
    newCanvasBlocks[key] = {
      Icon: placeholder.icon,
      title,
      description: placeholder.description,
      onClick: () =>
        handleCanvasBlockClick({
          messageBlockIndex:
            newCanvasBlocks[key]?.location.at(-1)?.messageBlockIndex ?? 0,
          codeBlockIndex:
            newCanvasBlocks[key]?.location.at(-1)?.codeBlockIndex ?? 0,
        }),
      isInFlight: codeBlock.isInFlight,
      count: 1,
      location: [location],
    };
  }
};

const handleCanvasBlockClick = (location: CodeBlockLocation) => {
  canvasStore.setState((draft) => {
    draft.isCanvasListOpen = false;
    draft.selectedCodeBlockLocation = location;
    draft.state = "preview";

    const selector = `[data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.BLOCK}"][data-index="${location.messageBlockIndex}"] [data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.MIRRORED_CODE_BLOCK}"][data-index="${location.codeBlockIndex}"]`;
    scrollToElement($(selector), -100);
  });
};

const emitResizeEvent = () => {
  canvasStore.subscribe(
    (state) => ({
      isCanvasOpen: state.selectedCodeBlockLocation != null,
      isCanvasListOpen: state.isCanvasListOpen,
    }),
    () => {
      window.dispatchEvent(new Event("resize"));
    },
  );
};

export const useCanvasStore = canvasStore;
