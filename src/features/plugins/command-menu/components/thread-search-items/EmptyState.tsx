import { CommandEmpty } from "@/components/ui/command";

type EmptyStateProps = {
  searchValue: string;
};

export function EmptyState({ searchValue }: EmptyStateProps) {
  return (
    <CommandEmpty>
      {searchValue.length ? (
        "No threads found."
      ) : (
        <span className="tw-text-muted-foreground">Start typing to search</span>
      )}
    </CommandEmpty>
  );
}
