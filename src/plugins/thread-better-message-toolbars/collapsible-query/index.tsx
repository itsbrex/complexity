import { Portal } from "@/components/ui/portal";
import { useInsertCss } from "@/hooks/useInsertCss";
import { useThreadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import collapsibleQueryCss from "@/plugins/thread-better-message-toolbars/collapsible-query/collapsible-query.css?inline";
import CollapsibleQueryToggleButton from "@/plugins/thread-better-message-toolbars/collapsible-query/CollapsibleQueryToggleButton";

export default function CollapsibleQueryWrapper() {
  const $queryHoverContainers = useThreadMessageBlocksDomObserverStore(
    (store) =>
      store.messageBlocks?.map((block) => block.nodes.$queryHoverContainer),
  );

  useInsertCss({
    css: collapsibleQueryCss,
    id: "collapsible-query",
  });

  if ($queryHoverContainers == null || !$queryHoverContainers.length)
    return null;

  return $queryHoverContainers.map(($queryHoverContainer, index) => {
    return (
      <Portal key={index} container={$queryHoverContainer[0]}>
        <CollapsibleQueryToggleButton messageIndex={index} />
      </Portal>
    );
  });
}
