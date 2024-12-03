import { LuLoader2 } from "react-icons/lu";

export function LoadingState() {
  return (
    <div className="tw-flex tw-animate-pulse tw-items-center tw-justify-center tw-gap-2 tw-p-4 tw-text-sm tw-text-muted-foreground">
      <LuLoader2 className="tw-size-4 tw-animate-spin" />
      <span>{t("plugin-command-menu:commandMenu.threadSearch.loading")}</span>
    </div>
  );
}
