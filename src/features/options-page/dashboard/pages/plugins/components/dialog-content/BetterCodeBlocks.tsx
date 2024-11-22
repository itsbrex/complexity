import type { BundledTheme } from "shiki";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { CODE_THEMES } from "@/data/consts/plugins/code-highlighter/code-themes";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function BetterCodeBlocksDialogContent() {
  const { settings } = useExtensionLocalStorage();

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <Header />
      {settings?.plugins["thread:betterCodeBlocks"].enabled && <Options />}
    </div>
  );
}

function Options() {
  const { settings, mutation } = useExtensionLocalStorage();

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <div className="tw-flex tw-flex-col tw-gap-2">
        <Switch
          textLabel="Code theme"
          checked={settings?.plugins["thread:betterCodeBlocks"].theme.enabled}
          onCheckedChange={({ checked }) => {
            mutation.mutate((draft) => {
              draft.plugins["thread:betterCodeBlocks"].theme.enabled = checked;
            });
          }}
        />
        {settings?.plugins["thread:betterCodeBlocks"].theme.enabled && (
          <div className="tw-flex tw-w-full tw-gap-4">
            <div className="tw-flex tw-flex-col tw-gap-2">
              <div className="tw-text-sm tw-text-muted-foreground">Dark</div>
              <CodeThemeSelector colorScheme="dark" />
            </div>
            <div className="tw-flex tw-flex-col tw-gap-2">
              <div className="tw-text-sm tw-text-muted-foreground">Light</div>
              <CodeThemeSelector colorScheme="light" />
            </div>
          </div>
        )}
      </div>
      <div className="tw-flex tw-flex-col tw-gap-4">
        <Switch
          textLabel="Sticky header"
          checked={settings?.plugins["thread:betterCodeBlocks"].stickyHeader}
          onCheckedChange={({ checked }) => {
            mutation.mutate((draft) => {
              draft.plugins["thread:betterCodeBlocks"].stickyHeader = checked;
            });
          }}
        />
        <div className="tw-flex tw-flex-col tw-gap-2">
          <Switch
            textLabel="Unwrap lines by default"
            checked={
              settings?.plugins["thread:betterCodeBlocks"].unwrap.enabled
            }
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins["thread:betterCodeBlocks"].unwrap.enabled =
                  checked;
              });
            }}
          />
          <Switch
            textLabel="Show toggle button"
            className="tw-ml-8"
            checked={
              settings?.plugins["thread:betterCodeBlocks"].unwrap
                .showToggleButton
            }
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins[
                  "thread:betterCodeBlocks"
                ].unwrap.showToggleButton = checked;
              });
            }}
          />
        </div>
        <div className="tw-flex tw-flex-col tw-gap-2">
          <div className="tw-flex tw-gap-2">
            <Switch
              textLabel="Max height"
              checked={
                settings?.plugins["thread:betterCodeBlocks"].maxHeight?.enabled
              }
              onCheckedChange={({ checked }) => {
                mutation.mutate((draft) => {
                  draft.plugins["thread:betterCodeBlocks"].maxHeight.enabled =
                    checked;
                });
              }}
            />
            <div className="tw-flex tw-items-center tw-gap-2">
              <Input
                type="number"
                defaultValue={
                  settings?.plugins["thread:betterCodeBlocks"].maxHeight?.value
                }
                className="tw-w-[100px]"
                disabled={
                  !settings?.plugins["thread:betterCodeBlocks"].maxHeight?.enabled
                }
                onChange={(e) => {
                  if (Number(e.target.value) < 300) {
                    return;
                  }
                  mutation.mutate((draft) => {
                    draft.plugins["thread:betterCodeBlocks"].maxHeight.value =
                      Number(e.target.value);
                  });
                }}
              />
              <div className="tw-text-muted-foreground">px (&gt;= 300px)</div>
            </div>
          </div>
          <Switch
            textLabel="Show toggle button"
            className="tw-ml-8"
            checked={
              settings?.plugins["thread:betterCodeBlocks"].maxHeight
                ?.showToggleButton
            }
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins[
                  "thread:betterCodeBlocks"
                ].maxHeight.showToggleButton = checked;
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}

function Header() {
  const { settings, mutation } = useExtensionLocalStorage();

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-2">
        Customize the appearance and usability of code blocks.
      </div>
      <Switch
        textLabel="Enable"
        checked={settings?.plugins["thread:betterCodeBlocks"].enabled}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["thread:betterCodeBlocks"].enabled = checked;
          });
        }}
      />
    </>
  );
}

function CodeThemeSelector({ colorScheme }: { colorScheme: "dark" | "light" }) {
  const [open, setOpen] = useState(false);

  const { settings, mutation } = useExtensionLocalStorage();

  return (
    <Popover
      portal={false}
      positioning={{ placement: "bottom-start" }}
      open={open}
      onOpenChange={({ open }) => setOpen(open)}
    >
      <PopoverTrigger asChild>
        <Button variant="outline">
          {settings?.plugins["thread:betterCodeBlocks"].theme[colorScheme]}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="tw-p-0">
        <Command>
          <CommandInput placeholder="Search theme..." />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandList>
            {CODE_THEMES.map((theme) => (
              <CommandItem
                key={theme}
                onSelect={(value) => {
                  mutation.mutate((draft) => {
                    draft.plugins["thread:betterCodeBlocks"].theme[
                      colorScheme
                    ] = value as BundledTheme;
                  });

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
