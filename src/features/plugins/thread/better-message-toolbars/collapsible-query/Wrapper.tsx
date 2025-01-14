import { Portal } from "@/components/ui/portal";
import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import collapsibleQueryCss from "@/features/plugins/thread/better-message-toolbars/collapsible-query/collapsible-query.css?inline";
import CollapsibleQueryToggleButton from "@/features/plugins/thread/better-message-toolbars/collapsible-query/CollapsibleQueryToggleButton";
import { useInsertCss } from "@/hooks/useInsertCss";

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
