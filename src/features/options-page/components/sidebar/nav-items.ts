import { BiExtension } from "react-icons/bi";
import {
  LuBell,
  LuBook,
  LuFileText,
  LuMessageCircle,
  LuSettings,
} from "react-icons/lu";

export type NavItem = {
  icon: React.ElementType;
  label: string;
  path: string;
};

export const navItems: NavItem[] = [
  {
    icon: LuBell,
    label: "Notifications",
    path: "/notifications",
  },
  {
    icon: BiExtension,
    label: "Plugins",
    path: "/plugins",
  },
  {
    icon: LuFileText,
    label: "Release Notes",
    path: "/release-notes",
  },
  {
    icon: LuBook,
    label: "Documentation",
    path: "/documentation",
  },
  {
    icon: LuSettings,
    label: "Settings",
    path: "/settings",
  },
  {
    icon: LuMessageCircle,
    label: "Need help?",
    path: "/help",
  },
];
