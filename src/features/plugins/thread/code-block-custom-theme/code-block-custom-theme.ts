import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
import { CodeBlock } from "@/utils/UiUtils.types";

export function codeBlockCustomTheme(codeBlocks: CodeBlock[]) {
  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  if (!pluginsEnableStates?.["thread:codeBlockCustomTheme"]) return;

  
}
