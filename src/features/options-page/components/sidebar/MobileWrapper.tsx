import { useState, useEffect } from "react";
import { LuPanelLeft } from "react-icons/lu";
import { useLocation } from "react-router-dom";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navItems } from "@/features/options-page/components/sidebar/nav-items";
import MyBreadcrumb from "@/features/options-page/dashboard/pages/plugins/components/MyBreadcrumb";

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
    <Sheet
      defaultOpen
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <SheetTrigger asChild>
        <div className="tw-fixed tw-left-0 tw-top-0 tw-z-10 tw-flex tw-size-max tw-w-full tw-cursor-pointer tw-items-start tw-gap-4 tw-bg-background tw-p-4">
          <LuPanelLeft className="tw-my-auto tw-size-4" />
          <MyBreadcrumb navItems={navItems} />
        </div>
      </SheetTrigger>
      <SheetContent side="left" className="tw-h-full tw-p-0">
        {children}
      </SheetContent>
    </Sheet>
  );
}
