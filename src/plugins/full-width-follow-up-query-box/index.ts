import { spaRouteChangeCompleteSubscribe } from "@/plugins/_api/spa-router/listeners";
import styles from "@/plugins/full-width-follow-up-query-box/styles.css?inline";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { insertCss, whereAmI } from "@/utils/utils";

let removeCss: (() => void) | null = null;

function setupFullWidthFollowUp(location: ReturnType<typeof whereAmI>) {
  if (
    !PluginsStatesService.getCachedSync()?.pluginsEnableStates?.[
      "queryBox:fullWidthFollowUp"
    ]
  )
    return;

  if (location !== "thread") return removeCss?.();

  removeCss = insertCss({
    css: styles,
    id: "cplx-full-width-follow-up",
  });
}

csLoaderRegistry.register({
  id: "plugin:queryBox:fullWidthFollowUp",
  dependencies: ["cache:pluginsStates"],
  loader: () => {
    setupFullWidthFollowUp(whereAmI());

    spaRouteChangeCompleteSubscribe((url) => {
      setupFullWidthFollowUp(whereAmI(url));
    });
  },
});
