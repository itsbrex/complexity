import { LuCheckCircle2, LuXCircle } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
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
    <Tooltip
      content={
        isChosenTheme
          ? t("dashboard-themes-page:themesPage.themeCard.actions.disable")
          : t("dashboard-themes-page:themesPage.themeCard.actions.enable")
      }
    >
      <Button
        variant="outline"
        size="icon"
        className={cn({
          "tw-bg-destructive/50 tw-text-muted-foreground hover:tw-bg-destructive hover:tw-text-destructive-foreground":
            isChosenTheme,
        })}
        onClick={handleThemeAction}
      >
        {isChosenTheme ? <LuXCircle /> : <LuCheckCircle2 />}
      </Button>
    </Tooltip>
  );
}
