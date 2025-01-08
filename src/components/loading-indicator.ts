// eslint-disable-next-line boundaries/element-types
import { csUiRootCss } from "@/entrypoints/content-scripts/loaders/cs-ui-plugins-loader/CsUiRoot";
import { getCookie } from "@/utils/utils";

export async function showInitializingIndicator() {
  const rawColorScheme = getCookie("colorScheme");
  const colorScheme =
    rawColorScheme === "light" || rawColorScheme === "dark"
      ? rawColorScheme
      : null;

  if (colorScheme === null) {
    const preferredColorScheme = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches
      ? "dark"
      : "light";

    $("html").attr("data-color-scheme", preferredColorScheme);
  } else {
    $("html").attr("data-color-scheme", colorScheme);
  }

  const $tempStyle = $("<style>")
    .attr("id", "cplx-initializing-indicator-style")
    .text(csUiRootCss);

  const $indicator = $("<div>")
    .attr("id", "cplx-initializing-indicator")
    .addClass("tw-fixed tw-left-1/2 tw-top-8 -tw-translate-x-1/2")
    .append(
      $("<div>")
        .addClass(
          "tw-rounded-md tw-border tw-border-border/50 tw-bg-secondary tw-p-2 tw-shadow-md tw-animate-in tw-fade-in tw-text-muted-foreground tw-text-sm tw-px-4 tw-flex tw-items-center tw-gap-2",
        )
        .append(
          $(
            `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`,
          ).addClass("tw-animate-spin"),
        )
        .append("Initializing..."),
    );

  $tempStyle.appendTo(document.head);
  $indicator.appendTo(document.body);
}

export function removeInitializingIndicator() {
  setTimeout(() => {
    $("#cplx-initializing-indicator div")
      .removeClass("tw-animate-in tw-fade-in")
      .addClass("tw-animate-out tw-fade-out tw-duration-1000");

    $("#cplx-initializing-indicator-style").remove();

    setTimeout(() => {
      $("#cplx-initializing-indicator").remove();
    }, 200);
  }, 500);
}
