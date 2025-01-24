import {
  allowFocusModes,
  RECENCIES,
} from "@/data/plugins/better-focus-selector/focus-web-recency";
import { useSharedQueryBoxStore } from "@/plugins/_core/ui-groups/query-box/shared-store";
import FocusWebRecencySelector from "@/plugins/focus-web-recency/FocusWebRecencySelector";

export default function FocusWebRecencySelectorMainWrapper() {
  const { selectedRecency, setSelectedRecency, selectedFocusMode } =
    useSharedQueryBoxStore((state) => ({
      selectedRecency: state.selectedRecency,
      setSelectedRecency: state.setSelectedRecency,
      selectedFocusMode: state.selectedFocusMode,
    }));

  if (!allowFocusModes.includes(selectedFocusMode)) return null;

  const recencyData =
    RECENCIES.find((mode) => mode.value === selectedRecency) ?? RECENCIES[0]!;

  return (
    <FocusWebRecencySelector
      value={selectedRecency}
      setValue={setSelectedRecency}
      recencyData={recencyData}
    />
  );
}
