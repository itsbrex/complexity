/* eslint-disable react-refresh/only-export-components */
import { ReactNode, createContext } from "react";

import {
  followUpQueryBoxStore,
  mainQueryBoxStore,
  ScopedQueryBoxStore,
} from "@/features/plugins/query-box/scoped-store";

export const ScopedQueryBoxContext = createContext<ScopedQueryBoxStore | null>(
  null,
);

const QueryBoxContextProvider = ({
  children,
  store,
}: {
  children: ReactNode;
  store: typeof mainQueryBoxStore | typeof followUpQueryBoxStore;
}) => {
  const queryBoxStore = store();

  return (
    <ScopedQueryBoxContext.Provider value={queryBoxStore}>
      {children}
    </ScopedQueryBoxContext.Provider>
  );
};

export const MainQueryBoxContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => (
  <QueryBoxContextProvider store={mainQueryBoxStore}>
    {children}
  </QueryBoxContextProvider>
);

export const FollowUpQueryBoxContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => (
  <QueryBoxContextProvider store={followUpQueryBoxStore}>
    {children}
  </QueryBoxContextProvider>
);
