import { PluginTagValues } from "@/data/plugins-data/tags";
import { PluginId } from "@/services/extension-local-storage/plugins.types";

export type CoreObserverId = (typeof CORE_OBSERVERS)[number];

export type CorePluginId = (typeof CORE_PLUGINS)[number];

export const CORE_OBSERVERS = [
  "domObserver:home",
  "domObserver:queryBoxes",
  "domObserver:thread",
  "domObserver:sidebar",
  "domObserver:spacesPage",
  "domObserver:settingsPage",
] as const;

export const CORE_PLUGINS = [
  "networkIntercept",
  "spaRouter",
  "webSocket",
  "reactVdom",
  "mermaidRenderer",
  "markmapRenderer",
  ...CORE_OBSERVERS,
] as const;

export type CplxPluginMetadata = Record<
  PluginId,
  {
    id: PluginId;
    routeSegment: string;
    title: string;
    description: React.ReactNode;
    tags?: PluginTagValues[];
    dependentCorePlugins?: CorePluginId[];
    dependentPlugins?: PluginId[];
  }
>;
