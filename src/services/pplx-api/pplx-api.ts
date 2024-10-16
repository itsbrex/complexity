import type { LanguageModel } from "@/data/consts/plugins/query-box/language-model-selector/language-models.types";
import InternalWebSocketManager from "@/features/plugins/_core/web-socket/InternalWebSocketManager";
import { ENDPOINTS } from "@/services/pplx-api/endpoints";
import {
  OrgSettingsApiResponseSchema,
  UserSettingsApiResponse,
  UserSettingsApiResponseSchema,
} from "@/services/pplx-api/pplx-api.types";
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
}

async function saveSettingViaFetch(settings: Record<string, unknown>) {
  const resp = await fetch(ENDPOINTS.SAVE_SETTINGS, {
    method: "PUT",
    body: JSON.stringify({
      updated_settings: settings,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return resp.ok;
}

async function saveSettingViaWebSocket(settings: Record<string, unknown>) {
  try {
    await InternalWebSocketManager.getInstance().sendMessage({
      data: `23${JSON.stringify(["save_user_settings", settings])}`,
    });
    return true;
  } catch (e) {
    alert("Failed to save setting");
    return false;
  }
}
