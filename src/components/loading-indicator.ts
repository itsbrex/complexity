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

  const $indicator = $("<div>")
    .attr("id", "cplx-initializing-indicator")
    .addClass("tw-fixed tw-right-4 tw-bottom-16 tw-hidden md:tw-block tw-m-2")
    .append(
      $("<div>")
        .addClass(
          "tw-rounded-full tw-border tw-border-border/50 tw-bg-secondary tw-p-2 tw-shadow-md tw-animate-in tw-fade-in tw-text-secondary-foreground tw-text-sm tw-flex tw-items-center tw-gap-2 tw-size-8 ",
        )
        .append(
          $(
            `<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="44.0001" y="64.7988" width="28" height="88" rx="6" transform="rotate(-45 44.0001 64.7988)" fill="currentColor"/>
<rect width="28" height="88" rx="6" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 212.024 64.7988)" fill="oklch(var(--primary))"/>
<rect x="106.225" y="129" width="28" height="88" rx="6" transform="rotate(45 106.225 129)" fill="oklch(var(--primary))"/>
<rect width="28" height="88" rx="6" transform="matrix(-0.707107 0.707107 0.707107 0.707107 149.823 129)" fill="currentColor"/>
</svg>`,
          ).addClass("tw-animate-pulse tw-duration-1000"),
        )
        .attr("title", "Complexity is initializing..."),
    );

  $indicator.appendTo(document.body);
}

export function removeInitializingIndicator() {
  setTimeout(() => {
    $("#cplx-initializing-indicator div")
      .removeClass("tw-animate-in tw-fade-in")
      .addClass("tw-animate-out tw-fade-out tw-duration-1000");

    setTimeout(() => {
      $("#cplx-initializing-indicator").remove();
    }, 200);
  }, 500);
}
