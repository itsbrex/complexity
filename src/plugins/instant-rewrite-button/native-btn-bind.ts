import { isHotkeyPressed } from "react-hotkeys-hook";

import { threadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { handleInstantRewrite } from "@/plugins/instant-rewrite-button/handle-instant-rewrite";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { DOM_SELECTORS } from "@/utils/dom-selectors";

const OBSERVER_ID = "instant-rewrite-button-native-btn-bind";

csLoaderRegistry.register({
  id: "plugin:thread:instantRewriteButton:nativeBtnBind",
  dependencies: ["cache:pluginsStates"],
  loader: () => {
    const pluginsEnableStates =
      PluginsStatesService.getEnableStatesCachedSync();

    if (!pluginsEnableStates["thread:instantRewriteButton"]) return;

    threadMessageBlocksDomObserverStore.subscribe(
      (state) => state.messageBlocks,
      (messageBlocks) => {
        messageBlocks?.forEach((messageBlock, index) => {
          const $bottomBar = messageBlock.nodes.$bottomBar;

          if (!$bottomBar.length) return;

          const $nativeRewriteBtn = $bottomBar.find(
            DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.BOTTOM_BAR_CHILD
              .REWRITE_BUTTON,
          );

          if (!$nativeRewriteBtn.length || $nativeRewriteBtn.attr(OBSERVER_ID))
            return;

          $nativeRewriteBtn.attr(OBSERVER_ID, "true");

          $nativeRewriteBtn.on("click", (e) => {
            if (!isHotkeyPressed(Key.Control) && !isHotkeyPressed(Key.Meta))
              return;

            e.preventDefault();
            e.stopPropagation();

            handleInstantRewrite({ messageBlockIndex: index });
          });
        });
      },
      {
        equalityFn: deepEqual,
      },
    );
  },
});
