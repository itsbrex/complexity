import { LuLeafyGreen } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
          <Button onClick={() => navigate("/permissions")}>
            Manage Permissions
          </Button>
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="Miscellaneous">
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
    </div>
  );
}
