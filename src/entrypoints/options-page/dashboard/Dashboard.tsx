import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import LoadingOverlay from "@/components/LoadingOverlay";
import DesktopSidebarWrapper from "@/entrypoints/options-page/components/sidebar/DesktopWrapper";
import MobileSidebarWrapper from "@/entrypoints/options-page/components/sidebar/MobileWrapper";
import Sidebar from "@/entrypoints/options-page/components/sidebar/Sidebar";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";

export default function Dashboard() {
  const { isMobile } = useIsMobileStore();
  const SidebarWrapper = isMobile
    ? MobileSidebarWrapper
    : DesktopSidebarWrapper;

  return (
    <div className="tw-flex tw-min-h-screen tw-bg-background">
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>

      <div className="tw-flex tw-flex-1 tw-flex-col tw-gap-4">
        <main className="tw-mx-auto tw-mt-11 tw-min-h-[100dvh] tw-w-full tw-max-w-[1800px] tw-p-4 md:tw-mt-0">
          <Suspense fallback={<LoadingOverlay />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
