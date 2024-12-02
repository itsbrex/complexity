import { LuPencil } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { Theme } from "@/data/plugins/themes/theme-registry.types";

type ThemeCardEditButtonProps = {
  theme: Theme;
};

export default function ThemeCardEditButton({
  theme,
}: ThemeCardEditButtonProps) {
  const navigate = useNavigate();
  return (
    <Tooltip
      content={t("dashboard-themes-page:themesPage.themeCard.actions.edit")}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate(`${theme.id}/edit`)}
      >
        <LuPencil />
      </Button>
    </Tooltip>
  );
}
