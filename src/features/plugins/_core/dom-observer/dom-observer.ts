import debounce from "lodash/debounce";
import throttle from "lodash/throttle";

import {
  DomObserverConfig,
  DomObserverInstance,
  MutationCallback,
  ObserverId,
  ObserverOperation,
  Result,
} from "@/features/plugins/_core/dom-observer/dom-observer.types";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";

export class DomObserver {
  private static instances = new Map<ObserverId, DomObserverInstance>();
  private static isLogging = false;

  private static createError(
    code: string,
    message: string,
    context?: unknown,
  ): Result<void> {
    return {
      success: false,
      error: { code, message, context },
    };
  }

  private static createSuccess<T>(data?: T): Result<T> {
    return {
      success: true,
      data,
    };
  }

  private static validateTarget(
    target: Element | null,
    id: ObserverId,
  ): Result<void> {
    if (!target) {
      return this.createError(
        "INVALID_TARGET",
        `Target is null for observer "${id}"`,
      );
    }
    if (!document.contains(target)) {
      return this.createError(
        "TARGET_NOT_IN_DOM",
        `Target is not in DOM for observer "${id}"`,
      );
    }
    return this.createSuccess();
  }

  private static handleOperation(operation: ObserverOperation): Result<void> {
    const { type, id, config } = operation;

    switch (type) {
      case "create":
        return this.handleCreate(id, config as DomObserverConfig);
      case "update":
        return this.handleUpdate(id, config);
      case "destroy":
        return this.handleDestroy(id);
      case "pause":
        return this.handlePause(id);
      case "resume":
        return this.handleResume(id);
      default:
        return this.createError(
          "INVALID_OPERATION",
          `Invalid operation type: ${type}`,
        );
    }
  }

  private static handleCreate(
    id: ObserverId,
    config: DomObserverConfig,
  ): Result<void> {
    if (this.instances.has(id)) {
      return this.handleUpdate(id, config);
    }

    const targetValidation = this.validateTarget(config.target, id);
    if (!targetValidation.success) return targetValidation;

    const observer = new MutationObserver(
      this.createMutationHandler(id, config),
    );
    const instance: DomObserverInstance = { observer, config, isPaused: false };

    this.instances.set(id, instance);
    this.observe(id);
    this.log(`Created observer with id "${id}"`);
    return this.createSuccess();
  }

  private static handleUpdate(
    id: ObserverId,
    newConfig?: Partial<DomObserverConfig>,
  ): Result<void> {
    const instance = this.instances.get(id);
    if (!instance) {
      return this.createError(
        "OBSERVER_NOT_FOUND",
        `Observer with id "${id}" not found`,
      );
    }

    const updatedConfig = { ...instance.config, ...newConfig };
    const targetValidation = this.validateTarget(updatedConfig.target, id);
    if (!targetValidation.success) return targetValidation;

    instance.observer.disconnect();
    instance.observer = new MutationObserver(
      this.createMutationHandler(id, updatedConfig),
    );
    instance.config = updatedConfig;

    this.observe(id);
    this.log(`Updated observer with id "${id}"`);
    return this.createSuccess();
  }

  private static handleDestroy(id: ObserverId): Result<void> {
    const instance = this.instances.get(id);
    if (!instance) {
      return this.createError(
        "OBSERVER_NOT_FOUND",
        `Observer with id "${id}" not found`,
      );
    }

    instance.observer.disconnect();
    this.instances.delete(id);
    this.log(`Destroyed observer with id "${id}"`);
    return this.createSuccess();
  }

  private static handlePause(id: ObserverId): Result<void> {
    const instance = this.instances.get(id);
    if (!instance) {
      return this.createError(
        "OBSERVER_NOT_FOUND",
        `Observer with id "${id}" not found`,
      );
    }

    instance.observer.disconnect();
    instance.isPaused = true;
    this.log(`Paused observer with id "${id}"`);
    return this.createSuccess();
  }

  private static handleResume(id: ObserverId): Result<void> {
    const instance = this.instances.get(id);
    if (!instance) {
      return this.createError(
        "OBSERVER_NOT_FOUND",
        `Observer with id "${id}" not found`,
      );
    }

    if (!instance.isPaused) {
      return this.createSuccess();
    }

    const targetValidation = this.validateTarget(instance.config.target, id);
    if (!targetValidation.success) return targetValidation;

    this.observe(id);
    instance.isPaused = false;
    this.log(`Resumed observer with id "${id}"`);
    return this.createSuccess();
  }

  private static observe(id: ObserverId): void {
    const instance = this.instances.get(id);
    if (instance?.config.target) {
      instance.observer.observe(instance.config.target, instance.config.config);
    }
  }

  private static createMutationHandler(
    id: ObserverId,
    config: DomObserverConfig,
  ): MutationCallback {
    const isEnergySavingMode =
      ExtensionLocalStorageService.getCachedSync().energySavingMode;

    const DEFAULT_DEBOUNCE_TIME = isEnergySavingMode ? 500 : 20;

    const throttleFn = isEnergySavingMode ? throttle : debounce;

    const throttledCallback = throttleFn(
      config.onMutation,
      config.debounceTime ?? DEFAULT_DEBOUNCE_TIME,
      isEnergySavingMode ? {} : { leading: false, trailing: true },
    );

    throttledCallback?.();

    return throttledCallback;
  }

  private static log(message: string): void {
    if (this.isLogging) {
      console.log(`[DomObserver] ${message}`);
    }
  }

  // Public API
  public static create(
    id: ObserverId,
    config: DomObserverConfig,
  ): Result<void> {
    return this.handleOperation({ type: "create", id, config });
  }

  public static update(
    id: ObserverId,
    config: Partial<DomObserverConfig>,
  ): Result<void> {
    return this.handleOperation({ type: "update", id, config });
  }

  public static destroy(id: ObserverId): Result<void> {
    return this.handleOperation({ type: "destroy", id });
  }

  public static destroyAll(): void {
    this.instances.forEach((_, id) => this.destroy(id));
  }

  public static pause(id: ObserverId): Result<void> {
    return this.handleOperation({ type: "pause", id });
  }

  public static pauseAll(): void {
    this.instances.forEach((_, id) => this.pause(id));
  }

  public static resume(id: ObserverId): Result<void> {
    return this.handleOperation({ type: "resume", id });
  }

  public static enableLogging(): void {
    this.isLogging = true;
  }

  public static disableLogging(): void {
    this.isLogging = false;
  }
}
