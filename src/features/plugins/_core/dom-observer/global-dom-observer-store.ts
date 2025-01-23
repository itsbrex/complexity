import { WritableDraft } from "immer";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { CodeBlock, MessageBlock } from "@/utils/UiUtils.types";

export type ExtendedMessageBlock = MessageBlock & {
  title: string;
  isInFlight: boolean;
};

export type ExtendedCodeBlock = CodeBlock & {
  isInFlight: boolean;
};

type QueryBoxes = {
  mainQueryBox: HTMLElement | null;
  mainModalQueryBox: HTMLElement | null;
  spaceQueryBox: HTMLElement | null;
  followUpQueryBox: HTMLElement | null;
};

type HomeComponents = {
  slogan: HTMLElement | null;
  bottomBar: HTMLElement | null;
};

type ThreadComponents = {
  popper: HTMLElement | null;
  wrapper: HTMLElement | null;
  messageBlocks: ExtendedMessageBlock[] | null;
  navbar: HTMLElement | null;
  navbarChildren: HTMLElement[] | null;
  navbarHeight: number | null;
  messageBlockBottomBarHeight: number;
  messageBlockBottomBars: (HTMLElement | null)[] | null;
  codeBlocks: ExtendedCodeBlock[][] | null;
  queryHoverContainers: (HTMLElement | null)[] | null;
};

type SidebarComponents = {
  wrapper: HTMLElement | null;
  spaceButtonWrapper: HTMLElement | null;
};

type SpacesPageComponents = {
  spaceCards: HTMLElement[] | null;
};

type SettingsPageComponents = {
  topNavWrapper: HTMLElement | null;
};

type ComponentTypes = {
  queryBoxes: QueryBoxes;
  homeComponents: HomeComponents;
  threadComponents: ThreadComponents;
  sidebarComponents: SidebarComponents;
  spacesPageComponents: SpacesPageComponents;
  settingsPageComponents: SettingsPageComponents;
};

export type GlobalDomObserverStore = {
  [K in keyof ComponentTypes]: ComponentTypes[K];
} & {
  setQueryBoxes: (newQueryBoxes: Partial<QueryBoxes>) => void;
  setHomeComponents: (newHomeComponents: Partial<HomeComponents>) => void;
  setThreadComponents: (newThreadComponents: Partial<ThreadComponents>) => void;
  setSidebarComponents: (
    newSidebarComponents: Partial<SidebarComponents>,
  ) => void;
  setSpacesPageComponents: (
    newSpacesPageComponents: Partial<SpacesPageComponents>,
  ) => void;
  setSettingsPageComponents: (
    newSettingsPageComponents: Partial<SettingsPageComponents>,
  ) => void;
};

type GetSectionKey<T> = {
  [K in keyof ComponentTypes]: ComponentTypes[K] extends T ? K : never;
}[keyof ComponentTypes];

const createSectionSetter = <T extends ComponentTypes[keyof ComponentTypes]>(
  set: Parameters<Parameters<typeof immer>[0]>[0],
  get: () => GlobalDomObserverStore,
  sectionKey: GetSectionKey<T>,
) => {
  return (newValues: Partial<T>) => {
    Object.entries(newValues).forEach(([key, value]) => {
      const currentKey = key as keyof T;
      const currentSection = get()[sectionKey] as T;

      if (value !== undefined && value !== currentSection[currentKey]) {
        set((state: WritableDraft<GlobalDomObserverStore>) => {
          const section = state[sectionKey] as WritableDraft<T>;
          Object.assign(section, { ...section, [currentKey]: value });
        });
      }
    });
  };
};

export const globalDomObserverStore =
  createWithEqualityFn<GlobalDomObserverStore>()(
    subscribeWithSelector(
      immer(
        (set, get): GlobalDomObserverStore => ({
          queryBoxes: {
            mainQueryBox: null,
            mainModalQueryBox: null,
            spaceQueryBox: null,
            followUpQueryBox: null,
          },
          setQueryBoxes: createSectionSetter<QueryBoxes>(
            set,
            get,
            "queryBoxes",
          ),

          homeComponents: {
            slogan: null,
            bottomBar: null,
          },
          setHomeComponents: createSectionSetter<HomeComponents>(
            set,
            get,
            "homeComponents",
          ),

          threadComponents: {
            wrapper: null,
            popper: null,
            messageBlocks: null,
            navbar: null,
            navbarChildren: null,
            navbarHeight: null,
            messageBlockBottomBarHeight: 0,
            messageBlockBottomBars: null,
            codeBlocks: null,
            queryHoverContainers: null,
          },
          setThreadComponents: createSectionSetter<ThreadComponents>(
            set,
            get,
            "threadComponents",
          ),

          sidebarComponents: {
            wrapper: null,
            spaceButtonWrapper: null,
          },
          setSidebarComponents: createSectionSetter<SidebarComponents>(
            set,
            get,
            "sidebarComponents",
          ),

          spacesPageComponents: {
            spaceCards: null,
          },
          setSpacesPageComponents: createSectionSetter<SpacesPageComponents>(
            set,
            get,
            "spacesPageComponents",
          ),

          settingsPageComponents: {
            topNavWrapper: null,
          },
          setSettingsPageComponents:
            createSectionSetter<SettingsPageComponents>(
              set,
              get,
              "settingsPageComponents",
            ),
        }),
      ),
    ),
  );

export const useGlobalDomObserverStore = globalDomObserverStore;
