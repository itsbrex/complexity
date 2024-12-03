import { PplxApiService } from "@/services/pplx-api/pplx-api";

const isCloudflareVerificationPage = () => $(document.body).hasClass("no-js");

export async function contentScriptGuard() {
  await checkForMaintenance();
  ignoreInvalidPages();
  checkForExistingExtensionInstance();
}

async function checkForMaintenance() {
  if ((await PplxApiService.fetchMaintenanceStatus()) != "null")
    throw new Error("Perplexity maintenance state detected, will not inject");
}

function ignoreInvalidPages() {
  if (isCloudflareVerificationPage())
    throw new Error("Cloudflare verification page");
}

function checkForExistingExtensionInstance() {
  if ($(document.body).attr("data-cplx-injected")) {
    console.warn(
      "Complexity: Please only have one instance of the extension enabled",
    );
    throw new Error("Already injected");
  }

  $(document.body).attr("data-cplx-injected", "true");
}
