import { useMutation, useQuery } from "@tanstack/react-query";
import { LuLoaderCircle } from "react-icons/lu";
import { redirect, RouteObject, useNavigate } from "react-router-dom";
import { sendMessage } from "webext-bridge/content-script";

import AsyncButton from "@/components/AsyncButton";
import CopyButton from "@/components/CopyButton";
import CsUiPluginsGuard from "@/components/CsUiPluginsGuard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { PluginsStatesService } from "@/services/plugins-states/plugins-states";
import { PplxApiService } from "@/services/pplx-api/pplx-api";
import { fetchResource } from "@/utils/utils";

function CanvasPrePromptInstallationDialog() {
  const navigate = useNavigate();

  const {
    data: canvasInstructionClaudeMd,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["canvas", "instructions"],
    queryFn: () => {
      return fetchResource(
        `https://cdn.cplx.app/prompts/canvas-instruction-claude.md?t=${Date.now()}`,
      );
    },
  });

  const { mutateAsync: createSpace } = useMutation({
    mutationKey: ["createSpace"],
    mutationFn: PplxApiService.createSpace,
    onSuccess: (data) => {
      toast({
        title: `✅ "CPLX Canvas" Space installed`,
        description: "The Canvas Pre-Prompt has been installed as a Space.",
      });

      sendMessage(
        "spa-router:push",
        {
          url: `/collections/${data.slug}`,
        },
        "window",
      );
    },
    onError: () => {
      toast({
        title: `❌ Failed to install "CPLX Canvas" Space`,
      });
    },
    onSettled: () => {
      navigate("/");
    },
  });

  return (
    <Dialog
      defaultOpen={true}
      closeOnInteractOutside={false}
      closeOnEscape={false}
      onExitComplete={() => {
        navigate("/");
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Install Canvas Pre-Prompt as Space</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          You are about to install the Canvas Pre-Prompt as a Perplexity&apos;s
          Space. This will enable advanced features for the Canvas plugin.
        </DialogDescription>
        <div className="tw-flex tw-max-h-[80%] tw-flex-col tw-gap-2 tw-overflow-y-auto">
          <div className="tw-text-sm tw-text-muted-foreground">
            For reference, here is the prompt:
          </div>
          {canvasInstructionClaudeMd && (
            <div className="tw-max-h-[500px] tw-overflow-y-auto tw-whitespace-pre-line tw-rounded-md tw-border tw-border-border/50 tw-bg-secondary tw-p-4 tw-text-sm tw-text-secondary-foreground">
              <CopyButton
                className="tw-float-right"
                content={canvasInstructionClaudeMd}
              />
              {canvasInstructionClaudeMd}
            </div>
          )}
          {isFetching && !canvasInstructionClaudeMd && (
            <div className="tw-flex tw-flex-col tw-gap-2">
              <p className="tw-text-sm tw-text-muted-foreground">
                Fetching the Canvas Pre-Prompt, please wait...
              </p>
            </div>
          )}
          {isError && (
            <div className="tw-flex tw-flex-col tw-gap-2">
              <p className="tw-text-sm tw-text-muted-foreground">
                Failed to fetch the Canvas Pre-Prompt.
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <AsyncButton
            disabled={isFetching || !canvasInstructionClaudeMd}
            loadingText={
              <div className="tw-flex tw-items-center tw-gap-2">
                <LuLoaderCircle className="tw-animate-spin" />
                <span>Installing...</span>
              </div>
            }
            onClick={async () => {
              if (!canvasInstructionClaudeMd) {
                return;
              }

              await createSpace({
                title: "CPLX Canvas",
                description: "",
                emoji: "1f5bc-fe0f",
                instructions: canvasInstructionClaudeMd,
                model_selection: null,
              });
            }}
          >
            Install
          </AsyncButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const canvasPrePromptInstallationDialogRouterRoute: RouteObject = {
  path: "/cplx/canvas/install-pre-prompt-as-space",
  loader: () => {
    const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

    if (!pluginsEnableStates?.["thread:canvas"]) {
      return redirect("/");
    }

    return null;
  },
  element: (
    <CsUiPluginsGuard desktopOnly dependentPluginIds={["thread:canvas"]}>
      <CanvasPrePromptInstallationDialog />
    </CsUiPluginsGuard>
  ),
};
