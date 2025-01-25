import { describe, it, expect } from "vitest";

import {
  checkDeviceType,
  checkAuthStatus,
  checkAccountTypes,
  checkPluginDependencies,
  checkLocation,
  checkIncognito,
  type GuardConditions,
  type GuardCheckParams,
} from "@/components/plugins-guard/guards";

describe("Guard Functions", () => {
  describe("checkDeviceType", () => {
    it("should return true when no device restrictions", () => {
      const conditions: GuardConditions = {};
      const params: Pick<GuardCheckParams, "isMobile"> = { isMobile: false };
      expect(checkDeviceType(conditions, params)).toBe(true);
    });

    it("should return false when desktop only and on mobile", () => {
      const conditions: GuardConditions = { desktopOnly: true };
      const params: Pick<GuardCheckParams, "isMobile"> = { isMobile: true };
      expect(checkDeviceType(conditions, params)).toBe(false);
    });

    it("should return false when mobile only and on desktop", () => {
      const conditions: GuardConditions = { mobileOnly: true };
      const params: Pick<GuardCheckParams, "isMobile"> = { isMobile: false };
      expect(checkDeviceType(conditions, params)).toBe(false);
    });
  });

  describe("checkAuthStatus", () => {
    it("should return true when no auth required", () => {
      const conditions: GuardConditions = {};
      const params: Pick<GuardCheckParams, "isLoggedIn"> = {
        isLoggedIn: false,
      };
      expect(checkAuthStatus(conditions, params)).toBe(true);
    });

    it("should return false when auth required but not logged in", () => {
      const conditions: GuardConditions = { requiresLoggedIn: true };
      const params: Pick<GuardCheckParams, "isLoggedIn"> = {
        isLoggedIn: false,
      };
      expect(checkAuthStatus(conditions, params)).toBe(false);
    });

    it("should return true when auth required and logged in", () => {
      const conditions: GuardConditions = { requiresLoggedIn: true };
      const params: Pick<GuardCheckParams, "isLoggedIn"> = { isLoggedIn: true };
      expect(checkAuthStatus(conditions, params)).toBe(true);
    });
  });

  describe("checkAccountTypes", () => {
    it("should return true when no account type restrictions", () => {
      const conditions: GuardConditions = {};
      const params: Pick<GuardCheckParams, "hasActiveSub" | "isOrgMember"> = {
        hasActiveSub: false,
        isOrgMember: false,
      };
      expect(checkAccountTypes(conditions, params)).toBe(true);
    });

    it("should return false for org member when enterprise not allowed", () => {
      const conditions: GuardConditions = {
        allowedAccountTypes: [["free"], ["pro"]],
      };
      const params: Pick<GuardCheckParams, "hasActiveSub" | "isOrgMember"> = {
        hasActiveSub: true,
        isOrgMember: true,
      };
      expect(checkAccountTypes(conditions, params)).toBe(false);
    });

    it("should return false for free user when free not allowed", () => {
      const conditions: GuardConditions = {
        allowedAccountTypes: [["pro"], ["pro", "enterprise"]],
      };
      const params: Pick<GuardCheckParams, "hasActiveSub" | "isOrgMember"> = {
        hasActiveSub: false,
        isOrgMember: false,
      };
      expect(checkAccountTypes(conditions, params)).toBe(false);
    });
  });

  describe("checkPluginDependencies", () => {
    it("should return true when no dependencies", () => {
      const conditions: GuardConditions = {};
      const params: Pick<GuardCheckParams, "pluginsEnableStates"> = {
        pluginsEnableStates: {},
      };
      expect(checkPluginDependencies(conditions, params)).toBe(true);
    });

    it("should return false when required plugin is disabled", () => {
      const conditions: GuardConditions = {
        dependentPluginIds: ["queryBox:languageModelSelector"],
      };
      const params: Pick<GuardCheckParams, "pluginsEnableStates"> = {
        pluginsEnableStates: { "queryBox:languageModelSelector": false },
      };
      expect(checkPluginDependencies(conditions, params)).toBe(false);
    });
  });

  describe("checkLocation", () => {
    it("should return true when no location restrictions", () => {
      const conditions: GuardConditions = {};
      const params: Pick<GuardCheckParams, "currentLocation"> = {
        currentLocation: "home",
      };
      expect(checkLocation(conditions, params)).toBe(true);
    });

    it("should return false when location doesn't match", () => {
      const conditions: GuardConditions = { location: ["thread"] };
      const params: Pick<GuardCheckParams, "currentLocation"> = {
        currentLocation: "home",
      };
      expect(checkLocation(conditions, params)).toBe(false);
    });

    it("should return false when currentLocation is undefined", () => {
      const conditions: GuardConditions = { location: ["thread"] };
      const params: Pick<GuardCheckParams, "currentLocation"> = {
        currentLocation: undefined as any,
      };
      expect(checkLocation(conditions, params)).toBe(false);
    });
  });

  describe("checkIncognito", () => {
    it("should return true when incognito allowed", () => {
      const conditions: GuardConditions = { allowIncognito: true };
      const params: Pick<GuardCheckParams, "isIncognito"> = {
        isIncognito: true,
      };
      expect(checkIncognito(conditions, params)).toBe(true);
    });

    it("should return false when incognito not allowed and in incognito", () => {
      const conditions: GuardConditions = { allowIncognito: false };
      const params: Pick<GuardCheckParams, "isIncognito"> = {
        isIncognito: true,
      };
      expect(checkIncognito(conditions, params)).toBe(false);
    });

    it("should return true when incognito not allowed but not in incognito", () => {
      const conditions: GuardConditions = { allowIncognito: false };
      const params: Pick<GuardCheckParams, "isIncognito"> = {
        isIncognito: false,
      };
      expect(checkIncognito(conditions, params)).toBe(true);
    });
  });
});
