import { Portal } from "@/components/ui/portal";
import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";
import relativePositionedCard from "@/features/plugins/space-navigator/spaces-page/space-cards.css?inline";
import SpaceCardPinButton from "@/features/plugins/space-navigator/spaces-page/SpaceCardPinButton";
import { useInsertCss } from "@/hooks/useInsertCss";

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
