import type { LanguageModel } from "@/data/consts/plugins/query-box/language-model-selector/language-models.types";
import { ENDPOINTS } from "@/services/pplx-api/endpoints";
import {
  OrgSettingsApiResponseSchema,
  ThreadMessageApiResponse,
  UserSettingsApiResponse,
  UserSettingsApiResponseSchema,
} from "@/services/pplx-api/pplx-api.types";
import {
  saveSettingViaFetch,
  saveSettingViaWebSocket,
} from "@/services/pplx-api/utils";
import { ImageGenModel } from "@/types/plugins/image-gen-model-seletor.types";
import { fetchResource, jsonUtils } from "@/utils/utils";

export class PplxApiService {
  static async fetchAuthSession() {
    const resp = await fetchResource(ENDPOINTS.AUTH_SESSION);

    const data = jsonUtils.safeParse(resp);

    if (data == null) throw new Error("Failed to fetch auth session");

    return data;
  }

  static async fetchUserSettings(): Promise<UserSettingsApiResponse> {
    const resp = await fetch(ENDPOINTS.USER_SETTINGS);

    const respText = await resp.text();

    if (resp.status === 403 || respText.includes("Just a moment...")) {
      throw new Error("Cloudflare timeout");
    }

    const parsedJson = UserSettingsApiResponseSchema.parse(
      jsonUtils.safeParse(respText),
    );

    return parsedJson;
  }

  static async fetchOrgSettings() {
    const resp = await fetchResource(ENDPOINTS.ORG_SETTINGS);

    const data = OrgSettingsApiResponseSchema.parse(jsonUtils.safeParse(resp));

    return data;
  }

  private static async saveSetting(
    settings: Record<string, unknown>,
    method: "websocket" | "fetch" = "fetch",
  ) {
    if (method === "fetch") {
      return saveSettingViaFetch(settings);
    } else {
      return saveSettingViaWebSocket(settings);
    }
  }

  static async setDefaultLanguageModel(
    selectedLanguageModel: LanguageModel["code"],
    method: "websocket" | "fetch" = "fetch",
  ) {
    return this.saveSetting({ default_model: selectedLanguageModel }, method);
  }

  static async setDefaultImageGenModel(
    selectedImageGenModel: ImageGenModel["code"],
    method: "websocket" | "fetch" = "fetch",
  ) {
    return this.saveSetting(
      { default_image_generation_model: selectedImageGenModel },
      method,
    );
  }

  static async fetchThreadInfo(threadSlug: string) {
    if (!threadSlug) throw new Error("Thread slug is required");

    const url = `https://www.perplexity.ai/p/api/v1/thread/${threadSlug}?with_parent_info=true&source=web`;

    const resp = await fetchResource(url);

    const data = jsonUtils.safeParse(resp);

    if (data == null) throw new Error("Failed to fetch thread info");

    if (data.entries == null || data.entries?.length <= 0)
      throw new Error("Thread not found");

    return data.entries as ThreadMessageApiResponse[];
  }
}
