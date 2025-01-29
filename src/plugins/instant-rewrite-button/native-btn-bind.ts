import { isHotkeyPressed } from "react-hotkeys-hook";

import { globalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";
import { handleInstantRewrite } from "@/plugins/instant-rewrite-button/handle-instant-rewrite";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { DOM_SELECTORS } from "@/utils/dom-selectors";

const OBSERVER_ID = "instant-rewrite-button-native-btn-bind";

csLoaderRegistry.register({
  id: "plugin:thread:instantRewriteButton:nativeBtnBind",
  loader: () => {
    const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

    if (!pluginsEnableStates["thread:instantRewriteButton"]) return;

    globalDomObserverStore.subscribe(
      (store) => store.threadComponents.messageBlockBottomBars,
      (messageBlockBottomBars) => {
        messageBlockBottomBars?.forEach((messageBlockBottomBar, index) => {
          if (messageBlockBottomBar == null) return;

          const $nativeRewriteBtn = $(messageBlockBottomBar).find(
            DOM_SELECTORS.THREAD.MESSAGE.BOTTOM_BAR_CHILD.REWRITE_BUTTON,
          );

          if (
            !$nativeRewriteBtn.length ||
            $nativeRewriteBtn.internalComponentAttr() === OBSERVER_ID
          )
            return;

          $nativeRewriteBtn.internalComponentAttr(OBSERVER_ID);

          $nativeRewriteBtn.on("click", (e) => {
            if (!isHotkeyPressed(Key.Control) && !isHotkeyPressed(Key.Meta))
              return;

            e.preventDefault();
            e.stopPropagation();

            handleInstantRewrite({ messageBlockIndex: index });
          });
        });
      },
    );
  },
});
