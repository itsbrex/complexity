import { ComponentType, SVGProps } from "react";
import { LuCpu, LuGlobe } from "react-icons/lu";

import PplxSpace from "@/components/icons/PplxSpace";
import { slashCommandMenuStore } from "@/features/plugins/query-box/slash-command-menu/store";
import { CsLoaderRegistry } from "@/services/cs-loader-registry";
import { TEST_ID_SELECTORS } from "@/utils/dom-selectors";

export type CommandActionItem = {
  label: string;
  Icon?: ComponentType<SVGProps<SVGSVGElement>>;
  description?: string;
  command: string;
  keywords?: string[];
  action: (params?: { textarea?: HTMLTextAreaElement | null }) => void;
};

export let ACTION_ITEMS: CommandActionItem[] = [];

CsLoaderRegistry.register({
  id: "plugin:queryBox:slashCommandMenu:actionItems",
  dependencies: ["lib:i18next"],
  loader: () => {
    ACTION_ITEMS = [
      {
        label: t(
          "plugin-slash-command-menu:slashCommandMenu.actionItems.changeFocusMode.label",
        ),
        Icon: LuGlobe,
        command: "f",
        action: () => {
          slashCommandMenuStore.getState().queryBoxAction.deleteTriggerWord();
          $(
            `[data-testid=${TEST_ID_SELECTORS.QUERY_BOX.FOCUS_SELECTOR}] button:last`,
          ).trigger("click");
        },
      },
      {
        label: t(
          "plugin-slash-command-menu:slashCommandMenu.actionItems.changeModel.label",
        ),
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
        label: t(
          "plugin-slash-command-menu:slashCommandMenu.actionItems.searchSpaces.label",
        ),
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
  },
});
