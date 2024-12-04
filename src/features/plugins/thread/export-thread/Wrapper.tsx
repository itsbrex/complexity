import { Portal } from "@/components/ui/portal";
import ExportButton from "@/features/plugins/thread/export-thread/ExportButton";
import hideOpenInAppBtnCss from "@/features/plugins/thread/export-thread/hide-open-in-app-btn.css?inline";
import useObserver from "@/features/plugins/thread/export-thread/useObserver";
import { useInsertCss } from "@/hooks/useInsertCss";

export default function ExportThreadWrapper() {
  const portalContainer = useObserver();

  useInsertCss({
    id: "hide-open-in-app-btn",
    css: hideOpenInAppBtnCss,
  });

  return (
    <Portal container={portalContainer}>
      <ExportButton />
    </Portal>
  );
}
