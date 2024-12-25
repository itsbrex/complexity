import { QueryBoxType } from "@/data/plugins/query-box/types";
import PromptHistoryFilterItem from "@/features/plugins/query-box/slash-command-menu/components/filter-items/PromptHistory";

const FILTER_MODES = ["promptHistory"] as const;

export type FilterMode = (typeof FILTER_MODES)[number];

export default function FilterItems({
  queryBoxType,
}: {
  queryBoxType: QueryBoxType;
}) {
  return (
    <>
      <PromptHistoryFilterItem queryBoxType={queryBoxType} />
    </>
  );
}
