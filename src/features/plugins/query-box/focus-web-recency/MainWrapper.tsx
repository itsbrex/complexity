import {
  allowFocusModes,
  RECENCIES,
} from "@/data/plugins/focus-selector/focus-web-recency";
import FocusWebRecencySelector from "@/features/plugins/query-box/focus-web-recency/FocusWebRecencySelector";
import { useSharedQueryBoxStore } from "@/features/plugins/query-box/shared-store";

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
