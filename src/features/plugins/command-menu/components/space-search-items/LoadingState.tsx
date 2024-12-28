import { LuLoaderCircle } from "react-icons/lu";

export function LoadingState() {
  return (
    <div className="tw-flex tw-animate-pulse tw-items-center tw-justify-center tw-gap-2 tw-p-4 tw-text-sm tw-text-muted-foreground">
      <LuLoaderCircle className="tw-size-4 tw-animate-spin" />
      <span>{t("plugin-command-menu:commandMenu.spaceSearch.loading")}</span>
    </div>
  );
}
