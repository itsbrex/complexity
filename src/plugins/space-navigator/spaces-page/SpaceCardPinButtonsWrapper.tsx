import { Portal } from "@/components/ui/portal";
import { useInsertCss } from "@/hooks/useInsertCss";
import { useGlobalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";
import relativePositionedCard from "@/plugins/space-navigator/spaces-page/space-cards.css?inline";
import SpaceCardPinButton from "@/plugins/space-navigator/spaces-page/SpaceCardPinButton";

export default function SpaceCardsWrapper() {
  const spaceCards = useGlobalDomObserverStore(
    (state) => state.spacesPageComponents.spaceCards,
  );

  useInsertCss({
    css: relativePositionedCard,
    id: "space-cards",
  });

  if (spaceCards == null) return null;

  return spaceCards.map((spaceCard, index) => (
    <Portal key={index} container={spaceCard}>
      <SpaceCardPinButton htmlNode={spaceCard} />
    </Portal>
  ));
}
