import { Trans } from "react-i18next";
import { LuExternalLink } from "react-icons/lu";
import { NavLink } from "react-router-dom";

import { navItems } from "@/features/options-page/components/sidebar/nav-items";
import SidebarUpdateAnnouncer from "@/features/options-page/components/SidebarUpdateAnnouncer";
import SponsorDialogWrapper from "@/features/options-page/components/SponsorDialogWrapper";

export default function Sidebar() {
  return (
    <div className="tw-sticky tw-top-0 tw-flex tw-h-screen tw-flex-col">
      <div className="tw-flex-1 tw-overflow-y-auto tw-p-4 tw-px-2">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              cn(
                "tw-mb-1 tw-flex tw-items-center tw-rounded-md tw-p-2 tw-px-4 tw-text-sm tw-font-medium tw-transition-all",
                {
                  "tw-bg-primary-foreground tw-text-primary": isActive,
                  "tw-text-muted-foreground hover:tw-text-foreground":
                    !isActive,
                },
              )
            }
          >
            <Icon className="tw-mr-2 tw-size-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>

      <div className="tw-sticky tw-bottom-0 tw-z-10 tw-flex tw-shrink-0 tw-flex-col tw-gap-4 tw-bg-background tw-p-4">
        <SidebarUpdateAnnouncer />

        <SponsorDialogWrapper>
          <div className="tw-group tw-relative tw-w-full tw-cursor-pointer tw-rounded-md tw-border tw-border-border/50 tw-bg-secondary tw-p-4 tw-text-sm tw-font-medium tw-shadow-lg tw-transition-all hover:tw-scale-105 hover:tw-border-primary hover:tw-bg-primary/10">
            <Trans
              i18nKey="sidebar.supporterMessage"
              components={{
                emphasis: <span className="tw-font-medium tw-text-primary" />,
              }}
            />
            <LuExternalLink className="tw-absolute tw-right-2 tw-top-2 tw-size-3.5 tw-text-muted group-hover:tw-text-primary" />
          </div>
        </SponsorDialogWrapper>
      </div>
    </div>
  );
}
