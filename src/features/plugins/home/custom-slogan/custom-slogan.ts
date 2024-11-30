import { OBSERVER_ID } from "@/features/plugins/_core/dom-observer/observers/home/observer-ids";
import styles from "@/features/plugins/home/custom-slogan/custom-slogan.css?inline";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
import { insertCss, whereAmI } from "@/utils/utils";

let removeCss: (() => void) | null = null;

export function setupCustomSlogan({
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
    id: "cplx-custom-slogan",
  });

  const $slogan = $(slogan);

  if (!$slogan.length) return;

  $slogan.attr(OBSERVER_ID.SLOGAN, "true");

  $slogan.find("span").text(sloganText);
}
