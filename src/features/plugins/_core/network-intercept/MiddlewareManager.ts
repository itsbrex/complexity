import {
  Middleware,
  MiddlewareData,
  MiddlewareNameBasedPriority,
} from "@/features/plugins/_core/network-intercept/middleware-manager.types";

class MiddlewareManager {
  private static instance: MiddlewareManager;
  private middlewares: Middleware[] = [];

  private constructor() {}

  static getInstance(): MiddlewareManager {
    if (MiddlewareManager.instance == null) {
      MiddlewareManager.instance = new MiddlewareManager();
    }
    return MiddlewareManager.instance;
  }

  addMiddleware(middleware: Middleware): void {
    if (this.middlewares.find((m) => m.id === middleware.id)) {
      throw new Error(`Middleware with id ${middleware.id} already exists`);
    }

    // TODO: refactor priority logic
    if (middleware.priority) {
      switch (middleware.priority.position) {
        case "first":
          this.middlewares.unshift(middleware);
          break;
        case "beforeId":
        case "afterId": {
          const index = this.middlewares.findIndex(
            (m) =>
              m.id === (middleware.priority as MiddlewareNameBasedPriority).id,
          );
          if (index !== -1) {
            this.middlewares.splice(
              middleware.priority.position === "beforeId" ? index : index + 1,
              0,
              middleware,
            );
          } else {
            this.middlewares.push(middleware);
          }
          break;
        }
        case "last":
        default:
          this.middlewares.push(middleware);
      }
    } else {
      this.middlewares.push(middleware);
    }
  }

  updateMiddleware(middleware: Middleware): void {
    this.removeMiddleware(middleware.id);
    this.addMiddleware(middleware);
  }

  removeMiddleware(middlewareId: string): void {
    this.middlewares = this.middlewares.filter(
      (middleware) => middleware.id !== middlewareId,
    );
  }

  getMiddlewares(): Middleware[] {
    return this.middlewares;
  }

  async executeMiddlewares({ data }: { data: MiddlewareData }) {
    let currentData = { ...data };

    for (const middleware of this.middlewares) {
      try {
        const newData = await middleware.middlewareFn({
          data: currentData,
          stopPropagation: (data) => {
            if (data != null) {
              currentData = {
                ...currentData,
                payload: { ...currentData.payload, data },
              };
            }

            throw new Error("STOP_PROPAGATION");
          },
          skip: () => {
            throw new Error("SKIP");
          },
          removeMiddleware: () => this.removeMiddleware(middleware.id),
        });

        currentData = {
          ...currentData,
          payload: { ...currentData.payload, data: newData },
        };
      } catch (error: unknown) {
        if (error instanceof Error && error.message === "STOP_PROPAGATION") {
          break;
        } else if (error instanceof Error && error.message === "SKIP") {
          continue;
        }
        throw error;
      }
    }

    return currentData;
  }
}

export default MiddlewareManager.getInstance();
