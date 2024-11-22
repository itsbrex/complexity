/* eslint-disable import/no-duplicates */
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Fragment } from "react/jsx-runtime";

import { APP_CONFIG } from "@/app.config";
import "@/assets/cs.css";
import csUiRootCss from "@/assets/cs.css?inline";
import { Toaster } from "@/components/Toaster";
import CsUiPluginsGuard from "@/entrypoints/plugins-loader/cs-ui-plugins-loader/CsUiPluginsGuard";
import { useSpaRouter } from "@/features/plugins/_core/spa-router/listeners";
import ImageGenModelSelectorWrapper from "@/features/plugins/image-gen-popover/Wrapper";
import OnCloudflareTimeout from "@/features/plugins/on-cf-timeout-auto-reload/OnCloudflareTimeout";
import QueryBoxWrapper from "@/features/plugins/query-box/Wrapper";
import { BetterCodeBlocksWrapper } from "@/features/plugins/thread/better-code-blocks/Wrapper";
import { BetterMessageToolbarsWrapper } from "@/features/plugins/thread/better-message-toolbars/Wrapper";
import ThreadNavigationTocWrapper from "@/features/plugins/thread/toc/Wrapper";
import { useInsertCss } from "@/hooks/useInsertCss";

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
      <CsUiPluginsGuard dependentPluginIds={["imageGenModelSelector"]}>
        <ImageGenModelSelectorWrapper />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard dependentPluginIds={["thread:toc"]}>
        <ThreadNavigationTocWrapper />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard dependentPluginIds={["thread:betterMessageToolbars"]}>
        <BetterMessageToolbarsWrapper />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard dependentPluginIds={["thread:betterCodeBlocks"]}>
        <BetterCodeBlocksWrapper />
      </CsUiPluginsGuard>
    </Fragment>
  );
}
