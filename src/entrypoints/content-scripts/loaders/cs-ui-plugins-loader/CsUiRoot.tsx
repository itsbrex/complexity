/* eslint-disable import/no-duplicates */
// must keep this for tailwind to generate and hmr arbitrary classes in dev mode (this will be removed in prod)
import "@/assets/cs.css";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Fragment } from "react/jsx-runtime";

import { APP_CONFIG } from "@/app.config";
import csUiRootCss from "@/assets/cs.css?inline";
import CsUiPluginsGuard from "@/components/CsUiPluginsGuard";
// import { SponsorHomeLink } from "@/components/SponsorHomeLink";
import { PostUpdateReleaseNotesDialog } from "@/components/PostUpdateReleaseNotesDialog";
import { Toaster } from "@/components/Toaster";
import { useSpaRouter } from "@/features/plugins/_core/spa-router/listeners";
import SpaceNavigatorWrapper from "@/features/plugins/sidebar/space-navigator/Wrapper";
import CollapsibleQueryWrapper from "@/features/plugins/thread/better-message-toolbars/collapsible-query/Wrapper";
import { useInsertCss } from "@/hooks/useInsertCss";

const HomepageUpdateAnnouncer = lazy(
  () => import("@/components/HomepageUpdateAnnouncer"),
);
const QueryBoxWrapper = lazy(
  () => import("@/features/plugins/query-box/Wrapper"),
);
const CommandMenuWrapper = lazy(
  () => import("@/features/plugins/command-menu/Wrapper"),
);
const ImageGenModelSelectorWrapper = lazy(
  () => import("@/features/plugins/image-gen-popover/Wrapper"),
);
const OnCloudflareTimeout = lazy(
  () =>
    import("@/features/plugins/on-cf-timeout-auto-reload/OnCloudflareTimeout"),
);
const BetterCodeBlocksWrapper = lazy(
  () => import("@/features/plugins/thread/better-code-blocks/Wrapper"),
);
const CanvasWrapper = lazy(
  () => import("@/features/plugins/thread/canvas/Wrapper"),
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
  useInsertCss({
    id: "cplx-cs-ui-root",
    css: csUiRootCss,
    inject: !APP_CONFIG.IS_DEV,
  });

  return (
    <>
      <PostUpdateReleaseNotesDialog />
      <CsUiPluginsGuard location={["home"]}>
        <HomepageUpdateAnnouncer />
        {/* <SponsorHomeLink /> */}
      </CsUiPluginsGuard>
      <CsUiPluginsGuard
        dependentPluginIds={[
          "queryBox:languageModelSelector",
          "queryBox:spaceNavigator",
          "queryBox:slashCommandMenu:promptHistory",
          "queryBox:focusSelector",
          "queryBox:focusSelector:webRecency",
        ]}
      >
        <QueryBoxWrapper />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard desktopOnly dependentPluginIds={["commandMenu"]}>
        <CommandMenuWrapper />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard>
        <SidebarComponents />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard location={["thread"]}>
        <ThreadComponents />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard dependentPluginIds={["onCloudflareTimeoutAutoReload"]}>
        <OnCloudflareTimeout />
      </CsUiPluginsGuard>
      <Toaster />
      <ReactQueryDevtools />
    </>
  );
}

function ThreadComponents() {
  const { url } = useSpaRouter();

  return (
    <>
      <CsUiPluginsGuard
        desktopOnly
        allowedAccountTypes={["pro", "enterprise"]}
        dependentPluginIds={["imageGenModelSelector"]}
      >
        <ImageGenModelSelectorWrapper />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard desktopOnly dependentPluginIds={["thread:canvas"]}>
        <CanvasWrapper />
      </CsUiPluginsGuard>

      <CsUiPluginsGuard dependentPluginIds={["thread:betterMessageToolbars"]}>
        <BetterMessageToolbarsWrapper />
        <CollapsibleQueryWrapper />
      </CsUiPluginsGuard>

      <CsUiPluginsGuard dependentPluginIds={["thread:betterCodeBlocks"]}>
        <BetterCodeBlocksWrapper />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard
        dependentPluginIds={["thread:betterMessageCopyButtons"]}
      >
        <BetterMessageCopyButtons />
      </CsUiPluginsGuard>
      <Fragment key={url}>
        <CsUiPluginsGuard dependentPluginIds={["thread:toc"]}>
          <ThreadTocWrapper />
        </CsUiPluginsGuard>
        <CsUiPluginsGuard dependentPluginIds={["thread:exportThread"]}>
          <ExportThreadWrapper />
        </CsUiPluginsGuard>
      </Fragment>
    </>
  );
}

function SidebarComponents() {
  return (
    <CsUiPluginsGuard
      desktopOnly
      requiresLoggedIn
      dependentPluginIds={["queryBox:spaceNavigator"]}
    >
      <SpaceNavigatorWrapper />
    </CsUiPluginsGuard>
  );
}

export { csUiRootCss };
