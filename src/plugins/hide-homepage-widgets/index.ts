import { spaRouteChangeCompleteSubscribe } from "@/plugins/_api/spa-router/listeners";
import styles from "@/plugins/hide-homepage-widgets/styles.css?inline";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { insertCss, whereAmI } from "@/utils/utils";

let cleanup: () => void | null;

csLoaderRegistry.register({
  id: "plugin:home:hideHomepageWidgets",
  loader: () => {
    const pluginsEnableStates =
      PluginsStatesService.getEnableStatesCachedSync();

    if (!pluginsEnableStates["home:hideHomepageWidgets"]) return;

    hideHomepageWidgets(whereAmI());

    spaRouteChangeCompleteSubscribe((url) => {
      hideHomepageWidgets(whereAmI(url));
    });
  },
  dependencies: ["cache:pluginsStates", "cache:extensionLocalStorage"],
});

function hideHomepageWidgets(location: ReturnType<typeof whereAmI>) {
  cleanup?.();

  if (location !== "home") return;

  const removeCss = insertCss({
    css: styles,
    id: "always-hide-homepage-widgets",
  });

  cleanup = () => removeCss();
}
