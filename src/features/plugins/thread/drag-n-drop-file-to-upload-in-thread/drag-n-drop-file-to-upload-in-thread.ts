import styles from "@/features/plugins/thread/drag-n-drop-file-to-upload-in-thread/drag-n-drop-file-to-upload-in-thread.css?inline";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
import UiUtils from "@/utils/UiUtils";
import { insertCss, whereAmI } from "@/utils/utils";

const OBSERVER_ID = "cplx-drag-n-drop-file-to-upload-in-thread";
const DRAGOVER_EVENT = "dragover.cplx-file-upload";
const DROP_EVENT = "drop.cplx-file-upload";
const DRAGLEAVE_EVENT = "dragleave.cplx-file-upload";
const DRAGENTER_EVENT = "dragenter.cplx-file-upload";

let removeCss: (() => void) | null = null;
let $overlay: JQuery<HTMLElement> | null = null;

export async function setupDragNDropFileToUploadInThread(
  location: ReturnType<typeof whereAmI>,
) {
  if (
    !PluginsStatesService.getCachedSync()?.pluginsEnableStates?.[
      "thread:dragAndDropFileToUploadInThread"
    ]
  )
    return;

  const cleanup = () => {
    $overlay?.remove();

    removeCss?.();

    $threadWrapper
      .off(DRAGENTER_EVENT)
      .off(DRAGOVER_EVENT)
      .off(DROP_EVENT)
      .off(DRAGLEAVE_EVENT);
    $(`#${OBSERVER_ID}`).remove();

    $threadWrapper.removeAttr(OBSERVER_ID);
  };

  const $threadWrapper = UiUtils.getThreadWrapper();

  if (location !== "thread") return cleanup();

  if (!$threadWrapper.length || $threadWrapper.attr(OBSERVER_ID)) return;

  $threadWrapper.attr(OBSERVER_ID, "true");

  removeCss = insertCss({
    css: styles,
    id: "cplx-drag-n-drop-file-to-upload-in-thread",
  });

  $overlay = $(`
    <div id="${OBSERVER_ID}" class="cplx-file-upload-overlay">
      <div class="cplx-file-upload-overlay__content">
        <div>${t("plugin-drag-n-drop-file-to-upload-in-thread:dropZone.message")}</div>
      </div>
    </div>
  `).appendTo("body");

  let dragCounter = 0;

  $threadWrapper.on(DRAGENTER_EVENT, function (e) {
    const filesTypes = (e as JQuery.DragEvent).originalEvent?.dataTransfer
      ?.types;
    if (filesTypes?.length == null || !filesTypes.includes("Files")) return;

    e.preventDefault();
    e.stopPropagation();

    dragCounter++;
    if (dragCounter === 1) {
      $overlay?.addClass("active");
    }
  });

  $threadWrapper.on(DRAGOVER_EVENT, function (e) {
    const filesTypes = (e as JQuery.DragEvent).originalEvent?.dataTransfer
      ?.types;
    if (filesTypes?.length == null || !filesTypes.includes("Files")) return;

    e.preventDefault();
    e.stopPropagation();
  });

  $threadWrapper.on(DRAGLEAVE_EVENT, function (e) {
    e.preventDefault();
    e.stopPropagation();

    dragCounter--;
    if (dragCounter <= 0) {
      dragCounter = 0;
      $overlay?.removeClass("active");
    }
  });

  $threadWrapper.on(DROP_EVENT, function (e) {
    const files = (e as JQuery.DragEvent).originalEvent?.dataTransfer?.files;

    if (files?.length == null) return;

    e.preventDefault();
    e.stopPropagation();

    $overlay?.removeClass("active");
    dragCounter = 0;

    const $queryBox = UiUtils.getActiveQueryBox({ type: "follow-up" });
    if (!$queryBox.length) return;

    const $fileInput = $queryBox.find('input[type="file"]');
    if (!$fileInput.length) return;

    const dataTransfer = new DataTransfer();
    Array.from(files).forEach((file) => dataTransfer.items.add(file));

    $fileInput.prop("files", dataTransfer.files);
    $fileInput[0].dispatchEvent(new Event("change", { bubbles: true }));
  });
}
