import { CommandEmpty } from "@/components/ui/command";

type EmptyStateProps = {
  searchValue: string;
};

export function EmptyState({ searchValue }: EmptyStateProps) {
  return (
    <CommandEmpty>
      {searchValue.length ? (
        t("plugin-command-menu:commandMenu.threadSearch.empty.withSearch")
      ) : (
        <span className="tw-text-muted-foreground">
          {t(
            "plugin-command-menu:commandMenu.threadSearch.empty.withoutSearch",
          )}
        </span>
      )}
    </CommandEmpty>
  );
}
