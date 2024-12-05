import type { BundledTheme } from "shiki";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CODE_THEMES } from "@/data/plugins/code-highlighter/code-themes";

export default function CodeThemeSelector({
  value,
  onValueChange,
}: {
  value: BundledTheme;
  onValueChange: (value: BundledTheme) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      portal={false}
      positioning={{ placement: "bottom-start" }}
      open={open}
      onOpenChange={({ open }) => setOpen(open)}
    >
      <PopoverTrigger asChild>
        <Button variant="outline">{value}</Button>
      </PopoverTrigger>
      <PopoverContent className="tw-p-0">
        <Command>
          <CommandInput placeholder="Search theme..." />
          <CommandEmpty>No theme found.</CommandEmpty>
          <CommandList>
            {CODE_THEMES.map((theme) => (
              <CommandItem
                key={theme}
                onSelect={() => {
                  onValueChange(theme);
                  setOpen(false);
                }}
              >
                {theme}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
