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

export const QueryBoxContextProvider = ({
  children,
  store,
}: {
  children: ReactNode;
  store: typeof mainQueryBoxStore | typeof followUpQueryBoxStore;
}) => {
  const queryBoxStore = store();

  return (
    <ScopedQueryBoxContext value={queryBoxStore}>
      {children}
    </ScopedQueryBoxContext>
  );
};
