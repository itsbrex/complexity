import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { isAutonomousCanvasLanguageString } from "@/plugins/canvas/canvas.types";
import { useMirroredCodeBlockContext } from "@/plugins/thread-better-code-blocks/MirroredCodeBlockContext";
import BaseCodeBlockWrapper from "@/plugins/thread-better-code-blocks/variants/base/Wrapper";
import CanvasPlaceholderWrapper from "@/plugins/thread-better-code-blocks/variants/canvas-placeholders/Wrapper";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";

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
