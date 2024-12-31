import type { BackgroundEvents as BackgroundEventHandlers } from "@/entrypoints/background/listeners";
import type { MermaidRendererEvents as MermaidRendererEventHandlers } from "@/features/plugins/_core/mermaid-renderer/listeners.main";
import type { InterceptorsEvents as NetworkInterceptInterceptorsEventHandlers } from "@/features/plugins/_core/network-intercept/listeners";
import type { ReactVdomEvents as ReactVdomEventHandlers } from "@/features/plugins/_core/react-vdom/listeners.main";
import type { DispatchEvents as SpaRouterDispatchEventHandlers } from "@/features/plugins/_core/spa-router/listeners";
import type { CsUtilEvents as SpaRouterCsUtilEventHandlers } from "@/features/plugins/_core/spa-router/listeners.main";

export type AllEventHandlers = BackgroundEventHandlers &
  NetworkInterceptInterceptorsEventHandlers &
  SpaRouterCsUtilEventHandlers &
  SpaRouterDispatchEventHandlers &
  ReactVdomEventHandlers &
  MermaidRendererEventHandlers;
