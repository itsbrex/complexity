import { describe, it, expect, beforeEach, vi } from "vitest";

import type {
  Middleware,
  MiddlewareData,
} from "@/features/plugins/_core/network-intercept/middleware-manager.types";
import MiddlewareManager from "@/features/plugins/_core/network-intercept/MiddlewareManager";

describe("MiddlewareManager", () => {
  beforeEach(() => {
    // Clear all middlewares before each test
    MiddlewareManager.getMiddlewares().forEach((middleware) => {
      MiddlewareManager.removeMiddleware(middleware.id);
    });
  });

  it("should be a singleton", () => {
    const instance1 = MiddlewareManager;
    const instance2 = MiddlewareManager;
    expect(instance1).toBe(instance2);
  });

  describe("addMiddleware", () => {
    it("should add middleware to the chain", () => {
      const middleware: Middleware = {
        id: "test",
        middlewareFn: vi.fn(),
      };

      MiddlewareManager.addMiddleware(middleware);
      expect(MiddlewareManager.getMiddlewares()).toContain(middleware);
    });

    it("should throw error when adding middleware with duplicate id", () => {
      const middleware: Middleware = {
        id: "test",
        middlewareFn: vi.fn(),
      };

      MiddlewareManager.addMiddleware(middleware);
      expect(() => MiddlewareManager.addMiddleware(middleware)).toThrow(
        "Middleware with id test already exists",
      );
    });

    it("should respect 'first' priority", () => {
      const middleware1: Middleware = {
        id: "first",
        middlewareFn: vi.fn(),
        priority: { position: "first" },
      };
      const middleware2: Middleware = {
        id: "second",
        middlewareFn: vi.fn(),
      };

      MiddlewareManager.addMiddleware(middleware2);
      MiddlewareManager.addMiddleware(middleware1);

      expect(MiddlewareManager.getMiddlewares()[0]).toBe(middleware1);
    });

    it("should respect 'beforeId' priority", () => {
      const middleware1: Middleware = {
        id: "target",
        middlewareFn: vi.fn(),
      };
      const middleware2: Middleware = {
        id: "before",
        middlewareFn: vi.fn(),
        priority: { position: "beforeId", id: "target" },
      };

      MiddlewareManager.addMiddleware(middleware1);
      MiddlewareManager.addMiddleware(middleware2);

      expect(MiddlewareManager.getMiddlewares()[0]).toBe(middleware2);
    });
  });

  describe("updateMiddleware", () => {
    it("should update existing middleware", () => {
      const originalMiddleware: Middleware = {
        id: "test",
        middlewareFn: vi.fn(),
      };
      const updatedMiddleware: Middleware = {
        id: "test",
        middlewareFn: vi.fn(),
      };

      MiddlewareManager.addMiddleware(originalMiddleware);
      MiddlewareManager.updateMiddleware(updatedMiddleware);

      expect(MiddlewareManager.getMiddlewares()).toContain(updatedMiddleware);
      expect(MiddlewareManager.getMiddlewares()).not.toContain(
        originalMiddleware,
      );
    });
  });

  describe("removeMiddleware", () => {
    it("should remove middleware from the chain", () => {
      const middleware: Middleware = {
        id: "test",
        middlewareFn: vi.fn(),
      };

      MiddlewareManager.addMiddleware(middleware);
      MiddlewareManager.removeMiddleware("test");

      expect(MiddlewareManager.getMiddlewares()).not.toContain(middleware);
    });
  });

  describe("executeMiddlewares", () => {
    it("should execute middlewares in order", async () => {
      const order: number[] = [];
      const middleware1: Middleware = {
        id: "1",
        middlewareFn: async ({ data }) => {
          order.push(1);
          return data.payload.data;
        },
      };
      const middleware2: Middleware = {
        id: "2",
        middlewareFn: async ({ data }) => {
          order.push(2);
          return data.payload.data;
        },
      };

      MiddlewareManager.addMiddleware(middleware1);
      MiddlewareManager.addMiddleware(middleware2);

      const testData: MiddlewareData = {
        type: "network-intercept:fetchEvent",
        event: "request",
        payload: {
          url: "https://test.com",
          data: "test",
        },
      };

      await MiddlewareManager.executeMiddlewares({ data: testData });
      expect(order).toEqual([1, 2]);
    });

    it("should stop propagation when requested", async () => {
      const order: number[] = [];
      const middleware1: Middleware = {
        id: "1",
        middlewareFn: async ({ data, stopPropagation }) => {
          order.push(1);
          stopPropagation();
          return data.payload.data;
        },
      };
      const middleware2: Middleware = {
        id: "2",
        middlewareFn: async ({ data }) => {
          order.push(2);
          return data.payload.data;
        },
      };

      MiddlewareManager.addMiddleware(middleware1);
      MiddlewareManager.addMiddleware(middleware2);

      const testData: MiddlewareData = {
        type: "network-intercept:fetchEvent",
        event: "request",
        payload: {
          url: "https://test.com",
          data: "test",
        },
      };

      await MiddlewareManager.executeMiddlewares({ data: testData });
      expect(order).toEqual([1]);
    });

    it("should allow middleware to skip processing", async () => {
      const middleware: Middleware = {
        id: "test",
        middlewareFn: async ({ skip }) => {
          return skip();
        },
      };

      MiddlewareManager.addMiddleware(middleware);

      const testData: MiddlewareData = {
        type: "network-intercept:fetchEvent",
        event: "request",
        payload: {
          url: "https://test.com",
          data: "test",
        },
      };

      const result = await MiddlewareManager.executeMiddlewares({
        data: testData,
      });
      expect(result.payload.data).toBe("test");
    });

    it("should allow middleware to remove itself", async () => {
      const middleware: Middleware = {
        id: "test",
        middlewareFn: async ({ removeMiddleware, data }) => {
          removeMiddleware();
          return data.payload.data;
        },
      };

      MiddlewareManager.addMiddleware(middleware);

      const testData: MiddlewareData = {
        type: "network-intercept:fetchEvent",
        event: "request",
        payload: {
          url: "https://test.com",
          data: "test",
        },
      };

      await MiddlewareManager.executeMiddlewares({ data: testData });
      expect(MiddlewareManager.getMiddlewares()).not.toContain(middleware);
    });

    it("should propagate errors that are not STOP_PROPAGATION", async () => {
      const error = new Error("Test error");
      const middleware: Middleware = {
        id: "test",
        middlewareFn: async () => {
          throw error;
        },
      };

      MiddlewareManager.addMiddleware(middleware);

      const testData: MiddlewareData = {
        type: "network-intercept:fetchEvent",
        event: "request",
        payload: {
          url: "https://test.com",
          data: "test",
        },
      };

      await expect(
        MiddlewareManager.executeMiddlewares({ data: testData }),
      ).rejects.toThrow(error);
    });
  });
});
