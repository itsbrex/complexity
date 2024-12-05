import { z } from "zod";

import { APP_CONFIG } from "@/app.config";
import {
  LanguageModel,
  LanguageModelSchema,
} from "@/data/plugins/query-box/language-model-selector/language-models.types";
import {
  CplxVersionsApiResponse,
  CplxVersionsApiResponseSchema,
} from "@/services/cplx-api/cplx-api.types";
import {
  CplxFeatureFlags,
  CplxFeatureFlagsSchema,
} from "@/services/cplx-api/feature-flags/cplx-feature-flags.types";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import { queryClient } from "@/utils/ts-query-client";
import { fetchResource, jsonUtils } from "@/utils/utils";

export class CplxApiService {
  static async fetchVersions(): Promise<CplxVersionsApiResponse> {
    return CplxVersionsApiResponseSchema.parse(
      JSON.parse(
        await fetchResource(`${APP_CONFIG.CPLX_API_URL}/versions.json`),
      ),
    );
  }

  static async fetchFeatureFlags(): Promise<CplxFeatureFlags> {
    const currentVersion = APP_CONFIG.VERSION;

    const versions =
      queryClient.getQueryData<CplxVersionsApiResponse>(
        cplxApiQueries.versions.queryKey,
      ) ?? (await queryClient.fetchQuery(cplxApiQueries.versions));

    const versionUrl = versions?.featureFlagsEntries.includes(currentVersion)
      ? currentVersion
      : "latest";

    return CplxFeatureFlagsSchema.parse(
      JSON.parse(
        await fetchResource(
          `${APP_CONFIG.CPLX_API_URL}/feature-flags/${versionUrl}.json`,
        ),
      ),
    );
  }

  static async fetchLanguageModels(): Promise<LanguageModel[]> {
    return z
      .array(LanguageModelSchema)
      .parse(
        jsonUtils.safeParse(
          await fetchResource(
            `${APP_CONFIG.CPLX_API_URL}/language-models.json`,
          ),
        ),
      );
  }

  static async fetchChangelog({ version }: { version?: string } = {}) {
    const targetVersion = version ?? APP_CONFIG.VERSION;

    const versions =
      queryClient.getQueryData<CplxVersionsApiResponse>(
        cplxApiQueries.versions.queryKey,
      ) ?? (await queryClient.fetchQuery(cplxApiQueries.versions));

    const versionUrl =
      version ??
      (versions?.changelogEntries.includes(targetVersion)
        ? targetVersion
        : versions?.latest);

    const resp = await fetch(
      `${APP_CONFIG.CPLX_API_URL}/changelogs/${versionUrl}.md`,
    );

    if (resp.status === 404) {
      return "Failed to fetch changelog for this version.";
    }

    return resp.text();
  }
}
