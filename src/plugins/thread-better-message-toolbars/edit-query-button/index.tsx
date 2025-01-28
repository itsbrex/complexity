import FaPencilSquare from "@/components/icons/FaPencilSquare";
import { useGlobalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";
import {
  DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS,
  DOM_SELECTORS,
} from "@/utils/dom-selectors";

export default function EditQueryButton({
  messageBlockIndex,
}: {
  messageBlockIndex: number;
}) {
  const isEditingQuery = useGlobalDomObserverStore(
    (store) =>
      store.threadComponents.messageBlocks?.[messageBlockIndex]?.isEditingQuery,
  );

  const isReadOnly = useGlobalDomObserverStore(
    (store) =>
      store.threadComponents.messageBlocks?.[messageBlockIndex]?.isReadOnly,
  );

  const isAnyMessageBlockInFlight = useGlobalDomObserverStore((store) =>
    store.threadComponents.messageBlocks?.some((block) => block.isInFlight),
  );

  if (isReadOnly || isEditingQuery || isAnyMessageBlockInFlight) return null;

  return (
    <div
      role="button"
      className="x-cursor-pointer x-rounded-md x-p-2 x-text-base x-text-muted-foreground x-transition-all x-animate-in x-fade-in hover:x-bg-secondary hover:x-text-foreground active:x-scale-95"
      onClick={() => {
        const $editQueryButton = $(
          `[data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.BLOCK}"][data-index="${messageBlockIndex}"]`,
        )
          .find(
            DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.QUERY_HOVER_CONTAINER,
          )
          .find(
            DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD
              .QUERY_HOVER_CONTAINER_CHILD.EDIT_QUERY_BUTTON,
          );

        if (!$editQueryButton.length) return;

        $editQueryButton.trigger("click");
      }}
    >
      <FaPencilSquare />
    </div>
  );
}
