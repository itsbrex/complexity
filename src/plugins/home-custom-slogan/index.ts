import { globalDomObserverStore } from "@/plugins/_api/dom-observer/global-dom-observer-store";
import { OBSERVER_ID } from "@/plugins/_core/dom-observers/home/observer-ids";
import styles from "@/plugins/home-custom-slogan/styles.css?inline";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { insertCss, whereAmI } from "@/utils/utils";

let removeCss: (() => void) | null = null;

function setupCustomSlogan({
  location,
  slogan,
}: {
  location: ReturnType<typeof whereAmI>;
  slogan: HTMLElement | null;
}) {
  if (
    !PluginsStatesService.getCachedSync()?.pluginsEnableStates?.[
      "home:customSlogan"
    ]
  )
    return;

  const sloganText =
    ExtensionLocalStorageService.getCachedSync().plugins["home:customSlogan"]
      .slogan;

  if (sloganText.length <= 0) return;

  if (location !== "home" || slogan == null) return removeCss?.();

  removeCss = insertCss({
    css: styles,
    id: "custom-slogan",
  });

  const $slogan = $(slogan);

  if (!$slogan.length) return;

  $slogan.attr(OBSERVER_ID.SLOGAN, "true");

  $slogan.find("span").text(sloganText);
}

csLoaderRegistry.register({
  id: "plugin:home:customSlogan",
  loader: () => {
    globalDomObserverStore.subscribe(
      (state) => state.homeComponents.slogan,
      (slogan) => {
        setupCustomSlogan({ location: whereAmI(), slogan });
      },
    );
  },
  dependencies: ["cache:pluginsStates"],
});
