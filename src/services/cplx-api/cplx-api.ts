import { z } from "zod";

import { APP_CONFIG } from "@/app.config";
import {
  LanguageModel,
  LanguageModelSchema,
} from "@/data/plugins/query-box/language-model-selector/language-models.types";
import {
  CplxVersions,
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
  static async fetchVersions(): Promise<CplxVersions> {
    const parsedData = CplxVersionsApiResponseSchema.parse(
      JSON.parse(
        await fetchResource(`${APP_CONFIG.CPLX_API_URL}/versions.json`),
      ),
    );

    const latest = (
      APP_CONFIG.BROWSER === "chrome" ? "latest" : "latestFirefox"
    ) satisfies keyof CplxVersionsApiResponse;

    return {
      latest: parsedData[latest],
      changelogEntries: parsedData.changelogEntries,
      featureFlagsEntries: parsedData.featureFlagsEntries,
    };
  }

  static async fetchFeatureFlags(): Promise<CplxFeatureFlags> {
    const currentVersion = APP_CONFIG.VERSION;

    const versions =
      queryClient.getQueryData<CplxVersions>(
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
    // return z.array(LanguageModelSchema).parse([
    //   {
    //     label: "Claude 3.5 Sonnet",
    //     shortLabel: "Sonnet",
    //     code: "claude2",
    //     provider: "Anthropic",
    //   },
    //   {
    //     label: "Claude 3.5 Haiku",
    //     shortLabel: "Haiku",
    //     code: "claude35haiku",
    //     provider: "Anthropic",
    //   },
    //   {
    //     label: "GPT-o1",
    //     shortLabel: "GPT-o1",
    //     code: "o1",
    //     provider: "OpenAI",
    //     unknownLimit: true,
    //   },
    //   {
    //     label: "GPT-4 Omni",
    //     shortLabel: "GPT-4o",
    //     code: "gpt4o",
    //     provider: "OpenAI",
    //   },
    //   {
    //     label: "Grok-2",
    //     shortLabel: "Grok-2",
    //     code: "grok",
    //     provider: "xAI",
    //   },
    //   {
    //     label: "Sonar Huge",
    //     shortLabel: "Sonar XL",
    //     code: "llama_x_large",
    //     provider: "Perplexity",
    //   },
    //   {
    //     label: "Sonar Large",
    //     shortLabel: "Sonar",
    //     code: "experimental",
    //     provider: "Perplexity",
    //   },
    //   {
    //     label: "Default",
    //     shortLabel: "Default",
    //     code: "turbo",
    //     provider: "Perplexity",
    //   },
    // ]);

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
      queryClient.getQueryData<CplxVersions>(
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
