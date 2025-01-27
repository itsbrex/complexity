import { useGlobalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";
import { DOM_SELECTORS } from "@/utils/dom-selectors";

export default function QueryWordsAndCharactersCount({
  messageBlockIndex,
}: {
  messageBlockIndex: number;
}) {
  const messageBlock = useGlobalDomObserverStore(
    (store) => store.threadComponents.messageBlocks?.[messageBlockIndex],
  );

  if (messageBlock == null) return null;

  const query = messageBlock.$query
    .find(DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.QUERY_TITLE)
    .text();

  const queryWordsCount = query.split(" ").length;
  const queryCharactersCount = query.length;

  return (
    <div className="x-mx-2 x-flex x-items-center x-gap-2 x-text-xs x-font-medium x-italic x-text-muted-foreground">
      {t("common:misc.words")}: {queryWordsCount}, {t("common:misc.characters")}
      : {queryCharactersCount}
    </div>
  );
}
