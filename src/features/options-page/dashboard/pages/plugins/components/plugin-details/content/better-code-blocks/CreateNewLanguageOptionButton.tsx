import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { LuPlus } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { BetterCodeBlockFineGrainedOptions } from "@/data/dashboard/better-code-blocks/better-code-blocks-options.types";
import { getBetterCodeBlocksOptionsService } from "@/services/indexed-db/better-code-blocks/better-code-blocks";
import { betterCodeBlocksFineGrainedOptionsQueries } from "@/services/indexed-db/better-code-blocks/query-keys";
import { queryClient } from "@/utils/ts-query-client";

export default function CreateNewLanguageOptionButton() {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState("");

  const mutation = useMutation({
    mutationKey: ["better-code-block-options", "create", language],
    mutationFn: async ({ language }: { language: string }) => {
      if (!language)
        return toast({
          title: "No language/block name provided",
        });

      const options: BetterCodeBlockFineGrainedOptions = {
        language,
        stickyHeader: false,
        theme: {
          enabled: false,
          dark: "dark-plus",
          light: "light-plus",
        },
        unwrap: {
          enabled: false,
          showToggleButton: false,
        },
        maxHeight: {
          enabled: false,
          showToggleButton: false,
          value: 500,
        },
        placeholderText: {
          enabled: false,
          title: "",
          idle: "",
          loading: "",
        },
      };

      await getBetterCodeBlocksOptionsService().add(options);
    },
    onSuccess: () => {
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "❌ Failed to create new language option",
        description: error.message,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: betterCodeBlocksFineGrainedOptionsQueries.list.queryKey,
        exact: true,
      });
      setLanguage("");
    },
  });

  const handleSubmit = () => {
    if (!language) return;
    mutation.mutate({ language });
  };

  return (
    <Dialog
      unmountOnExit
      open={open}
      onOpenChange={({ open }) => setOpen(open)}
    >
      <Tooltip content="Add new rule">
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <LuPlus />
          </Button>
        </DialogTrigger>
      </Tooltip>
      <DialogContent portal={false}>
        <DialogHeader>Fine-tune specific block</DialogHeader>
        <Input
          value={language}
          className="tw-font-mono"
          placeholder="Language/Block name"
          onChange={({ target }) => setLanguage(target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={!language} onClick={handleSubmit}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
