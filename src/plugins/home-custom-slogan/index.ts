import { homeDomObserverStore } from "@/plugins/_core/dom-observers/home/store";
import styles from "@/plugins/home-custom-slogan/styles.css?inline";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";
import { insertCss, whereAmI } from "@/utils/utils";

let removeCss: (() => void) | null = null;

function setupCustomSlogan({
  location,
  slogan,
}: {
  location: ReturnType<typeof whereAmI>;
  slogan: HTMLElement | null;
}) {
  if (!PluginsStatesService.getEnableStatesCachedSync()["home:customSlogan"])
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

  $slogan.attr(INTERNAL_ATTRIBUTES.HOME.SLOGAN, "true");

  $slogan.find("span").text(sloganText);
}

csLoaderRegistry.register({
  id: "plugin:home:customSlogan",
  dependencies: ["cache:pluginsStates", "cache:extensionLocalStorage"],
  loader: () => {
    homeDomObserverStore.subscribe(
      (store) => store.$slogan,
      ($slogan) => {
        if (!$slogan || !$slogan.length) return;
        setupCustomSlogan({ location: whereAmI(), slogan: $slogan[0] });
      },
    );
  },
});
