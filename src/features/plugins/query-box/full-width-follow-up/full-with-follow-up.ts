import { spaRouteChangeCompleteSubscribe } from "@/features/plugins/_core/spa-router/listeners";
import styles from "@/features/plugins/query-box/full-width-follow-up/full-width-follow-up.css?inline";
import { csLoaderRegistry } from "@/services/cs-loader-registry";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
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
