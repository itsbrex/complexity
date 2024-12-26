import { produce } from "immer";

import { ExtensionLocalStorage } from "@/services/extension-local-storage/extension-local-storage.types";
import { DEFAULT_STORAGE } from "@/services/extension-local-storage/storage-defaults";

export const ESSENTIALS_ONLY: ExtensionLocalStorage["plugins"] = produce(
  DEFAULT_STORAGE.plugins,
  (draft) => {
    draft["queryBox:languageModelSelector"].enabled = true;
    draft["queryBox:spaceNavigator"].enabled = true;
    draft["thread:toc"].enabled = true;
    draft["thread:betterMessageToolbars"].enabled = true;
    draft["thread:exportThread"].enabled = true;
    draft["thread:betterMessageCopyButtons"].enabled = true;
    draft["imageGenModelSelector"].enabled = true;
  },
);

export const POWER_USER: ExtensionLocalStorage["plugins"] = produce(
  DEFAULT_STORAGE.plugins,
  (draft) => {
    draft["queryBox:languageModelSelector"].enabled = true;
    draft["queryBox:focusSelector"].enabled = true;
    draft["queryBox:spaceNavigator"].enabled = true;
    draft["queryBox:slashCommandMenu:promptHistory"].enabled = true;
    draft["queryBox:noFileCreationOnPaste"].enabled = true;
    draft["queryBox:fullWidthFollowUp"].enabled = true;
    draft["commandMenu"].enabled = true;
    draft["thread:toc"].enabled = true;
    draft["thread:betterMessageToolbars"].enabled = true;
    draft["thread:exportThread"].enabled = true;
    draft["thread:betterMessageCopyButtons"].enabled = true;
    draft["thread:dragAndDropFileToUploadInThread"].enabled = true;
    draft["imageGenModelSelector"].enabled = true;
    draft["zenMode"].enabled = true;
  },
);

export const ALL_PLUGINS: ExtensionLocalStorage["plugins"] = produce(
  DEFAULT_STORAGE.plugins,
  (draft) => {
    Object.keys(draft).forEach((key) => {
      draft[key as keyof typeof draft].enabled = true;
    });
  },
);
