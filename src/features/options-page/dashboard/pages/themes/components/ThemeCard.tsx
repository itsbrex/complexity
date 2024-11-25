import { LuDownload, LuBadgeCheck, LuTrash2 } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { Theme } from "@/data/consts/plugins/themes/theme-registry.types";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

type ThemeCardProps = {
  theme?: Theme;
};

export default function ThemeCard({ theme }: ThemeCardProps) {
  const { settings, mutation } = useExtensionLocalStorage();

  const chosenThemeId = settings?.theme;

  if (!theme) return null;

  const isChosenTheme = chosenThemeId === theme.id;

  return (
    <div
      className={cn(
        "tw-group tw-relative tw-overflow-hidden tw-rounded-xl tw-border tw-border-border/50 tw-transition-all",
        { "tw-border-primary tw-bg-primary/10": isChosenTheme },
      )}
    >
      <div className="tw-relative tw-aspect-[16/9] tw-overflow-hidden">
        <img
          src={theme.featuredImage}
          alt={theme.label}
          className="tw-h-full tw-w-full tw-object-cover tw-transition-transform tw-duration-500 group-hover:tw-scale-110"
        />
        {theme.isOfficial && (
          <div className="tw-absolute tw-right-4 tw-top-4 tw-flex tw-items-center tw-gap-1 tw-rounded-full tw-bg-primary/10 tw-px-2 tw-py-1 tw-text-xs tw-text-muted-foreground tw-backdrop-blur-sm">
            <LuBadgeCheck className="tw-size-4 tw-text-primary" />
            <span>Official</span>
          </div>
        )}
      </div>

      <div className="tw-flex tw-flex-col tw-items-start tw-justify-between tw-gap-4 tw-p-4">
        <div>
          <h3 className="tw-mb-1 tw-text-lg tw-font-semibold">{theme.label}</h3>
          <p className="tw-text-sm tw-text-muted-foreground">
            {theme.description}
          </p>
        </div>
        <Tooltip
          content={isChosenTheme ? "Uninstall" : "Install"}
          className="tw-ml-auto tw-w-max"
        >
          {isChosenTheme ? (
            <Button
              variant="outline"
              size="icon"
              className="tw-bg-destructive/10 tw-text-muted-foreground hover:tw-bg-destructive hover:tw-text-destructive-foreground"
              onClick={() => {
                mutation.mutate((draft) => {
                  draft.theme = "";
                });
              }}
            >
              <LuTrash2 />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                mutation.mutate((draft) => {
                  draft.theme = theme.id;
                });
              }}
            >
              <LuDownload />
            </Button>
          )}
        </Tooltip>
      </div>
    </div>
  );
}
