import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SpaceNavigatorContent from "@/features/plugins/query-box/space-navigator/SpaceNavigatorContent";

type SpaceNavigatorMobileContentWrapperProps = {
  children: React.ReactNode;
};

export default function SpaceNavigatorMobileContentWrapper({
  children,
}: SpaceNavigatorMobileContentWrapperProps) {
  return (
    <Sheet lazyMount>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="tw-p-0">
        <SpaceNavigatorContent />
      </SheetContent>
    </Sheet>
  );
}
