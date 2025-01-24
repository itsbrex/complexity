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
  cn(
    "tw-overflow-y-auto tw-border-border tw-p-0 tw-font-medium tw-shadow-none",
    {
      "tw-rounded-b-none tw-border-2 tw-border-b-0": storeType === "main",
    },
  );

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
