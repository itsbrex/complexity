import * as path from "path";

import type { Plugin } from "vite";

// Create a global state to track which files have triggered a reload
const reloadedFiles = new Set<string>();

export function clearReloadedFile(file: string) {
  setTimeout(() => {
    reloadedFiles.delete(file);
  }, 100); // Clear after a short delay
}

export function markFileAsReloaded(file: string) {
  reloadedFiles.add(file);
}

export function hasFileBeenReloaded(file: string) {
  return reloadedFiles.has(file);
}

export default function vitePluginReloadOnDynamicallyInjectedStyleChanges(options?: {
  excludeString?: string[];
}): Plugin {
  const dynamicStyleImports = new Set<string>();
  let root: string;
  const excludePatterns = options?.excludeString || [];

  return {
    name: "reload-on-style-changes",
    enforce: "post",

    configResolved(config) {
      root = config.root;
    },

    transform(code, id) {
      if (id.endsWith(".ts") || id.endsWith(".tsx")) {
        const dynamicStyleImportRegex =
          /import\(['"](.*?\.(scss|sass|css)(?:\?(?:inline|raw))?)['"]\)/g;
        const staticStyleImportRegex =
          /import\s+.*?\s+from\s+['"](.*?\.(scss|sass|css)(?:\?(?:inline|raw))?)['"]/g;

        const dynamicMatches = [...code.matchAll(dynamicStyleImportRegex)];
        const staticMatches = [...code.matchAll(staticStyleImportRegex)];
        const allMatches = [...dynamicMatches, ...staticMatches];

        allMatches.forEach((match) => {
          const importPath = match[1].split("?")[0];
          let absolutePath;

          // Handle @ alias
          if (importPath.startsWith("@/")) {
            // Check if the import should be excluded
            if (excludePatterns.some((pattern) => importPath === pattern)) {
              return;
            }
            absolutePath = path.resolve(root, "src", importPath.slice(2));
          } else {
            absolutePath = path.resolve(path.dirname(id), importPath);
          }

          dynamicStyleImports.add(absolutePath);
        });
      }
      return null;
    },

    handleHotUpdate({ file, server }) {
      const normalizedChangedFile = path.normalize(file);

      // Skip if already handled by force-restart plugin
      if (hasFileBeenReloaded(normalizedChangedFile)) {
        return;
      }

      const isWatched = Array.from(dynamicStyleImports).some((watchedFile) => {
        const normalizedWatchedFile = path.normalize(watchedFile);
        return normalizedChangedFile === normalizedWatchedFile;
      });

      if (isWatched) {
        console.log("[reload-on-style-changes] Triggering reload for:", file);
        markFileAsReloaded(normalizedChangedFile);
        server.ws.send({ type: "full-reload" });
        clearReloadedFile(normalizedChangedFile);
        return [];
      }
    },
  };
}
