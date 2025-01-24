import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { LuGlobe, LuPencil } from "react-icons/lu";
import { sendMessage } from "webext-bridge/content-script";

import Tooltip from "@/components/Tooltip";
import {
  FOCUS_MODES,
  FocusMode,
} from "@/data/plugins/better-focus-selector/focus-modes";
import { useGlobalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";
import { useSpaRouter } from "@/plugins/_api/spa-router/listeners";
import { useSharedQueryBoxStore } from "@/plugins/_core/ui-groups/query-box/shared-store";
import { parseUrl } from "@/utils/utils";

const webFocusModes: FocusMode["code"][] = [
  "internet",
  "reddit",
  "scholar",
  "youtube",
];

export default function SourcesToggle() {
  const { url } = useSpaRouter();

  const threadSlug = parseUrl(url).pathname.split("/").pop() || "";

  const { forceExternalSourcesOff, setForceExternalSourcesOff } =
    useSharedQueryBoxStore((state) => ({
      forceExternalSourcesOff: state.forceExternalSourcesOff,
      setForceExternalSourcesOff: state.setForceExternalSourcesOff,
    }));

  const messageBlocks = useDebounce(
    useGlobalDomObserverStore((state) => state.threadComponents.messageBlocks),
    200,
  );

  const { data: searchFocus, refetch: refetchSearchFocus } = useQuery({
    queryKey: ["vDom", "firstMessageFocusMode", threadSlug],
    queryFn: async () => {
      const focusMode = await sendMessage(
        "reactVdom:getMessageFocusMode",
        {
          index: 0,
        },
        "window",
      );

      return focusMode;
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled:
      threadSlug !== "new" && !!messageBlocks && messageBlocks.length > 0,
  });

  useEffect(() => {
    refetchSearchFocus();
  }, [messageBlocks, url, refetchSearchFocus]);

  if (!searchFocus || !webFocusModes.includes(searchFocus)) return null;

  const focusModeData = FOCUS_MODES.find((mode) => mode.code === searchFocus);

  const Icon = focusModeData?.Icon ?? LuGlobe;
  const label =
    focusModeData?.label ??
    t("plugin-focus-selector:focusSelector.modes.internet");

  return (
    <Tooltip
      content={
        forceExternalSourcesOff
          ? t("plugin-focus-selector:focusSelector.modes.writing")
          : label
      }
    >
      <button
        className="tw-flex tw-min-h-8 tw-w-max tw-cursor-pointer tw-items-center tw-justify-between tw-gap-1 tw-rounded-md tw-px-2 tw-text-center tw-text-sm tw-font-medium tw-text-muted-foreground tw-outline-none tw-transition-all tw-duration-150 placeholder:tw-text-muted-foreground hover:tw-bg-primary-foreground hover:tw-text-foreground focus-visible:tw-bg-primary-foreground focus-visible:tw-outline-none active:tw-scale-95 disabled:tw-cursor-not-allowed disabled:tw-opacity-50 [&>span]:!tw-truncate"
        onClick={() => {
          setForceExternalSourcesOff(!forceExternalSourcesOff);
        }}
      >
        {forceExternalSourcesOff ? (
          <LuPencil className="tw-size-4 tw-animate-in tw-fade-in-0" />
        ) : (
          <Icon className="tw-size-4 tw-animate-in tw-fade-in-0" />
        )}
      </button>
    </Tooltip>
  );
}
