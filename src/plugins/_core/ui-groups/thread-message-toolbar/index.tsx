import CsUiPluginsGuard from "@/components/plugins-guard/CsUiPluginsGuard";
import { Portal } from "@/components/ui/portal";
import { useInsertCss } from "@/hooks/useInsertCss";
import { useObserver } from "@/plugins/_core/ui-groups/thread-message-toolbar/useObserver";
import BetterMessageCopyButton from "@/plugins/thread-better-message-copy-buttons";
import hideNativeButtonsCss from "@/plugins/thread-better-message-copy-buttons/hide-native-buttons.css?inline";
import EditQueryButton from "@/plugins/thread-better-message-toolbars/edit-query-button";
import { PluginsStatesService } from "@/services/plugins-states";

export default function ThreadMessageToolbarExtraButtonsWrapper() {
  const portalContainers = useObserver();
  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  useInsertCss({
    id: "cplx-thread-message-toolbar-extra-buttons",
    css: hideNativeButtonsCss,
    inject: pluginsEnableStates?.["thread:betterMessageCopyButtons"],
  });

  return portalContainers.map((portalContainer, index) => (
    <Portal key={index} container={portalContainer as HTMLElement}>
      <MemoizedWrapper messageBlockIndex={index} />
    </Portal>
  ));
}

const MemoizedWrapper = memo(function MemoizedWrapper({
  messageBlockIndex,
}: {
  messageBlockIndex: number;
}) {
  return (
    <div className="x-flex x-items-center x-gap-1">
      <CsUiPluginsGuard
        dependentPluginIds={["thread:betterMessageToolbars"]}
        additionalCheck={({ settings }) =>
          settings.plugins["thread:betterMessageToolbars"].editQueryButton
        }
      >
        <EditQueryButton messageBlockIndex={messageBlockIndex} />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard
        dependentPluginIds={["thread:betterMessageCopyButtons"]}
      >
        <BetterMessageCopyButton messageBlockIndex={messageBlockIndex} />
      </CsUiPluginsGuard>
    </div>
  );
});
