import { BiExtension } from "react-icons/bi";
import {
  LuFileText,
  LuMessageCircle,
  LuPalette,
  LuSettings,
} from "react-icons/lu";

export type NavItem = {
  icon: React.ElementType;
  label: string;
  path: string;
};

export const navItems: NavItem[] = [
  {
    icon: BiExtension,
    label: t("common:sidebar.items.plugins"),
    path: "/plugins",
  },
  {
    icon: LuPalette,
    label: t("common:sidebar.items.themes"),
    path: "/themes",
  },
  {
    icon: LuFileText,
    label: t("common:sidebar.items.releaseNotes"),
    path: "/release-notes",
  },
  {
    icon: LuSettings,
    label: t("common:sidebar.items.settings"),
    path: "/settings",
  },
  {
    icon: LuMessageCircle,
    label: t("common:sidebar.items.help"),
    path: "/help",
  },
];
