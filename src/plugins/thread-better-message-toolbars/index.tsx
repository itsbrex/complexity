import { useInsertCss } from "@/hooks/useInsertCss";
import hideUnnecessaryButtonsCss from "@/plugins/thread-better-message-toolbars/hide-unnecessary-buttons.css?inline";
import stickyCss from "@/plugins/thread-better-message-toolbars/sticky.css?inline";
import { useObserveStuckToolbar } from "@/plugins/thread-better-message-toolbars/useObserveStuckToolbar";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";

export default function BetterMessageToolbarsWrapper() {
  const settings = ExtensionLocalStorageService.getCachedSync();

  useObserveStuckToolbar();

  useInsertCss({
    id: "cplx-better-message-toolbars-sticky",
    css: stickyCss,
    inject: settings?.plugins["thread:betterMessageToolbars"].sticky,
  });

  useInsertCss({
    id: "cplx-better-message-toolbars-hide-unnecessary-buttons",
    css: hideUnnecessaryButtonsCss,
    inject:
      settings?.plugins["thread:betterMessageToolbars"].hideUnnecessaryButtons,
  });

  return null;
}
