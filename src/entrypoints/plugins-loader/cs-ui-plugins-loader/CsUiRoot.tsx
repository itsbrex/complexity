import "@/assets/cs.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Fragment } from "react/jsx-runtime";

import { Toaster } from "@/components/Toaster";
import CsUiPluginsGuard from "@/entrypoints/plugins-loader/cs-ui-plugins-loader/CsUiPluginsGuard";
import { useSpaRouter } from "@/features/plugins/_core/spa-router/listeners";
import ImageGenModelSelectorWrapper from "@/features/plugins/image-gen-popover/Wrapper";
import OnCloudflareTimeout from "@/features/plugins/on-cf-timeout-auto-reload/OnCloudflareTimeout";
import QueryBoxWrapper from "@/features/plugins/query-box/Wrapper";
import ThreadNavigationTocWrapper from "@/features/plugins/thread/toc/Wrapper";

export default function CsUiRoot() {
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
      <CsUiPluginsGuard
        location={["thread"]}
        dependentPluginIds={["imageGenModelSelector"]}
      >
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
    </Fragment>
  );
}
