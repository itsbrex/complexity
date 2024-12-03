import { InterceptorsEvents } from "@/features/plugins/_core/network-intercept/listeners";
import {
  FetchEventData,
  WebSocketEventData,
  XhrEventData,
} from "@/features/plugins/_core/network-intercept/listeners.types";
import { MaybePromise } from "@/types/utils.types";

export type MiddlewareData = (
  | WebSocketEventData
  | XhrEventData
  | FetchEventData
) & {
  type: keyof InterceptorsEvents;
};

type MiddleWareReturnType<T extends MiddlewareData> = MaybePromise<
  T["payload"]["data"]
>;

export type Middleware = {
  id: string;
  middlewareFn: <T extends MiddlewareData>(params: {
    data: T;
    stopPropagation: (data?: MiddlewareData["payload"]["data"]) => never;
    skip: () => never;
    removeMiddleware: () => void;
  }) => MiddleWareReturnType<T>;
  priority?: MiddlewarePriority;
};

export type MiddlewarePriority =
  | MiddlewarePositionBasedPriority
  | MiddlewareNameBasedPriority;

export type MiddlewarePositionBasedPriority = {
  position: "first" | "last";
};

export type MiddlewareNameBasedPriority = {
  position: "beforeId" | "afterId";
  id: string;
};
