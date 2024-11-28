import { createContext, useContext, useState, ReactNode } from "react";

import { type PluginTagValues } from "@/data/plugins/plugins-data";

export type PluginFilters = {
  tags: PluginTagValues[];
  excludeTags: PluginTagValues[];
  searchTerm: string;
};

const defaultFilters: PluginFilters = {
  tags: [],
  excludeTags: [],
  searchTerm: "",
};

type PluginContextType = [
  PluginFilters,
  React.Dispatch<React.SetStateAction<PluginFilters>>,
];

const PluginContext = createContext<PluginContextType>([
  defaultFilters,
  () => {},
]);

export function PluginProvider({ children }: { children: ReactNode }) {
  const state = useState<PluginFilters>(defaultFilters);

  return (
    <PluginContext.Provider value={state}>{children}</PluginContext.Provider>
  );
}

export const usePluginContext = () => useContext(PluginContext);
