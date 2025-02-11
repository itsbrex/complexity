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
  FeatureCompatibility,
} from "@/services/cplx-api/cplx-api.types";
import {
  CplxFeatureFlags,
  CplxFeatureFlagsSchema,
} from "@/services/cplx-api/cplx-feature-flags.types";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import { getTParam } from "@/services/cplx-api/utils";
import { ExtensionVersion } from "@/utils/ext-version";
import { queryClient } from "@/utils/ts-query-client";
import { fetchResource, jsonUtils } from "@/utils/utils";

export class CplxApiService {
  static async fetchVersions(): Promise<CplxVersions> {
    const parsedData = CplxVersionsApiResponseSchema.parse(
      JSON.parse(
        await fetchResource(
          `${APP_CONFIG.CPLX_CDN_URL}/versions.json?t=${getTParam()}`,
        ),
      ),
    );

    const latest = (
      APP_CONFIG.BROWSER === "chrome" ? "latest" : "latestFirefox"
    ) satisfies keyof CplxVersionsApiResponse;

    return {
      latest: parsedData[latest],
      changelogEntries: parsedData.changelogEntries,
      featureFlagsEntries: parsedData.featureFlagsEntries,
      canvasInstructionLastUpdated: parsedData.canvasInstructionLastUpdated,
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
      : getClosestVersion();

    return CplxFeatureFlagsSchema.parse(
      JSON.parse(
        await fetchResource(
          `${APP_CONFIG.CPLX_CDN_URL}/feature-flags/${versionUrl}.json?t=${getTParam()}`,
        ),
      ),
    );

    function getClosestVersion() {
      if (
        versions?.featureFlagsEntries == null ||
        versions?.featureFlagsEntries.length < 1
      )
        return "latest";

      if (!versions.featureFlagsEntries.includes(currentVersion)) {
        const lastEntry =
          versions.featureFlagsEntries[
            versions.featureFlagsEntries.length - 1
          ]!;

        if (new ExtensionVersion(lastEntry).isNewerThan(currentVersion))
          return lastEntry;
      }

      if (
        new ExtensionVersion(currentVersion).isNewerThan(
          versions.featureFlagsEntries[0]!,
        )
      )
        return "latest";

      const closestVersion = versions.featureFlagsEntries.find((entry) =>
        new ExtensionVersion(entry).isOlderThanOrEqualTo(currentVersion),
      );

      return closestVersion ?? "latest";
    }
  }

  static async fetchFeatureCompat(): Promise<FeatureCompatibility> {
    return JSON.parse(
      await fetchResource(
        `${APP_CONFIG.CPLX_CDN_URL}/feature-compat.json?t=${getTParam()}`,
      ),
    );
  }

  static async fetchLanguageModels(): Promise<LanguageModel[]> {
    return z
      .array(LanguageModelSchema)
      .parse(
        jsonUtils.safeParse(
          await fetchResource(
            `${APP_CONFIG.CPLX_CDN_URL}/language-models.json?t=${getTParam()}`,
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
      `${APP_CONFIG.CPLX_CDN_URL}/changelogs/${versionUrl}.md?t=${getTParam()}`,
    );

    if (resp.status === 404) {
      throw new Error(`Failed to fetch changelog for version ${versionUrl}.`);
    }

    return resp.text();
  }
}
