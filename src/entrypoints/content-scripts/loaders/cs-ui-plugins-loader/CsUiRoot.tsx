/* eslint-disable import/no-duplicates */
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Fragment } from "react/jsx-runtime";

import { APP_CONFIG } from "@/app.config";
import "@/assets/cs.css";
import csUiRootCss from "@/assets/cs.css?inline";
import CsUiPluginsGuard from "@/components/CsUiPluginsGuard";
import { Toaster } from "@/components/Toaster";
import { useSpaRouter } from "@/features/plugins/_core/spa-router/listeners";
import { useInsertCss } from "@/hooks/useInsertCss";

const ImageGenModelSelectorWrapper = lazy(
  () => import("@/features/plugins/image-gen-popover/Wrapper"),
);
const OnCloudflareTimeout = lazy(
  () =>
    import("@/features/plugins/on-cf-timeout-auto-reload/OnCloudflareTimeout"),
);
const QueryBoxWrapper = lazy(
  () => import("@/features/plugins/query-box/Wrapper"),
);
const BetterCodeBlocksWrapper = lazy(
  () => import("@/features/plugins/thread/better-code-blocks/Wrapper"),
);
const BetterMessageCopyButtons = lazy(
  () => import("@/features/plugins/thread/better-message-copy-buttons/Wrapper"),
);
const BetterMessageToolbarsWrapper = lazy(
  () => import("@/features/plugins/thread/better-message-toolbars/Wrapper"),
);
const ExportThreadWrapper = lazy(
  () => import("@/features/plugins/thread/export-thread/Wrapper"),
);
const ThreadTocWrapper = lazy(
  () => import("@/features/plugins/thread/toc/Wrapper"),
);

export default function CsUiRoot() {
  // normalize css precedence on build vs dev environment
  useInsertCss({
    id: "cplx-cs-ui-root",
    css: csUiRootCss,
    inject: !APP_CONFIG.IS_DEV,
  });

  return (
    <>
      <CsUiPluginsGuard
        dependentPluginIds={[
          "queryBox:languageModelSelector",
          "queryBox:noFileCreationOnPaste",
        ]}
      >
        <QueryBoxWrapper />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard location={["thread"]}>
        <ThreadComponent />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard dependentPluginIds={["onCloudflareTimeoutAutoReload"]}>
        <OnCloudflareTimeout />
      </CsUiPluginsGuard>
      <Toaster />
      <ReactQueryDevtools />
    </>
  );
}

function ThreadComponent() {
  const { url } = useSpaRouter();

  return (
    <Fragment key={url}>
      <CsUiPluginsGuard
        requiresPplxPro
        dependentPluginIds={["imageGenModelSelector"]}
      >
        <ImageGenModelSelectorWrapper />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard dependentPluginIds={["thread:toc"]}>
        <ThreadTocWrapper />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard dependentPluginIds={["thread:betterMessageToolbars"]}>
        <BetterMessageToolbarsWrapper />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard dependentPluginIds={["thread:betterCodeBlocks"]}>
        <BetterCodeBlocksWrapper />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard
        dependentPluginIds={["thread:betterMessageCopyButtons"]}
      >
        <BetterMessageCopyButtons />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard dependentPluginIds={["thread:exportThread"]}>
        <ExportThreadWrapper />
      </CsUiPluginsGuard>
    </Fragment>
  );
}
