import { Key } from "ts-key-enum";

import { APP_CONFIG } from "@/app.config";
import { UiUtils } from "@/utils/ui-utils";

export const jsonUtils = {
  safeParse(json: string) {
    try {
      return JSON.parse(json);
    } catch (error) {
      return null;
    }
  },
  unescape(jsonString: string): string {
    return jsonString
      .replace(/\\"/g, '"') // Double quote
      .replace(/\\\\/g, "\\"); // Backslash
  },
};

export function isValidVersionString(version: string) {
  return /^\d+(\.\d+){1,}$/.test(version);
}

export async function waitForHydration() {
  await Promise.all([
    waitForElement({
      selector: "html[data-color-scheme]",
      timeout: 5000,
      interval: 100,
    }),
    waitForNextjsGlobalObj(),
  ]);
}

export async function waitForNextjsGlobalObj(): Promise<void> {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if ($(document.body).attr("data-nextjs-router-ready") !== undefined) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}

export function escapeHtmlTags(html: string) {
  return html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function stripHtml(html: string | undefined) {
  if (!html) {
    return "";
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

export function detectConsecutiveClicks(params: {
  element: Element;
  requiredClicks: number;
  clickInterval: number;
  callback: () => void;
}): void {
  let clickCount = 0;
  let clickTimer: number | undefined;

  $(params.element)
    .off("click")
    .on("click", () => {
      clickCount++;

      if (clickCount === 1) {
        clickTimer = window.setTimeout(() => {
          clickCount = 0;
        }, params.clickInterval);
      }

      if (clickCount === params.requiredClicks) {
        if (clickTimer !== undefined) {
          clearTimeout(clickTimer);
        }
        clickCount = 0;
        params.callback();
      }
    });
}

export function scrollToElement(
  $anchor: JQuery<Element>,
  offset = 0,
  duration = 500,
) {
  const $stickyHeader = UiUtils.getStickyNavbar();

  if ($stickyHeader.length) {
    offset -= $stickyHeader.height() ?? 0;
  }

  const elementPosition = $anchor.offset()?.top ?? 0;
  const scrollPosition = (elementPosition || 0) + offset;

  $("html, body").animate(
    {
      scrollTop: scrollPosition,
    },
    duration,
  );
}
export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchResource(url: string) {
  const response = await fetch(url);
  return response.text();
}

export function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const trimmedCookie = cookie.trim();
    if (trimmedCookie.startsWith(nameEQ)) {
      return trimmedCookie.substring(nameEQ.length);
    }
  }

  return null;
}

export function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

type ParsedUrl = {
  hostname: string;
  pathname: string;
  search: string;
  hash: string;
  queryParams: URLSearchParams;
};

export function parseUrl(url: string = window.location.href): ParsedUrl {
  const parsedUrl: ParsedUrl = {
    hostname: "",
    pathname: "",
    search: "",
    hash: "",
    queryParams: new URLSearchParams(),
  };

  try {
    const normalizedUrl = url.startsWith("http")
      ? url
      : `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
    const urlObject = new URL(normalizedUrl);

    parsedUrl.hostname = urlObject.hostname;
    parsedUrl.pathname = urlObject.pathname;
    parsedUrl.search = urlObject.search;
    parsedUrl.hash = urlObject.hash.slice(1);

    parsedUrl.queryParams = new URLSearchParams(urlObject.search);
  } catch (error) {
    console.error("Invalid URL:", url);
  }

  return parsedUrl;
}

export function whereAmI(providedUrl?: string) {
  if (!providedUrl && typeof window === "undefined") {
    return "unknown";
  }

  const url = parseUrl(providedUrl || window.location.href);

  const hostname = url.hostname;
  const pathname = url.pathname;

  if (hostname === "www.perplexity.ai") {
    switch (true) {
      case pathname.startsWith("/discover"):
        return "discover";
      case pathname === "/spaces":
        return "collections_page";
      case pathname.startsWith("/spaces/"):
      case pathname.startsWith("/collections/"):
        return "collection";
      case pathname.startsWith("/library"):
        return "library";
      case pathname.startsWith("/search"):
        return "thread";
      case pathname.startsWith("/page"):
        return "page";
      case pathname.startsWith("/settings/account"):
        return "settings";
      case pathname === "/":
        return "home";
      case hostname.includes("perplexity.ai"):
        return "same_origin";
      default:
        return "unknown";
    }
  }

  return "unknown";
}

export function waitForElement({
  selector,
  timeout = 5000,
  interval = 100,
}: {
  selector: string | (() => HTMLElement | Element);
  timeout?: number;
  interval?: number;
}): Promise<HTMLElement | Element | null> {
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      const element =
        typeof selector === "string" ? $(selector)[0] : selector();

      if (element != null) {
        clearInterval(intervalId);
        resolve(element);
      }
    }, interval);

    setTimeout(() => {
      clearInterval(intervalId);
      resolve(null);
    }, timeout);
  });
}

export function isDomNode(element: any): element is HTMLElement | Element {
  return element instanceof HTMLElement || element instanceof Element;
}

export const isMainWorldContext = () => {
  return (
    typeof chrome === "undefined" ||
    typeof chrome.storage === "undefined" ||
    typeof chrome.storage.local === "undefined"
  );
};

export const isExtensionContext = () => {
  return !isMainWorldContext();
};

export const isInContentScript = () => {
  return whereAmI() !== "unknown";
};

export async function injectMainWorldScript({
  url,
  head = true,
  inject = true,
}: {
  url: string;
  head?: boolean;
  inject?: boolean;
}) {
  if (!inject) return;

  await waitForDocumentReady();

  return new Promise((resolve, reject) => {
    $("<script>")
      .attr({
        type: "module",
        src: url,
        onload: () => resolve(null),
        onerror: () => reject(new Error(`Failed to load script: ${url}`)),
      })
      .appendTo(head ? document.head : document.body);
  });
}

export function injectMainWorldScriptBlock({
  scriptContent,
  waitForExecution = false,
}: {
  scriptContent: string;
  waitForExecution?: boolean;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "module";

    const executionId = `__script_execution_${Date.now()}`;
    let executionCompleted = false;

    const markExecutionComplete = () => {
      executionCompleted = true;
      delete (window as unknown as Record<string, () => void>)[executionId];
      if (waitForExecution) {
        resolve();
      }
    };

    (window as unknown as Record<string, () => void>)[executionId] =
      markExecutionComplete;

    script.textContent = `
      ${scriptContent}
      (window['${executionId}'])?.();
    `;

    script.onload = () => {
      if (!waitForExecution || executionCompleted) {
        resolve();
      }
    };

    script.onerror = (event) =>
      reject(
        new Error(`Failed to load script: ${(event as ErrorEvent).message}`),
      );

    document.body.appendChild(script);
  });
}

export function waitForDocumentReady() {
  return new Promise((resolve) => {
    if (
      document.readyState === "complete" &&
      document.head != null &&
      document.body != null
    ) {
      resolve(null);
    } else {
      $(resolve);
    }
  });
}

export function insertCss({
  css,
  id,
}: {
  css: string;
  id: string;
}): () => void {
  if (!id.startsWith("cplx-")) id = `cplx-${id}`;

  const styleSelector = `style#${id}`;
  const removeStyle = () => $(styleSelector).remove();

  if ($(styleSelector).length) {
    return removeStyle;
  }

  if (css.startsWith("chrome-extension://")) {
    $("<link>")
      .attr({
        rel: "stylesheet",
        href: css,
        id,
      })
      .appendTo("head");
  } else {
    $("<style>").text(css).attr("id", id).appendTo("head");
  }

  return removeStyle;
}

export function getReactPropsKey(element: Element) {
  return (
    Object.keys(element).find((key) => key.startsWith("__reactProps$")) || ""
  );
}

export function getReactFiberKey(element: Element) {
  return (
    Object.keys(element).find((key) => key.startsWith("__reactFiber$")) || ""
  );
}

export function onScrollDirectionChange({
  up,
  down,
  identifier,
}: {
  up?: () => void;
  down?: () => void;
  identifier: string;
}) {
  let lastScrollTop = 0;

  $(window).on(`scroll.${identifier}`, function () {
    const currentScrollTop = $(this).scrollTop();

    if (typeof currentScrollTop === "undefined") return;

    if (currentScrollTop > lastScrollTop) {
      down?.();
    } else {
      up?.();
    }

    lastScrollTop = currentScrollTop;
  });

  return () => $(window).off(`scroll.${identifier}`);
}

export function queueMicrotasks(...tasks: (() => void)[]) {
  tasks.forEach((task) => queueMicrotask(task));
}

export function requestIdleCallbacks(...tasks: (() => void)[]) {
  tasks.forEach((task) =>
    requestIdleCallback(task, {
      timeout: 1000,
    }),
  );
}

export function invariant(condition: any, message?: string) {
  if (condition == true) return;

  throw new Error(message);
}

/**
 * Converts an emoji code to its corresponding emoji character.
 *
 * @param {string} emojiCode - The emoji code to convert. Intended format: `2049-fe0f`.
 * @returns {string} The corresponding emoji character.
 */
export function emojiCodeToString(emojiCode: string): string {
  try {
    const parts = emojiCode.split("-");

    const codePoints = parts.map((part) => {
      const codePoint = parseInt(part, 16);
      if (isNaN(codePoint)) {
        throw new Error(`Invalid emoji code part: ${part}`);
      }
      return codePoint;
    });

    return String.fromCodePoint(...codePoints);
  } catch (error) {
    return "";
  }
}

export function untrapWheel(e: React.WheelEvent<HTMLDivElement>) {
  e.stopPropagation();
}

export function getOptionsPageUrl() {
  const prefix = APP_CONFIG.IS_DEV ? "src/entrypoints/" : "";

  return chrome.runtime.getURL(`${prefix}options.html`);
}

export function getTaskScheduler() {
  return document.visibilityState === "visible"
    ? requestAnimationFrame
    : queueMicrotask;
}

export function keysToString(keys: (Key | string)[]) {
  return keys.map((key) => key.toLowerCase()).join("+");
}
