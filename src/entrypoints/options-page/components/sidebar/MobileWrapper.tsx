import { useState, useEffect } from "react";
import { LuPanelLeft } from "react-icons/lu";
import { useLocation } from "react-router-dom";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navItems } from "@/entrypoints/options-page/components/sidebar/nav-items";
import MyBreadcrumb from "@/entrypoints/options-page/dashboard/pages/plugins/components/MyBreadcrumb";

export default function MobileSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <MobileSidebarContext value={{ isOpen, setIsOpen }}>
      <Sheet
        defaultOpen
        open={isOpen}
        onOpenChange={({ open }) => setIsOpen(open)}
      >
        <div className="tw-fixed tw-left-0 tw-top-0 tw-z-10 tw-flex tw-size-max tw-w-full tw-cursor-pointer tw-items-start tw-gap-4 tw-bg-background tw-p-4">
          <SheetTrigger asChild>
            <LuPanelLeft className="tw-my-auto tw-size-4" />
          </SheetTrigger>
          <MyBreadcrumb navItems={navItems} />
        </div>
        <SheetContent side="left" className="tw-h-full tw-p-0">
          {children}
        </SheetContent>
      </Sheet>
    </MobileSidebarContext>
  );
}

export const MobileSidebarContext = createContext<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});
