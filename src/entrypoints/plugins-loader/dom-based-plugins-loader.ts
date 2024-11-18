import { globalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { noFileCreationOnPaste } from "@/features/plugins/query-box/no-file-creation-on-paste";

export function setupDomBasedPlugins() {
  globalDomObserverStore.subscribe(({ queryBoxes }) => {
    noFileCreationOnPaste(queryBoxes);
  });
}
