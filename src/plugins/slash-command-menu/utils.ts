import { QueryBoxType } from "@/data/plugins/query-box/types";

type PopoverPositionConfig = {
  placement: "top-start" | "bottom-start";
  gutter: number;
  flip: boolean;
};

export const getPopoverPositionConfig = (
  storeType: QueryBoxType,
): PopoverPositionConfig => {
  const isSpaceQueryBox = storeType === "space";
  return {
    placement: isSpaceQueryBox ? "bottom-start" : "top-start",
    gutter: storeType === "main" ? 1 : 5,
    flip: isSpaceQueryBox,
  };
};

export const getPopoverContentClasses = (storeType: QueryBoxType) =>
  cn("x-overflow-y-auto x-border-border x-p-0 x-font-medium x-shadow-none", {
    "x-rounded-b-none x-border-2 x-border-b-0": storeType === "main",
  });

export const handleCommandInputKeyDown =
  (commandRef: React.RefObject<HTMLDivElement | null>) =>
  (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === Key.Enter) return;

    const commandItems = commandRef.current?.querySelectorAll("[cmdk-item]");
    commandItems?.forEach((item) => {
      if (item.getAttribute("aria-selected") === "true") {
        item.dispatchEvent(new KeyboardEvent("keydown", e as any));
      }
    });
  };
