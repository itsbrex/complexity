import Tooltip from "@/components/Tooltip";
import { Switch } from "@/components/ui/switch";
import { Theme } from "@/data/plugins/themes/theme-registry.types";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

type ThemeActionButtonProps = {
  theme: Theme;
};

export default function ThemeCardActionButton({
  theme,
}: ThemeActionButtonProps) {
  const { settings, mutation } = useExtensionLocalStorage();

  const isChosenTheme = settings?.theme === theme?.id;

  const handleThemeAction = useCallback(() => {
    mutation.mutate((draft) => {
      draft.theme = isChosenTheme ? "" : theme.id;
    });
  }, [mutation, isChosenTheme, theme]);

  return (
    <Tooltip content={isChosenTheme ? "Disable" : "Enable"}>
      <Switch checked={isChosenTheme} onCheckedChange={handleThemeAction} />
    </Tooltip>
  );
}
