import { threadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";
import styles from "@/plugins/drag-n-drop-file-to-upload-in-thread/styles.css?inline";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";
import { UiUtils } from "@/utils/ui-utils";
import { insertCss } from "@/utils/utils";

const DRAGOVER_EVENT = "dragover.cplx-file-upload";
const DROP_EVENT = "drop.cplx-file-upload";
const DRAGLEAVE_EVENT = "dragleave.cplx-file-upload";
const DRAGENTER_EVENT = "dragenter.cplx-file-upload";

let removeCss: (() => void) | null = null;
let $overlay: JQuery<HTMLElement> | null = null;

export function setupDragNDropFileToUploadInThread() {
  if (
    !PluginsStatesService.getEnableStatesCachedSync()[
      "thread:dragAndDropFileToUploadInThread"
    ]
  )
    return;

  const cleanup = ($wrapper: JQuery<HTMLElement> | null) => {
    $overlay?.remove();
    removeCss?.();

    if ($wrapper)
      $wrapper.removeAttr(INTERNAL_ATTRIBUTES.THREAD.ATTACHMENT_DROP_ZONE);
  };

  threadDomObserverStore.subscribe(
    (store) => store.$wrapper,
    ($wrapper) => {
      cleanup($wrapper);

      if (!$wrapper || !$wrapper.length) return;

      if (
        !$wrapper.length ||
        $wrapper.attr(INTERNAL_ATTRIBUTES.THREAD.ATTACHMENT_DROP_ZONE)
      )
        return;

      $wrapper.attr(INTERNAL_ATTRIBUTES.THREAD.ATTACHMENT_DROP_ZONE, "true");

      removeCss = insertCss({
        css: styles,
        id: "cplx-drag-n-drop-file-to-upload-in-thread",
      });

      $overlay = $(`
    <div data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.ATTACHMENT_DROP_ZONE}" class="cplx-file-upload-overlay">
      <div class="cplx-file-upload-overlay__content">
        <div>${t("plugin-drag-n-drop-file-to-upload-in-thread:dropZone.message")}</div>
      </div>
    </div>
  `).appendTo("body");

      let dragCounter = 0;

      $wrapper.on(DRAGENTER_EVENT, function (e) {
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

      $wrapper.on(DRAGOVER_EVENT, function (e) {
        const filesTypes = (e as JQuery.DragEvent).originalEvent?.dataTransfer
          ?.types;
        if (filesTypes?.length == null || !filesTypes.includes("Files")) return;

        e.preventDefault();
        e.stopPropagation();
      });

      $wrapper.on(DRAGLEAVE_EVENT, function (e) {
        e.preventDefault();
        e.stopPropagation();

        dragCounter--;
        if (dragCounter <= 0) {
          dragCounter = 0;
          $overlay?.removeClass("active");
        }
      });

      $wrapper.on(DROP_EVENT, function (e) {
        const files = (e as JQuery.DragEvent).originalEvent?.dataTransfer
          ?.files;

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
    },
  );
}

csLoaderRegistry.register({
  id: "plugin:thread:dragAndDropFileToUploadInThread",
  dependencies: ["cache:pluginsStates"],
  loader: () => {
    setupDragNDropFileToUploadInThread();
  },
});
