import { DialogOpenChangeDetails } from "@ark-ui/react";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { PLUGINS_METADATA } from "@/data/consts/plugins/plugins-data";
import { PLUGIN_DIALOG_CONTENT } from "@/features/options-page/dashboard/pages/plugins/dialog-content";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { PluginId } from "@/services/extension-local-storage/plugins.types";

type PluginDetailsModalProps = {
  pluginId: PluginId;
};

export default function PluginDetailsModal({
  pluginId,
}: PluginDetailsModalProps) {
  const navigate = useNavigate();
  const { isMobile } = useIsMobileStore();

  const handleClose = ({ open }: DialogOpenChangeDetails) => {
    if (!open) {
      navigate("/plugins");
    }
  };

  const DialogComp = isMobile ? Sheet : Dialog;
  const DialogContentComp = isMobile ? SheetContent : DialogContent;

  return (
    <DialogComp open onOpenChange={handleClose}>
      <DialogContentComp
        className="tw-max-w-max"
        side={isMobile ? "bottom" : undefined}
      >
        <DialogHeader>
          <DialogTitle>{PLUGINS_METADATA[pluginId].title}</DialogTitle>
          <DialogDescription>
            {PLUGINS_METADATA[pluginId].description}
          </DialogDescription>
        </DialogHeader>
        {PLUGIN_DIALOG_CONTENT[pluginId]}
      </DialogContentComp>
    </DialogComp>
  );
}
