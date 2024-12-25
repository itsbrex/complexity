import { ComponentType, SVGProps } from "react";
import { LuCpu, LuGlobe } from "react-icons/lu";

import PplxSpace from "@/components/icons/PplxSpace";
import { slashCommandMenuStore } from "@/features/plugins/query-box/slash-command-menu/store";
import { CsLoaderRegistry } from "@/services/cs-loader-registry";
import { TEST_ID_SELECTORS } from "@/utils/dom-selectors";
import { QueryBoxType } from "@/utils/UiUtils.types";

const ACTION_ITEMS_IDS = [
  "changeFocusMode",
  "changeModel",
  "searchSpaces",
] as const;

type ActionItemId = (typeof ACTION_ITEMS_IDS)[number];

export type CommandActionItem = {
  id: ActionItemId;
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
        id: "changeFocusMode",
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
        id: "changeModel",
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
        id: "searchSpaces",
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

export function getActionItems(queryBoxType: QueryBoxType) {
  switch (queryBoxType) {
    case "main":
      return ACTION_ITEMS;
    case "main-modal":
      return ACTION_ITEMS.filter((item) =>
        (["changeFocusMode", "changeModel"] as ActionItemId[]).includes(
          item.id,
        ),
      );
    case "space":
      return ACTION_ITEMS.filter((item) =>
        (["changeModel", "searchSpaces"] as ActionItemId[]).includes(item.id),
      );
    case "follow-up":
      return ACTION_ITEMS.filter((item) =>
        (["changeModel"] as ActionItemId[]).includes(item.id),
      );
  }
}
