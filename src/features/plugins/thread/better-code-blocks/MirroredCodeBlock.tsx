import { useMirroredCodeBlockContext } from "@/features/plugins/thread/better-code-blocks/MirroredCodeBlockContext";
import BaseCodeBlockWrapper from "@/features/plugins/thread/better-code-blocks/variants/base/Wrapper";
import CanvasPlaceholderWrapper from "@/features/plugins/thread/better-code-blocks/variants/canvas-placeholders/Wrapper";
import { isAutonomousCanvasLanguageString } from "@/features/plugins/thread/canvas/canvas.types";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";

const MirroredCodeBlock = memo(function MirroredCodeBlock() {
  const { language } = useMirroredCodeBlockContext()((state) => ({
    language: state.language,
  }));

  const { isMobile } = useIsMobileStore();
  if (isMobile) return <BaseCodeBlockWrapper />;

  const settings = ExtensionLocalStorageService.getCachedSync();
  const isAutonomousCanvasLanguage =
    settings.plugins["thread:canvas"].enabled &&
    isAutonomousCanvasLanguageString(language);

  if (isAutonomousCanvasLanguage) return <CanvasPlaceholderWrapper />;

  return <BaseCodeBlockWrapper />;
});

export default MirroredCodeBlock;
