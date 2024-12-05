import { useCallback } from "react";
import { LuCheck, LuLoader2 } from "react-icons/lu";

import AsyncButton from "@/components/AsyncButton";
import { Button } from "@/components/ui/button";
import { ExtensionData } from "@/data/dashboard/extension-data.types";
import useToggleButtonText from "@/hooks/useToggleButtonText";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { db as indexedDb } from "@/services/indexed-db/indexed-db";

export default function ExportDataButtons() {
  const [copyButtonText, toggleCopyButtonText] = useToggleButtonText({
    defaultText: "Copy",
  });

  const getExportData = useCallback(async (): Promise<string> => {
    await sleep(300);
    return JSON.stringify(
      {
        localStorage: await ExtensionLocalStorageService.exportAll(),
        db: await indexedDb.exportAll(),
      } satisfies ExtensionData,
      null,
      2,
    );
  }, []);

  const handleCopy = useCallback(async () => {
    const settings = await getExportData();
    await navigator.clipboard.writeText(settings);
    toggleCopyButtonText(
      <div className="tw-flex tw-items-center tw-gap-2">
        <LuCheck />
        <span>Copied</span>
      </div>,
    );
  }, [getExportData, toggleCopyButtonText]);

  const handleSaveAsFile = useCallback(async () => {
    try {
      const settings = await getExportData();
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: `complexity-settings-${new Date().toISOString()}.json`,
        types: [
          {
            description: "JSON File",
            accept: { "application/json": [".json"] },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(settings);
      await writable.close();
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Failed to save file:", error);
      }
    }
  }, [getExportData]);

  return (
    <div className="tw-flex tw-gap-4">
      <AsyncButton
        variant="outline"
        loadingText={
          <div className="tw-flex tw-items-center tw-gap-2">
            <LuLoader2 className="tw-animate-spin" />
            <span>Exporting</span>
          </div>
        }
        onClick={handleCopy}
      >
        {copyButtonText}
      </AsyncButton>
      <Button onClick={handleSaveAsFile}>Save as file</Button>
    </div>
  );
}
