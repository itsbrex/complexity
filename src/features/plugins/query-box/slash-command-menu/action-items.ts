import { ComponentType, SVGProps } from "react";
import { LuCpu } from "react-icons/lu";

import PplxSpace from "@/components/icons/PplxSpace";
import { slashCommandMenuStore } from "@/features/plugins/query-box/slash-command-menu/store";
import { TEST_ID_SELECTORS } from "@/utils/dom-selectors";

export type CommandActionItem = {
  label: string;
  Icon?: ComponentType<SVGProps<SVGSVGElement>>;
  description?: string;
  command: string;
  keywords?: string[];
  action: (params?: { textarea?: HTMLTextAreaElement | null }) => void;
};

export const ACTION_ITEMS: CommandActionItem[] = [
  {
    label: "Change language model",
    Icon: LuCpu,
    command: "m",
    action: () => {
      slashCommandMenuStore.getState().queryBoxAction.deleteTriggerWord();
      $(
        `[data-testid=${TEST_ID_SELECTORS.QUERY_BOX.LANGUAGE_MODEL_SELECTOR}] button:last`,
      ).trigger("click");
    },
  },
  {
    label: "Search & Navigate Spaces",
    Icon: PplxSpace,
    command: "s",
    action: () => {
      slashCommandMenuStore.getState().queryBoxAction.deleteTriggerWord();
      $(
        `[data-testid=${TEST_ID_SELECTORS.QUERY_BOX.SPACE_NAVIGATOR}]:last`,
      ).trigger("click");
    },
  },
];
