import { LuDownload, LuTrash2 } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { Theme } from "@/data/consts/plugins/themes/theme-registry.types";
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
    <Tooltip content={isChosenTheme ? "Uninstall" : "Install"}>
      <Button
        variant="outline"
        size="icon"
        className={cn({
          "tw-bg-destructive/10 tw-text-muted-foreground hover:tw-bg-destructive hover:tw-text-destructive-foreground":
            isChosenTheme,
        })}
        onClick={handleThemeAction}
      >
        {isChosenTheme ? <LuTrash2 /> : <LuDownload />}
      </Button>
    </Tooltip>
  );
}
