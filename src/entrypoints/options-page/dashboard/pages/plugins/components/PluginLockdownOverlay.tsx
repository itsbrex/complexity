import { LuConstruction } from "react-icons/lu";

export function PluginLockdownOverlay() {
  return (
    <div className="tw-absolute tw-inset-0 tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-4 tw-rounded-md tw-bg-secondary/90">
      <LuConstruction className="tw-size-8 tw-text-muted-foreground" />
      <div className="tw-text-muted-foreground">
        This plugin is not available at the moment
      </div>
    </div>
  );
}
