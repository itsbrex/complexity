import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import SettingsItem from "@/features/options-page/dashboard/pages/settings/SettingsItem";
import SettingsSection from "@/features/options-page/dashboard/pages/settings/SettingsSection";

export default function SettingsPage() {
  const navigate = useNavigate();

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
          title="Onboarding"
          description="Go through the onboarding experience again"
        >
          <Button onClick={() => navigate("/onboarding")}>🚀 Onboarding</Button>
        </SettingsItem>
      </SettingsSection>
    </div>
  );
}
