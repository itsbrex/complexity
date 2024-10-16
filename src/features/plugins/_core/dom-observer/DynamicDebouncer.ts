const MIN_DEBOUNCE_TIME = 10;
const MAX_DEBOUNCE_TIME = 100;
const ACTIVITY_WINDOW = 1000; // 1 second window to measure activity
const ACTIVITY_THRESHOLD_LOW = 5; // mutations per second
const ACTIVITY_THRESHOLD_HIGH = 50; // mutations per second

export default class DynamicDebouncer {
  private static instance: DynamicDebouncer | null = null;
  private mutationTimestamps: number[] = [];
  private currentDebounceTime: number = MIN_DEBOUNCE_TIME;

  private constructor() {}

  static getInstance(): DynamicDebouncer {
    if (!DynamicDebouncer.instance) {
      DynamicDebouncer.instance = new DynamicDebouncer();
    }
    return DynamicDebouncer.instance;
  }

  public recordMutations(count: number): void {
    const now = Date.now();
    // Add new mutations
    for (let i = 0; i < count; i++) {
      this.mutationTimestamps.push(now);
    }

    // Remove old timestamps outside the window
    const cutoff = now - ACTIVITY_WINDOW;
    this.mutationTimestamps = this.mutationTimestamps.filter(
      (t) => t >= cutoff,
    );

    // Update debounce time based on activity
    this.updateDebounceTime();
  }

  public getDebounceTime(): number {
    return this.currentDebounceTime;
  }

  private updateDebounceTime(): void {
    const mutationsPerSecond = this.mutationTimestamps.length;

    if (mutationsPerSecond <= ACTIVITY_THRESHOLD_LOW) {
      this.currentDebounceTime = MIN_DEBOUNCE_TIME;
    } else if (mutationsPerSecond >= ACTIVITY_THRESHOLD_HIGH) {
      this.currentDebounceTime = MAX_DEBOUNCE_TIME;
    } else {
      // Linear interpolation between min and max
      const activityRange = ACTIVITY_THRESHOLD_HIGH - ACTIVITY_THRESHOLD_LOW;
      const debounceRange = MAX_DEBOUNCE_TIME - MIN_DEBOUNCE_TIME;
      const ratio =
        (mutationsPerSecond - ACTIVITY_THRESHOLD_LOW) / activityRange;
      this.currentDebounceTime = MIN_DEBOUNCE_TIME + ratio * debounceRange;
    }
  }
}
