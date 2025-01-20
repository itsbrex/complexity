import { describe, it, expect } from "vitest";

import { ExtensionVersion } from "@/utils/ext-version";
import { escapeHtmlTags, isValidVersionString, whereAmI } from "@/utils/utils";

describe("isValidVersionString", () => {
  it("should return true for valid version strings", () => {
    expect(isValidVersionString("1.0.0")).toBe(true);
    expect(isValidVersionString("0.0.0.1")).toBe(true);
  });

  it("should return false for invalid version strings", () => {
    expect(isValidVersionString("1")).toBe(false);
    expect(isValidVersionString("0.1.")).toBe(false);
    expect(isValidVersionString("1.0.0a")).toBe(false);
  });
});

describe("ExtensionVersion", () => {
  it("should handle equal versions", () => {
    const version = new ExtensionVersion("1.2.3");
    expect(version.isEqualTo("1.2.3")).toBe(true);
    expect(version.isEqualTo("1.2.4")).toBe(false);
  });

  it("should handle newer versions", () => {
    const version = new ExtensionVersion("1.2.3");
    expect(version.isNewerThan("1.2.2")).toBe(true);
    expect(version.isNewerThan("1.2.3")).toBe(false);
    expect(version.isNewerThan("1.2.4")).toBe(false);
  });

  it("should handle older versions", () => {
    const version = new ExtensionVersion("1.2.3");
    expect(version.isOlderThan("1.2.4")).toBe(true);
    expect(version.isOlderThan("1.2.3")).toBe(false);
    expect(version.isOlderThan("1.2.2")).toBe(false);
  });

  it("should handle newer than or equal versions", () => {
    const version = new ExtensionVersion("1.2.3");
    expect(version.isNewerThanOrEqualTo("1.2.2")).toBe(true);
    expect(version.isNewerThanOrEqualTo("1.2.3")).toBe(true);
    expect(version.isNewerThanOrEqualTo("1.2.4")).toBe(false);
  });

  it("should handle older than or equal versions", () => {
    const version = new ExtensionVersion("1.2.3");
    expect(version.isOlderThanOrEqualTo("1.2.4")).toBe(true);
    expect(version.isOlderThanOrEqualTo("1.2.3")).toBe(true);
    expect(version.isOlderThanOrEqualTo("1.2.2")).toBe(false);
  });

  it("should handle version strings of different lengths", () => {
    const version = new ExtensionVersion("1.2.3");
    expect(version.isEqualTo("1.2.3.0")).toBe(true);
    expect(version.isOlderThan("1.2.3.1")).toBe(true);
    expect(version.isNewerThan("1.2.3.0")).toBe(false);
  });

  it("should throw an error for invalid version strings", () => {
    const version = new ExtensionVersion("1.2.3");
    expect(() => version.isNewerThan("1.a.0")).toThrow(
      "Invalid version string",
    );
  });
});

describe("whereAmI", () => {
  it('should return "collection" for collection URLs', () => {
    expect(whereAmI("https://www.perplexity.ai/collections/example")).toBe(
      "collection",
    );
  });

  it('should return "thread" for thread URLs', () => {
    expect(whereAmI("https://www.perplexity.ai/search/example-query")).toBe(
      "thread",
    );
  });

  it('should return "page" for Pages URLs', () => {
    expect(whereAmI("https://www.perplexity.ai/page/example-page")).toBe(
      "page",
    );
  });

  it('should return "library" for library URLs', () => {
    expect(whereAmI("https://www.perplexity.ai/library")).toBe("library");
  });

  it('should return "home" for the home URL', () => {
    expect(whereAmI("https://www.perplexity.ai/")).toBe("home");
  });

  it('should return "same_origin" for unrecognized paths on perplexity.ai', () => {
    expect(whereAmI("https://www.perplexity.ai/settings")).toBe("same_origin");
  });

  it('should return "unknown" for non-perplexity.ai URLs', () => {
    expect(whereAmI("https://example.com")).toBe("unknown");
  });
});

describe("escapeHtmlTags", () => {
  it("should replace < with &lt;", () => {
    expect(escapeHtmlTags("<div>")).toBe("&lt;div&gt;");
  });

  it("should replace > with &gt;", () => {
    expect(escapeHtmlTags("</div>")).toBe("&lt;/div&gt;");
  });

  it("should replace both < and > in a string", () => {
    expect(escapeHtmlTags("<p>Hello, world!</p>")).toBe(
      "&lt;p&gt;Hello, world!&lt;/p&gt;",
    );
  });

  it("should not modify strings without < or >", () => {
    expect(escapeHtmlTags("Hello, world!")).toBe("Hello, world!");
  });

  it("should handle empty strings", () => {
    expect(escapeHtmlTags("")).toBe("");
  });

  it("should handle strings with multiple occurrences of < and >", () => {
    expect(escapeHtmlTags("<<div>>")).toBe("&lt;&lt;div&gt;&gt;");
  });
});
