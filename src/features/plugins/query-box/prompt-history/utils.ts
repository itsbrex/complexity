import { getPromptHistoryService } from "@/services/indexed-db/prompt-history/prompt-history";
import UiUtils from "@/utils/UiUtils";

let lastUrl = window.location.pathname;

export const handlePromptSave = async (params?: {
  promptString?: string;
  url?: string;
  type?: "hard" | "soft";
}) => {
  if (params?.type === "soft" && lastUrl === params.url) {
    return;
  }

  lastUrl = params?.url ?? window.location.pathname;

  let prompt = params?.promptString;

  if (!params?.promptString) {
    const $activeQueryBox = UiUtils.getActiveQueryBoxTextarea();

    if (!$activeQueryBox.length) return;

    prompt = $activeQueryBox[0].value;
  }

  if (prompt == null || prompt?.length === 0) return;

  console.log("Saving unsubmitted prompt:", prompt);

  await getPromptHistoryService().deduplicateAdd(prompt);
};
