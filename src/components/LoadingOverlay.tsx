import { LuLoader2 } from "react-icons/lu";

export default function LoadingOverlay() {
  return (
    <div className="tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-center tw-justify-center tw-bg-background/80">
      <LuLoader2 className="tw-size-8 tw-animate-spin tw-text-primary" />
    </div>
  );
}
