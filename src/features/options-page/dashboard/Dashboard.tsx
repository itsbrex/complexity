import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import LoadingOverlay from "@/components/LoadingOverlay";
import DesktopSidebarWrapper from "@/features/options-page/components/sidebar/DesktopWrapper";
import MobileSidebarWrapper from "@/features/options-page/components/sidebar/MobileWrapper";
import Sidebar from "@/features/options-page/components/sidebar/Sidebar";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";

export default function Dashboard() {
  const { isMobile } = useIsMobileStore();
  const Comp = isMobile ? MobileSidebarWrapper : DesktopSidebarWrapper;

  return (
    <div className="tw-flex tw-min-h-screen tw-bg-background">
      <Comp>
        <Sidebar />
      </Comp>

      <div className="tw-flex tw-flex-1 tw-flex-col tw-gap-4">
        <main className="tw-mx-auto tw-mt-11 tw-w-full tw-max-w-[1800px] tw-p-4 md:tw-mt-0">
          <Suspense fallback={<LoadingOverlay />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
