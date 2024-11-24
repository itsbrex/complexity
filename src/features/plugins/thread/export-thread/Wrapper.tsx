import { Portal } from "@/components/ui/portal";
import ExportButton from "@/features/plugins/thread/export-thread/ExportButton";
import useObserver from "@/features/plugins/thread/export-thread/useObserver";

export default function ExportThreadWrapper() {
  const portalContainer = useObserver();

  return (
    <Portal container={portalContainer}>
      <ExportButton />
    </Portal>
  );
}
