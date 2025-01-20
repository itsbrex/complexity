import { isValidVersionString } from "@/utils/utils";

export class ExtensionVersion {
  private version: string;

  constructor(version: string) {
    this.version = version;
  }

  public getVersion(): string {
    return this.version;
  }

  public isNewerThan(version: string): boolean {
    return this.compareVersions(this.version, version) > 0;
  }

  public isOlderThan(version: string): boolean {
    return this.compareVersions(this.version, version) < 0;
  }

  public isEqualTo(version: string): boolean {
    return this.compareVersions(this.version, version) === 0;
  }

  public isNewerThanOrEqualTo(version: string): boolean {
    return !this.isOlderThan(version);
  }

  public isOlderThanOrEqualTo(version: string): boolean {
    return !this.isNewerThan(version);
  }

  /**
   * Compares two version strings.
   * @param {string} v1 - The first version string.
   * @param {string} v2 - The second version string.
   * @returns {number} Returns `1` if `v1` is greater, `-1` if `v2` is greater, or `0` if they are equal.
   */
  private compareVersions(v1: string, v2: string): number {
    if (!isValidVersionString(v1) || !isValidVersionString(v2))
      throw new Error("Invalid version string");

    const v1Parts = v1.split(".").map(Number);
    const v2Parts = v2.split(".").map(Number);

    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const part1 = v1Parts[i] ?? 0;
      const part2 = v2Parts[i] ?? 0;

      if (part1 !== part2) {
        return part1 > part2 ? 1 : -1;
      }
    }

    return 0;
  }
}
