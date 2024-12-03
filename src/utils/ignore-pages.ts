const isCloudflareVerificationPage = () => $(document.body).hasClass("no-js");

export function ignoreInvalidPages() {
  if (isCloudflareVerificationPage())
    throw new Error("Cloudflare verification page");
}

export function checkForExistingExtensionInstance() {
  if ($(document.body).attr("data-cplx-injected")) {
    console.warn(
      "Complexity: Please only have one instance of the extension enabled",
    );
    throw new Error("Already injected");
  }

  $(document.body).attr("data-cplx-injected", "true");
}
