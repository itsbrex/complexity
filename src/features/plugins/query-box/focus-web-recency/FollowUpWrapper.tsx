import { useQuery } from "@tanstack/react-query";
import { sendMessage } from "webext-bridge/content-script";

import {
  allowFocusModes,
  RECENCIES,
} from "@/data/plugins/focus-selector/focus-web-recency";
import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import { useSpaRouter } from "@/features/plugins/_core/spa-router/listeners";
import FocusWebRecencySelector from "@/features/plugins/query-box/focus-web-recency/FocusWebRecencySelector";
import { useSharedQueryBoxStore } from "@/features/plugins/query-box/shared-store";
import { parseUrl } from "@/utils/utils";

export default function FocusWebRecencySelectorFollowUpWrapper() {
  const { url } = useSpaRouter();

  const threadSlug = parseUrl(url).pathname.split("/").pop() || "";

  const { selectedRecency, setSelectedRecency } = useSharedQueryBoxStore(
    (state) => ({
      selectedRecency: state.selectedRecency,
      setSelectedRecency: state.setSelectedRecency,
    }),
  );

  const messageBlocks = useGlobalDomObserverStore(
    (state) => state.threadComponents.messageBlocks,
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

  if (!searchFocus || !allowFocusModes.includes(searchFocus)) return null;

  const recencyData = RECENCIES.find(
    (recency) => recency.value === selectedRecency,
  );

  if (recencyData == null) return null;

  return (
    <FocusWebRecencySelector
      value={selectedRecency}
      setValue={setSelectedRecency}
      recencyData={recencyData}
    />
  );
}
