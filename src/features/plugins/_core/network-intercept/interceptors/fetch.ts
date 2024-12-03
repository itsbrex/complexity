import { sendMessage } from "webext-bridge/window";

export function initFetchInterceptor() {
  const originalFetch = window.fetch;

  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
    if (init?.body == null || typeof init.body !== "string") {
      return originalFetch.call(window, input, init);
    }

    const resp = await sendMessage(
      "network-intercept:fetchEvent",
      {
        event: "request",
        payload: {
          url: constructUrl(input),
          data: init.body,
        },
      },
      "content-script",
    );

    if (resp?.data) {
      init.body = resp.data;
    }

    const response = await originalFetch.call(window, input, init);
    const clonedResponse = response.clone();
    const body = await clonedResponse.text();

    await sendMessage(
      "network-intercept:fetchEvent",
      {
        event: "response",
        payload: {
          url: constructUrl(input),
          status: response.status,
          data: body,
        },
      },
      "content-script",
    );

    return response;
  };
}

function constructUrl(url: unknown) {
  if (url instanceof URL) return url.href;

  if (typeof url === "string") return url;

  return "";
}
