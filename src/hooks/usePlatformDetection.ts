import { useMemo } from "react";

export type Platform = "windows" | "linux" | "mac";

export default function usePlatformDetection(): Platform {
  return useMemo(getPlatform, []);
}

export const getPlatform = () => {
  if (typeof navigator === "undefined") return "windows";

  // Try using userAgentData first (modern browsers)
  if ((navigator as any).userAgentData?.platform != null) {
    const platform = (navigator as any).userAgentData.platform;
    if (/macOS/.test(platform)) return "mac";
    if (/Linux/.test(platform)) return "linux";
    if (/Windows/.test(platform)) return "windows";
  }

  // Fallback to userAgent string
  const userAgent = navigator.userAgent;
  if (/Mac|iPod|iPhone|iPad/.test(userAgent)) return "mac";
  if (/Linux/.test(userAgent)) return "linux";
  if (/Windows/.test(userAgent)) return "windows";

  // Default to windows if we can't determine
  return "windows";
};
