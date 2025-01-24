import { Portal } from "@/components/ui/portal";
import { useInsertCss } from "@/hooks/useInsertCss";
import ExportButton from "@/plugins/export-thread/ExportButton";
import hideOpenInAppBtnCss from "@/plugins/export-thread/hide-open-in-app-btn.css?inline";
import useObserver from "@/plugins/export-thread/useObserver";

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
