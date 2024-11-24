import hideUnnecessaryButtonsCss from "@/features/plugins/thread/better-message-toolbars/hide-unnecessary-buttons.css?inline";
import simplifyRewriteDropdownCss from "@/features/plugins/thread/better-message-toolbars/simplify-rewrite-dropdown.css?inline";
import stickyCss from "@/features/plugins/thread/better-message-toolbars/sticky.css?inline";
import { useObserveStuckToolbar } from "@/features/plugins/thread/better-message-toolbars/useObserveStuckToolbar";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { useInsertCss } from "@/hooks/useInsertCss";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";

export default function BetterMessageToolbarsWrapper() {
  const settings = ExtensionLocalStorageService.getCachedSync();

  const { isMobile } = useIsMobileStore();

  useObserveStuckToolbar();

  useInsertCss({
    id: "cplx-better-message-toolbars-sticky",
    css: stickyCss,
    inject: settings?.plugins["thread:betterMessageToolbars"].sticky,
  });

  useInsertCss({
    id: "cplx-better-message-toolbars-simplify-rewrite-dropdown",
    css: simplifyRewriteDropdownCss,
    inject:
      settings?.plugins["thread:betterMessageToolbars"]
        .simplifyRewriteDropdown && !isMobile,
  });

  useInsertCss({
    id: "cplx-better-message-toolbars-hide-unnecessary-buttons",
    css: hideUnnecessaryButtonsCss,
    inject:
      settings?.plugins["thread:betterMessageToolbars"].hideUnnecessaryButtons,
  });

  return null;
}
