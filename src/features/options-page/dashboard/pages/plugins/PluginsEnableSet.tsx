import isEqual from "lodash/isEqual";
import { ComponentProps, ComponentType, SVGProps } from "react";
import { LuArrowRight, LuCheck, LuRocket, LuZap } from "react-icons/lu";
import { useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import {
  ALL_PLUGINS,
  ESSENTIALS_ONLY,
  POWER_USER,
} from "@/features/options-page/dashboard/pages/plugins/predefined-configs";
import { ExtensionLocalStorage } from "@/services/extension-local-storage/extension-local-storage.types";
import { DEFAULT_STORAGE } from "@/services/extension-local-storage/storage-defaults";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function PluginsEnableSet() {
  const { settings } = useExtensionLocalStorage();

  const [searchParams] = useSearchParams();

  const isDefaultSettings = useMemo(
    () => isEqual(settings?.plugins, DEFAULT_STORAGE.plugins),
    [settings],
  );

  const [open, setOpen] = useState(
    searchParams.get("from") === "onboarding" && isDefaultSettings,
  );

  return (
    <Dialog
      unmountOnExit
      lazyMount
      open={open}
      onOpenChange={({ open }) => setOpen(open)}
    >
      <DialogTrigger asChild>
        <Button variant="link" className="tw-p-0">
          Don&apos;t know where to start? Try presets!
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Plugin Presets</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Predefined sets of plugins to help you get started.
        </DialogDescription>

        {!isDefaultSettings && (
          <div className="tw-flex tw-flex-col tw-gap-2">
            <div className="tw-text-sm tw-text-muted-foreground">
              We noticed that you have modified the plugins settings. Presets
              will override your current settings. Please make sure to save your
              current settings before applying.
            </div>
          </div>
        )}

        <div className="tw-flex tw-flex-col tw-gap-2">
          <PresetButton
            label="Essentials Only"
            LabelIcon={LuCheck}
            description="You are new to Perplexity and using the extension for the first time."
            config={ESSENTIALS_ONLY}
            className="tw-border-primary/50"
            onComplete={() => setOpen(false)}
          />
          <PresetButton
            label="Power User"
            LabelIcon={LuZap}
            description="You have used Perplexity for a while and want to make the most out of it."
            config={POWER_USER}
            className="tw-border-primary/50"
            onComplete={() => setOpen(false)}
          />
          <PresetButton
            label="YOLO"
            LabelIcon={LuRocket}
            description="Enable all plugins without knowing what they do is NOT recommended. Please start exploring them first."
            config={ALL_PLUGINS}
            onComplete={() => setOpen(false)}
          />
        </div>

        <div className="tw-text-sm tw-text-muted-foreground">
          There are many plugins that depend on personal preferences. Feel free
          to test and enable them as you see fit.
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PresetButton({
  label,
  LabelIcon,
  description,
  config,
  onComplete,
  className,
  ...props
}: {
  label: string;
  LabelIcon: ComponentType<SVGProps<SVGSVGElement>>;
  description: string;
  config: ExtensionLocalStorage["plugins"];
  onComplete: () => void;
} & ComponentProps<"button">) {
  const { mutation } = useExtensionLocalStorage();

  return (
    <Dialog lazyMount unmountOnExit>
      <DialogTrigger asChild>
        <button
          className={cn(
            "tw-group tw-flex tw-flex-col tw-rounded-lg tw-border tw-border-border/50 tw-bg-secondary tw-p-4 tw-text-left tw-transition-all hover:tw-border-primary hover:tw-bg-primary/10",
            className,
          )}
          {...props}
        >
          <div className="tw-flex tw-w-full tw-items-center tw-justify-between tw-gap-2">
            <div className="tw-flex tw-items-center tw-gap-2">
              <LabelIcon className="group-hover:tw-text-primary" />
              <div className="tw-text-lg group-hover:tw-text-primary">
                {label}
              </div>
            </div>
            <LuArrowRight className="tw-hidden tw-animate-in tw-fade-in tw-spin-in-90 group-hover:tw-block" />
          </div>
          <div className="tw-text-sm tw-text-muted-foreground">
            {description}
          </div>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply Plugin Preset</DialogTitle>
        </DialogHeader>
        Are you sure you want to apply the &quot;{label}&quot; preset?
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose
            asChild
            onClick={() => {
              mutation.mutate((draft) => {
                draft.plugins = config;
              });
              toast({
                description: `✅ Preset "${label}" applied successfully!`,
              });
              onComplete();
            }}
          >
            <Button>Apply</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
