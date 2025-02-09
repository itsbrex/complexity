import { z } from "zod";

import { PluginId } from "@/services/extension-local-storage/plugins.types";

export const userGroups = ["anon", "logged-in", "supporter"] as const;

export type UserGroup = (typeof userGroups)[number];

export function isUserGroup(value: string): value is UserGroup {
  return userGroups.includes(value as UserGroup);
}

const PluginIdArraySchema = z.array(
  z.string() as z.ZodType<PluginId | (string & {})>,
);

export const CplxFeatureFlagsSchema = z.record(
  z.enum(userGroups),
  z.object({
    forceDisable: PluginIdArraySchema,
    hide: PluginIdArraySchema,
  }),
);

export type CplxFeatureFlags = z.infer<typeof CplxFeatureFlagsSchema>;
