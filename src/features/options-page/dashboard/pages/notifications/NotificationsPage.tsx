import { LuBellOff } from "react-icons/lu";

export default function NotificationsPage() {
  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-4 tw-p-4">
      <div className="tw-flex tw-flex-col tw-items-center tw-gap-2 tw-text-center">
        <LuBellOff className="tw-size-12 tw-text-muted-foreground" />
        <h1 className="tw-text-2xl tw-font-semibold">No notifications yet</h1>
        <p className="tw-text-muted-foreground">
          You&apos;ll see your notifications here when they arrive
        </p>
      </div>
    </div>
  );
}
