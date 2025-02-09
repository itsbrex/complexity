import { LuConstruction } from "react-icons/lu";

export function PluginLockDownOverlay({
  text,
  subText,
}: {
  text?: string;
  subText?: string;
}) {
  return (
    <div className="x-absolute x-inset-0 x-flex x-flex-col x-items-center x-justify-center x-gap-4 x-rounded-md x-bg-secondary/90">
      <LuConstruction className="x-size-8 x-text-muted-foreground" />
      <div className="x-mx-4 x-text-pretty x-text-center x-text-muted-foreground">
        <div>{text ?? "This plugin is not available at the moment"}</div>
        <div>{subText ?? "Please check back later"}</div>
      </div>
    </div>
  );
}
