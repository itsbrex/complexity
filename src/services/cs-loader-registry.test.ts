import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { CsLoaderRegistry, LOADER_IDS } from "@/services/cs-loader-registry";

type LoaderId = (typeof LOADER_IDS)[number];

describe("CsLoaderRegistry", () => {
  beforeEach(() => {
    // Reset the registry before each test
    vi.restoreAllMocks();
    vi.useFakeTimers();
    // Clear the registry by re-registering all loaders
    // @ts-ignore - accessing private for testing
    CsLoaderRegistry.loaderMap.clear();
    // @ts-ignore - accessing private for testing
    CsLoaderRegistry.loadedLoaders.clear();
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

    CsLoaderRegistry.register(mockLoader);

    // @ts-ignore - accessing private for testing
    const loaderMap = CsLoaderRegistry.loaderMap;
    const registeredLoader = loaderMap.get(mockLoader.id);

    expect(loaderMap.has(mockLoader.id)).toBe(true);
    expect(registeredLoader).toEqual(mockLoader);
  });

  it("should throw error when registering duplicate loader", () => {
    const mockLoader = {
      id: LOADER_IDS[0],
      loader: vi.fn(),
    };

    CsLoaderRegistry.register(mockLoader);
    expect(() => CsLoaderRegistry.register(mockLoader)).toThrow(
      "Loader `lib:i18next` is already registered",
    );
  });

  it("should execute loader successfully", async () => {
    const mockLoader = {
      id: LOADER_IDS[0],
      loader: vi.fn().mockResolvedValue(undefined),
    };

    CsLoaderRegistry.register(mockLoader);
    await CsLoaderRegistry.executeAll();

    expect(mockLoader.loader).toHaveBeenCalledTimes(1);
    expect(CsLoaderRegistry.isLoaderLoaded(mockLoader.id)).toBe(true);
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

    CsLoaderRegistry.register(dependencyLoader);
    CsLoaderRegistry.register(mainLoader);

    await CsLoaderRegistry.executeAll();

    expect(dependencyLoader.loader).toHaveBeenCalledTimes(1);
    expect(mainLoader.loader).toHaveBeenCalledTimes(1);
    expect(CsLoaderRegistry.isLoaderLoaded(dependencyLoader.id)).toBe(true);
    expect(CsLoaderRegistry.isLoaderLoaded(mainLoader.id)).toBe(true);
  });

  it("should throw error when dependency is not registered", async () => {
    const mainLoader = {
      id: "lib:i18next" as LoaderId,
      loader: vi.fn(),
      dependencies: ["lib:dayjs" as LoaderId],
    };

    CsLoaderRegistry.register(mainLoader);
    await expect(CsLoaderRegistry.executeAll()).rejects.toThrow(
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
    CsLoaderRegistry.register(dependencyLoader);
    CsLoaderRegistry.register(mainLoader1);
    CsLoaderRegistry.register(mainLoader2);

    await CsLoaderRegistry.executeAll();

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
    CsLoaderRegistry.register(loader1);
    CsLoaderRegistry.register(loader2);
    CsLoaderRegistry.register(loader3);

    await CsLoaderRegistry.executeAll();

    expect(executionOrder).toEqual(["loader3", "loader2", "loader1"]);
    expect(loader3.loader).toHaveBeenCalledTimes(1);
    expect(loader2.loader).toHaveBeenCalledTimes(1);
    expect(loader1.loader).toHaveBeenCalledTimes(1);
  });
});
