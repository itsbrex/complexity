import { FaEllipsisH } from "react-icons/fa";
import { LuGithub, LuLeafyGreen, LuMail } from "react-icons/lu";
import { SiDiscord } from "react-icons/si";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import ClearAllDataButton from "@/features/options-page/dashboard/pages/settings/components/ClearAllDataButton";
import ExportDataButtons from "@/features/options-page/dashboard/pages/settings/components/ExportDataButtons";
import ImportDataButtons from "@/features/options-page/dashboard/pages/settings/components/ImportDataButtons";
import ManagePermissionsDialogWrapper from "@/features/options-page/dashboard/pages/settings/components/ManagePermissionsDialogWrapper";
import SettingsItem from "@/features/options-page/dashboard/pages/settings/SettingsItem";
import SettingsSection from "@/features/options-page/dashboard/pages/settings/SettingsSection";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { settings, mutation } = useExtensionLocalStorage();

  return (
    <div className="tw-mx-auto tw-max-w-3xl tw-space-y-8">
      <SettingsSection title="General">
        <SettingsItem title="Extension Permissions">
          <ManagePermissionsDialogWrapper>
            <Button>Manage Permissions</Button>
          </ManagePermissionsDialogWrapper>
        </SettingsItem>
        <SettingsItem
          title={
            <div className="tw-flex tw-items-center tw-gap-2">
              <LuLeafyGreen className="tw-text-success" />
              <span>Energy Saving Mode</span>
            </div>
          }
          description={
            <div>
              <div>Reduce the extension sensitivity to changes on the page</div>
              <div className="tw-text-sm tw-italic tw-text-muted-foreground">
                (Existing tabs require a refresh to apply)
              </div>
            </div>
          }
        >
          <Switch
            checked={settings?.energySavingMode}
            onCheckedChange={({ checked }) =>
              mutation.mutate((state) => (state.energySavingMode = checked))
            }
          />
        </SettingsItem>
        <SettingsItem
          title="Onboarding"
          description="Go through the onboarding experience again"
        >
          <Button onClick={() => navigate("/onboarding")}>🚀 Onboarding</Button>
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="Data">
        <SettingsItem title="Import" description="Load saved extension's data">
          <ImportDataButtons />
        </SettingsItem>
        <SettingsItem
          title="Export"
          description="Download extension's data as a file"
        >
          <ExportDataButtons />
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="Support">
        <SettingsItem
          title="Need assistance?"
          description="Get help from the community or email support"
        >
          <div className="tw-flex tw-items-center tw-gap-4">
            <Button asChild className="tw-w-max">
              <a
                href="https://discord.gg/fxzqdkwmWx"
                target="_blank"
                rel="noreferrer"
              >
                <SiDiscord className="tw-mr-2 tw-size-4" />
                <span>Discord</span>
              </a>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <FaEllipsisH />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild value="github">
                  <a
                    href="https://github.com/pnd280/complexity/issues"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LuGithub className="tw-mr-2 tw-size-4" />
                    <span>GitHub Issues</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild value="mail">
                  <a
                    href="mailto:pnd280@gmail.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LuMail className="tw-mr-2 tw-size-4" />
                    <span>pnd280@gmail.com</span>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="Troubleshooting">
        <SettingsItem title="Reset the extension">
          <ClearAllDataButton />
        </SettingsItem>
      </SettingsSection>
    </div>
  );
}
