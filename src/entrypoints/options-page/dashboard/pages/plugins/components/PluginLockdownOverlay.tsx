import { LuConstruction } from "react-icons/lu";

export function PluginLockdownOverlay() {
  return (
    <div className="x-absolute x-inset-0 x-flex x-flex-col x-items-center x-justify-center x-gap-4 x-rounded-md x-bg-secondary/90">
      <LuConstruction className="x-size-8 x-text-muted-foreground" />
      <div className="x-text-muted-foreground">
        This plugin is not available at the moment
      </div>
    </div>
  );
}
