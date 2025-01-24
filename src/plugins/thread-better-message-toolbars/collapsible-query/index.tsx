import { Portal } from "@/components/ui/portal";
import { useInsertCss } from "@/hooks/useInsertCss";
import { useGlobalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";
import collapsibleQueryCss from "@/plugins/thread-better-message-toolbars/collapsible-query/collapsible-query.css?inline";
import CollapsibleQueryToggleButton from "@/plugins/thread-better-message-toolbars/collapsible-query/CollapsibleQueryToggleButton";

export default function CollapsibleQueryWrapper() {
  const queryHoverContainers = useGlobalDomObserverStore(
    (state) => state.threadComponents.queryHoverContainers,
  );

  useInsertCss({
    css: collapsibleQueryCss,
    id: "collapsible-query",
  });

  if (queryHoverContainers == null) return null;

  return queryHoverContainers.map((queryHoverContainer, index) => {
    return (
      <Portal key={index} container={queryHoverContainer}>
        <CollapsibleQueryToggleButton messageIndex={index} />
      </Portal>
    );
  });
}
