import { globalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { noFileCreationOnPaste } from "@/features/plugins/query-box/no-file-creation-on-paste";
import { explicitModelName } from "@/features/plugins/thread/better-message-toolbars/explicit-model-name";

export async function setupDomBasedPlugins() {
  globalDomObserverStore.subscribe(
    (state) => state.queryBoxes,
    (queryBoxes) => {
      noFileCreationOnPaste(queryBoxes);
    },
  );

  globalDomObserverStore.subscribe(
    (state) => state.threadComponents.messageBlocks,
    (messageBlocks) => {
      explicitModelName(messageBlocks ?? []);
    },
  );
}
