import { describe, it, expect, beforeEach, vi } from "vitest";

import { middlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import type {
  Middleware,
  MiddlewareData,
} from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager.types";

describe("middlewareManager", () => {
  beforeEach(() => {
    // Clear all middlewares before each test
    middlewareManager.getMiddlewares().forEach((middleware) => {
      middlewareManager.removeMiddleware(middleware.id);
    });
  });

  it("should be a singleton", () => {
    const instance1 = middlewareManager;
    const instance2 = middlewareManager;
    expect(instance1).toBe(instance2);
  });

  describe("addMiddleware", () => {
    it("should add middleware to the chain", () => {
      const middleware: Middleware = {
        id: "test",
        middlewareFn: vi.fn(),
      };

      middlewareManager.addMiddleware(middleware);
      expect(middlewareManager.getMiddlewares()).toContain(middleware);
    });

    it("should throw error when adding middleware with duplicate id", () => {
      const middleware: Middleware = {
        id: "test",
        middlewareFn: vi.fn(),
      };

      middlewareManager.addMiddleware(middleware);
      expect(() => middlewareManager.addMiddleware(middleware)).toThrow(
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

      middlewareManager.addMiddleware(middleware2);
      middlewareManager.addMiddleware(middleware1);

      expect(middlewareManager.getMiddlewares()[0]).toBe(middleware1);
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

      middlewareManager.addMiddleware(middleware1);
      middlewareManager.addMiddleware(middleware2);

      expect(middlewareManager.getMiddlewares()[0]).toBe(middleware2);
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

      middlewareManager.addMiddleware(originalMiddleware);
      middlewareManager.updateMiddleware(updatedMiddleware);

      expect(middlewareManager.getMiddlewares()).toContain(updatedMiddleware);
      expect(middlewareManager.getMiddlewares()).not.toContain(
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

      middlewareManager.addMiddleware(middleware);
      middlewareManager.removeMiddleware("test");

      expect(middlewareManager.getMiddlewares()).not.toContain(middleware);
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

      middlewareManager.addMiddleware(middleware1);
      middlewareManager.addMiddleware(middleware2);

      const testData: MiddlewareData = {
        type: "network-intercept:fetchEvent",
        event: "request",
        payload: {
          url: "https://test.com",
          data: "test",
        },
      };

      await middlewareManager.executeMiddlewares({ data: testData });
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

      middlewareManager.addMiddleware(middleware1);
      middlewareManager.addMiddleware(middleware2);

      const testData: MiddlewareData = {
        type: "network-intercept:fetchEvent",
        event: "request",
        payload: {
          url: "https://test.com",
          data: "test",
        },
      };

      await middlewareManager.executeMiddlewares({ data: testData });
      expect(order).toEqual([1]);
    });

    it("should allow middleware to skip processing", async () => {
      const middleware: Middleware = {
        id: "test",
        middlewareFn: async ({ skip }) => {
          return skip();
        },
      };

      middlewareManager.addMiddleware(middleware);

      const testData: MiddlewareData = {
        type: "network-intercept:fetchEvent",
        event: "request",
        payload: {
          url: "https://test.com",
          data: "test",
        },
      };

      const result = await middlewareManager.executeMiddlewares({
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

      middlewareManager.addMiddleware(middleware);

      const testData: MiddlewareData = {
        type: "network-intercept:fetchEvent",
        event: "request",
        payload: {
          url: "https://test.com",
          data: "test",
        },
      };

      await middlewareManager.executeMiddlewares({ data: testData });
      expect(middlewareManager.getMiddlewares()).not.toContain(middleware);
    });

    it("should propagate errors that are not STOP_PROPAGATION", async () => {
      const error = new Error("Test error");
      const middleware: Middleware = {
        id: "test",
        middlewareFn: async () => {
          throw error;
        },
      };

      middlewareManager.addMiddleware(middleware);

      const testData: MiddlewareData = {
        type: "network-intercept:fetchEvent",
        event: "request",
        payload: {
          url: "https://test.com",
          data: "test",
        },
      };

      await expect(
        middlewareManager.executeMiddlewares({ data: testData }),
      ).rejects.toThrow(error);
    });
  });
});
