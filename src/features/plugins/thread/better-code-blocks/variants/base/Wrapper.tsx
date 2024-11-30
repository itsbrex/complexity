import { TabContent } from "@ark-ui/react";

import CsUiPluginsGuard from "@/components/CsUiPluginsGuard";
import { Tabs } from "@/components/ui/tabs";
import { useMirroredCodeBlockContext } from "@/features/plugins/thread/better-code-blocks/MirroredCodeBlockContext";
import BetterCodeBlockHeader from "@/features/plugins/thread/better-code-blocks/variants/base/Header";
import MermaidPreviewContent from "@/features/plugins/thread/better-code-blocks/variants/base/header-buttons/mermaid-preview/Content";
import HighlightedCodeWrapper from "@/features/plugins/thread/better-code-blocks/variants/HighlightedCode";

export const BaseCodeBlockWrapper = memo(function BaseCodeBlockWrapper() {
  const { maxHeight, content, language } = useMirroredCodeBlockContext()(
    (state) => ({
      maxHeight: state.maxHeight,
      content: state.content,
      language: state.language,
    }),
  );

  return (
    <div
      className={cn(
        "tw-relative tw-my-4 tw-flex tw-flex-col tw-rounded-md tw-border tw-border-border/50 tw-bg-secondary tw-font-mono",
        {
          "tw-overflow-hidden": maxHeight === 0,
        },
      )}
    >
      <BetterCodeBlockHeader />
      <Tabs value={content}>
        <TabContent value="code">
          <HighlightedCodeWrapper />
        </TabContent>
        {language === "mermaid" && (
          <CsUiPluginsGuard
            dependentPluginIds={["thread:betterCodeBlocks:previewMermaid"]}
          >
            <TabContent value="mermaid">
              <MermaidPreviewContent />
            </TabContent>
          </CsUiPluginsGuard>
        )}
      </Tabs>
    </div>
  );
});
