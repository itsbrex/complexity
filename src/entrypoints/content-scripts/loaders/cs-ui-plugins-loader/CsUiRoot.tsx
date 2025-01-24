/* eslint-disable import/no-duplicates */
// must keep this for tailwind to generate and hmr arbitrary classes in dev mode (this will be removed in prod)
import "@/assets/cs.css";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import csUiRootCss from "@/assets/cs.css?inline";
import CsUiPluginsGuard from "@/components/plugins-guard/CsUiPluginsGuard";
import { PostUpdateReleaseNotesDialog } from "@/components/PostUpdateReleaseNotesDialog";
// import { SponsorHomeLink } from "@/components/SponsorHomeLink";
import { Toaster } from "@/components/Toaster";

const BetterCodeBlocksWrapper = lazy(
  () => import("@/plugins/thread-better-code-blocks"),
);
const BetterMessageCopyButtons = lazy(
  () => import("@/plugins/thread-better-message-copy-buttons"),
);
const BetterMessageToolbarsWrapper = lazy(
  () => import("@/plugins/thread-better-message-toolbars"),
);
const CanvasWrapper = lazy(() => import("@/plugins/canvas"));
const CollapsibleQueryWrapper = lazy(
  () => import("@/plugins/thread-better-message-toolbars/collapsible-query"),
);
const CommandMenuWrapper = lazy(() => import("@/plugins/command-menu"));
const ExportThreadWrapper = lazy(() => import("@/plugins/export-thread"));
const HomepageUpdateAnnouncer = lazy(
  () => import("@/components/HomepageUpdateAnnouncer"),
);
const ImageGenModelSelectorWrapper = lazy(
  () => import("@/plugins/image-gen-popover"),
);
const OnCloudflareTimeout = lazy(
  () => import("@/plugins/on-cf-timeout-auto-reload"),
);
const QueryBoxWrapper = lazy(
  () => import("@/plugins/_core/ui-groups/query-box"),
);
const SettingsDashboardLink = lazy(
  () => import("@/components/SettingsDashboardLink"),
);
const SpaceCardsWrapper = lazy(
  () => import("@/plugins/space-navigator/spaces-page"),
);
const SpaceNavigatorWrapper = lazy(
  () => import("@/plugins/space-navigator/sidebar-content"),
);
const ThreadTocWrapper = lazy(() => import("@/plugins/thread-toc"));

export default function CsUiRoot() {
  return (
    <>
      <CsUiPluginsGuard
        desktopOnly
        additionalCheck={({ settings }) =>
          settings.showPostUpdateReleaseNotesPopup &&
          !settings.isPostUpdateReleaseNotesPopupDismissed
        }
      >
        <PostUpdateReleaseNotesDialog />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard location={["home"]}>
        <HomepageUpdateAnnouncer />
        {/* <SponsorHomeLink /> */}
      </CsUiPluginsGuard>
      <QueryBoxWrapper />
      <CsUiPluginsGuard desktopOnly dependentPluginIds={["commandMenu"]}>
        <CommandMenuWrapper />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard>
        <SidebarComponents />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard location={["thread"]}>
        <ThreadComponents />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard
        desktopOnly
        requiresLoggedIn
        location={["collections_page"]}
      >
        <SpaceCardsWrapper />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard dependentPluginIds={["onCloudflareTimeoutAutoReload"]}>
        <OnCloudflareTimeout />
      </CsUiPluginsGuard>

      <CsUiPluginsGuard location={["settings"]}>
        <SettingsDashboardLink />
      </CsUiPluginsGuard>

      <Toaster />
      <ReactQueryDevtools />
    </>
  );
}

function ThreadComponents() {
  return (
    <>
      <CsUiPluginsGuard
        desktopOnly
        allowedAccountTypes={[["pro"], ["pro", "enterprise"]]}
        dependentPluginIds={["imageGenModelSelector"]}
      >
        <ImageGenModelSelectorWrapper />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard desktopOnly dependentPluginIds={["thread:canvas"]}>
        <CanvasWrapper />
      </CsUiPluginsGuard>

      <CsUiPluginsGuard dependentPluginIds={["thread:betterMessageToolbars"]}>
        <BetterMessageToolbarsWrapper />
        <CsUiPluginsGuard
          additionalCheck={({ settings }) =>
            settings.plugins["thread:betterMessageToolbars"].collapsibleQuery
          }
        >
          <CollapsibleQueryWrapper />
        </CsUiPluginsGuard>
      </CsUiPluginsGuard>

      <CsUiPluginsGuard dependentPluginIds={["thread:betterCodeBlocks"]}>
        <BetterCodeBlocksWrapper />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard
        dependentPluginIds={["thread:betterMessageCopyButtons"]}
      >
        <BetterMessageCopyButtons />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard dependentPluginIds={["thread:toc"]}>
        <ThreadTocWrapper />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard dependentPluginIds={["thread:exportThread"]}>
        <ExportThreadWrapper />
      </CsUiPluginsGuard>
    </>
  );
}

function SidebarComponents() {
  return (
    <CsUiPluginsGuard
      desktopOnly
      requiresLoggedIn
      allowIncognito={false}
      dependentPluginIds={["spaceNavigator"]}
    >
      <SpaceNavigatorWrapper />
    </CsUiPluginsGuard>
  );
}

export { csUiRootCss };
