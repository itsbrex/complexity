import { Portal } from "@/components/ui/portal";
import ImageGenModelSelector from "@/features/plugins/image-gen-popover/ImageGenModelSelector";
import useObserver from "@/features/plugins/image-gen-popover/useObserver";

export default function ImageGenModelSelectorWrapper() {
  const portalContainer = useObserver();

  return (
    <Portal container={portalContainer}>
      <ImageGenModelSelector />
    </Portal>
  );
}
