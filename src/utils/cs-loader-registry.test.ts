import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { csLoaderRegistry, LOADER_IDS } from "@/utils/cs-loader-registry";

type LoaderId = (typeof LOADER_IDS)[number];

describe("csLoaderRegistry", () => {
  beforeEach(() => {
    // Reset the registry before each test
    vi.restoreAllMocks();
    vi.useFakeTimers();
    // Clear the registry by re-registering all loaders
    // @ts-ignore - accessing private for testing
    csLoaderRegistry.loaderMap.clear();
    // @ts-ignore - accessing private for testing
    csLoaderRegistry.loadedLoaders.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("should register a loader successfully", () => {
    const mockLoader = {
      id: LOADER_IDS[0],
      loader: vi.fn(),
    };

    csLoaderRegistry.register(mockLoader);

    // @ts-ignore - accessing private for testing
    const loaderMap = csLoaderRegistry.loaderMap;
    const registeredLoader = loaderMap.get(mockLoader.id);

    expect(loaderMap.has(mockLoader.id)).toBe(true);
    expect(registeredLoader).toEqual(mockLoader);
  });

  it("should throw error when registering duplicate loader", () => {
    const mockLoader = {
      id: LOADER_IDS[0],
      loader: vi.fn(),
    };

    csLoaderRegistry.register(mockLoader);
    expect(() => csLoaderRegistry.register(mockLoader)).toThrow(
      "Loader `lib:i18next` is already registered",
    );
  });

  it("should execute loader successfully", async () => {
    const mockLoader = {
      id: LOADER_IDS[0],
      loader: vi.fn().mockResolvedValue(undefined),
    };

    csLoaderRegistry.register(mockLoader);
    await csLoaderRegistry.executeAll();

    expect(mockLoader.loader).toHaveBeenCalledTimes(1);
    expect(csLoaderRegistry.isLoaderLoaded(mockLoader.id)).toBe(true);
  });

  it("should handle dependencies correctly", async () => {
    const dependencyLoader = {
      id: "lib:dayjs" as LoaderId,
      loader: vi.fn().mockResolvedValue(undefined),
    };

    const mainLoader = {
      id: "lib:i18next" as LoaderId,
      loader: vi.fn().mockResolvedValue(undefined),
      dependencies: ["lib:dayjs" as LoaderId],
    };

    csLoaderRegistry.register(dependencyLoader);
    csLoaderRegistry.register(mainLoader);

    await csLoaderRegistry.executeAll();

    expect(dependencyLoader.loader).toHaveBeenCalledTimes(1);
    expect(mainLoader.loader).toHaveBeenCalledTimes(1);
    expect(csLoaderRegistry.isLoaderLoaded(dependencyLoader.id)).toBe(true);
    expect(csLoaderRegistry.isLoaderLoaded(mainLoader.id)).toBe(true);
  });

  it("should throw error when dependency is not registered", async () => {
    const mainLoader = {
      id: "lib:i18next" as LoaderId,
      loader: vi.fn(),
      dependencies: ["lib:dayjs" as LoaderId],
    };

    csLoaderRegistry.register(mainLoader);
    await expect(csLoaderRegistry.executeAll()).rejects.toThrow(
      "Loader `lib:dayjs` is not registered",
    );
  });

  it("should execute a loader only once even when it's a dependency of multiple loaders", async () => {
    const dependencyLoader = {
      id: "lib:dayjs" as LoaderId,
      loader: vi.fn().mockResolvedValue(undefined),
    };

    const mainLoader1 = {
      id: "lib:i18next" as LoaderId,
      loader: vi.fn().mockResolvedValue(undefined),
      dependencies: ["lib:dayjs" as LoaderId],
    };

    const mainLoader2 = {
      id: "cache:pluginsStates" as LoaderId,
      loader: vi.fn().mockResolvedValue(undefined),
      dependencies: ["lib:dayjs" as LoaderId],
    };

    // Register all loaders
    csLoaderRegistry.register(dependencyLoader);
    csLoaderRegistry.register(mainLoader1);
    csLoaderRegistry.register(mainLoader2);

    await csLoaderRegistry.executeAll();

    expect(dependencyLoader.loader).toHaveBeenCalledTimes(1);
    expect(mainLoader1.loader).toHaveBeenCalledTimes(1);
    expect(mainLoader2.loader).toHaveBeenCalledTimes(1);
  });

  it("should handle nested dependencies in correct order", async () => {
    const executionOrder: string[] = [];

    const loader3 = {
      id: "lib:dayjs" as LoaderId,
      loader: vi.fn().mockImplementation(async () => {
        executionOrder.push("loader3");
      }),
    };

    const loader2 = {
      id: "cache:pluginsStates" as LoaderId,
      loader: vi.fn().mockImplementation(async () => {
        executionOrder.push("loader2");
      }),
      dependencies: ["lib:dayjs" as LoaderId],
    };

    const loader1 = {
      id: "lib:i18next" as LoaderId,
      loader: vi.fn().mockImplementation(async () => {
        executionOrder.push("loader1");
      }),
      dependencies: ["cache:pluginsStates" as LoaderId],
    };

    // Register all loaders in reverse order to test dependency resolution
    csLoaderRegistry.register(loader1);
    csLoaderRegistry.register(loader2);
    csLoaderRegistry.register(loader3);

    await csLoaderRegistry.executeAll();

    expect(executionOrder).toEqual(["loader3", "loader2", "loader1"]);
    expect(loader3.loader).toHaveBeenCalledTimes(1);
    expect(loader2.loader).toHaveBeenCalledTimes(1);
    expect(loader1.loader).toHaveBeenCalledTimes(1);
  });
});
