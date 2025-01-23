import { sendMessage } from "webext-bridge/content-script";

import FaArrowUpRight from "@/components/icons/FaArrowUpRight";
import { Portal } from "@/components/ui/portal";
import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { DOM_SELECTORS } from "@/utils/dom-selectors";

export default function SettingsDashboardLink() {
  const topNavWrapper = useGlobalDomObserverStore(
    (store) => store.settingsPageComponents.topNavWrapper,
  );

  const portalContainer = useMemo(() => {
    if (topNavWrapper == null) return null;

    const $topNavWrapper = $(topNavWrapper);

    const $navLinksWrapper = $topNavWrapper.find(
      DOM_SELECTORS.SETTINGS_PAGE.TOP_NAV_CHILD.NAV_LINKS_WRAPPER,
    );

    if (!$navLinksWrapper.length) return null;

    return $navLinksWrapper[0];
  }, [topNavWrapper]);

  if (portalContainer == null) return null;

  return (
    <Portal container={portalContainer}>
      <div
        className="tw-flex tw-cursor-pointer tw-items-center tw-gap-1 tw-text-sm tw-font-medium tw-text-muted-foreground tw-transition-all hover:tw-text-foreground"
        onClick={() => {
          sendMessage("bg:openOptionsPage", undefined, "background");
        }}
      >
        <FaArrowUpRight className="tw-size-[14px]" />
        <div>Complexity</div>
      </div>
    </Portal>
  );
}
