import { describe, it, expect } from "vitest";

import {
  mergeUndefined,
  setPathToUndefined,
} from "@/services/extension-local-storage/utils";

describe("mergeUndefined", () => {
  it("should keep target values when they are not undefined", () => {
    type TestType = {
      a: number;
      b: string;
    };

    const target = { a: 1, b: "hello" } as const;
    const source: TestType = { a: 2, b: "world" };

    const result = mergeUndefined<TestType>({ target, source });
    expect(result).toEqual({ a: 1, b: "hello" });
  });

  it("should use source values when target values are undefined", () => {
    type TestType = {
      a: number;
      b: string;
    };

    const target = { a: undefined, b: "hello" } as const;
    const source: TestType = { a: 2, b: "world" };

    const result = mergeUndefined<TestType>({ target, source });
    expect(result).toEqual({ a: 2, b: "hello" });
  });

  it("should handle nested objects", () => {
    type TestType = {
      a: { x: string; y: string };
      b: { p: string; q: string };
    };

    const target = {
      a: { x: undefined, y: "keep" },
      b: { p: "stay", q: undefined },
    };
    const source: TestType = {
      a: { x: "new", y: "replace" },
      b: { p: "change", q: "set" },
    };

    const result = mergeUndefined<TestType>({ target, source });
    expect(result).toEqual({
      a: { x: "new", y: "keep" },
      b: { p: "stay", q: "set" },
    });
  });

  it("should handle arrays", () => {
    type TestType = {
      arr: string[];
    };

    const target = {
      arr: [undefined, "keep", undefined],
    };
    const source: TestType = {
      arr: ["new", "replace", "add"],
    };

    const result = mergeUndefined<TestType>({ target, source });
    expect(result).toEqual({
      arr: ["new", "keep", "add"],
    });
  });

  it("should handle deeply nested structures", () => {
    type TestType = {
      level1: {
        level2: {
          a: string;
          b: string;
          level3: {
            x: string;
            y: string;
          };
        };
      };
    };

    const target = {
      level1: {
        level2: {
          a: undefined,
          b: "keep",
          level3: {
            x: undefined,
            y: "stay",
          },
        },
      },
    };
    const source: TestType = {
      level1: {
        level2: {
          a: "new",
          b: "replace",
          level3: {
            x: "set",
            y: "change",
          },
        },
      },
    };

    const result = mergeUndefined<TestType>({ target, source });
    expect(result).toEqual({
      level1: {
        level2: {
          a: "new",
          b: "keep",
          level3: {
            x: "set",
            y: "stay",
          },
        },
      },
    });
  });

  it("should not mutate original objects", () => {
    type TestType = {
      a: number;
      b: number;
    };

    const target = { a: undefined, b: 1 };
    const source: TestType = { a: 2, b: 2 };

    const originalTarget = { ...target };
    const originalSource = { ...source };

    mergeUndefined<TestType>({ target, source });

    expect(target).toEqual(originalTarget);
    expect(source).toEqual(originalSource);
  });
});

describe("setPathToUndefined", () => {
  it("should set a simple path to undefined", () => {
    const obj = { a: 1, b: 2 };
    const result = setPathToUndefined({ paths: ["a"], obj });
    expect(result).toEqual({ a: undefined, b: 2 });
    // Verify original wasn't mutated
    expect(obj).toEqual({ a: 1, b: 2 });
  });

  it("should set a nested path to undefined", () => {
    const obj = {
      level1: {
        level2: {
          a: 1,
          b: 2,
        },
      },
    };
    const result = setPathToUndefined({
      paths: ["level1", "level2", "a"],
      obj,
    });
    expect(result).toEqual({
      level1: {
        level2: {
          a: undefined,
          b: 2,
        },
      },
    });
  });

  it("should handle non-existent paths by returning unchanged object", () => {
    const obj = { a: 1 };
    const result = setPathToUndefined({ paths: ["nonexistent", "path"], obj });
    expect(result).toEqual({ a: 1 });
  });

  it("should handle empty paths array", () => {
    const obj = { a: 1 };
    const result = setPathToUndefined({ paths: [], obj });
    expect(result).toEqual({ a: 1 });
  });

  it("should handle path to non-object value", () => {
    const obj = {
      a: 1,
      b: {
        c: "test",
      },
    };
    const result = setPathToUndefined({ paths: ["a", "nonexistent"], obj });
    expect(result).toEqual({
      a: 1,
      b: {
        c: "test",
      },
    });
  });

  it("should not modify siblings when setting deep path to undefined", () => {
    const obj = {
      keep: "this",
      level1: {
        keep: "that",
        level2: {
          setThis: "to undefined",
          keepThis: "as is",
        },
      },
    };
    const result = setPathToUndefined({
      paths: ["level1", "level2", "setThis"],
      obj,
    });
    expect(result).toEqual({
      keep: "this",
      level1: {
        keep: "that",
        level2: {
          setThis: undefined,
          keepThis: "as is",
        },
      },
    });
  });
});
