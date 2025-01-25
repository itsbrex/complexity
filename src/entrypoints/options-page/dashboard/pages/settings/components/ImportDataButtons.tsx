import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ExtensionData } from "@/data/dashboard/extension-data.types";
import ImportDataPasteDialogWrapper from "@/entrypoints/options-page/dashboard/pages/settings/components/ImportDataPasteDialogWrapper";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { db } from "@/services/indexed-db";
import { errorWrapper } from "@/utils/error-wrapper";

export default function ImportDataButtons() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportData = async (data: string) => {
    const [, error] = await errorWrapper(async () => {
      const parsedData = JSON.parse(data) as ExtensionData;
      await ExtensionLocalStorageService.import(parsedData.localStorage);
      db.import(parsedData.db);
    })();

    if (!error) {
      toast({
        title: "✅ Data imported",
      });
    } else {
      console.error(error);
      toast({
        title: "❌ Invalid data",
      });
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await handleImportData(await file.text());
    } catch (error) {
      console.error(error);
      toast({
        title: "❌ Failed to read file",
      });
    }

    event.target.value = "";
  };

  return (
    <div className="x-flex x-gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="x-hidden"
        onChange={handleFileChange}
      />
      <ImportDataPasteDialogWrapper onSubmit={handleImportData}>
        <Button variant="outline">Paste as text</Button>
      </ImportDataPasteDialogWrapper>
      <Button onClick={handleChooseFile}>Choose file</Button>
    </div>
  );
}
