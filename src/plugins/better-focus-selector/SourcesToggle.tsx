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
        className="x-flex x-min-h-8 x-w-max x-cursor-pointer x-items-center x-justify-between x-gap-1 x-rounded-md x-px-2 x-text-center x-text-sm x-font-medium x-text-muted-foreground x-outline-none x-transition-all x-duration-150 placeholder:x-text-muted-foreground hover:x-bg-primary-foreground hover:x-text-foreground focus-visible:x-bg-primary-foreground focus-visible:x-outline-none active:x-scale-95 disabled:x-cursor-not-allowed disabled:x-opacity-50 [&>span]:!x-truncate"
        onClick={() => {
          setForceExternalSourcesOff(!forceExternalSourcesOff);
        }}
      >
        {forceExternalSourcesOff ? (
          <LuPencil className="x-size-4 x-animate-in x-fade-in-0" />
        ) : (
          <Icon className="x-size-4 x-animate-in x-fade-in-0" />
        )}
      </button>
    </Tooltip>
  );
}
