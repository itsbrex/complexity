import { LuLeafyGreen } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
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
      <SettingsSection
        title={t("dashboard-settings-page:settingsPage.sections.general")}
      >
        <SettingsItem
          title={t(
            "dashboard-settings-page:settingsPage.items.permissions.title",
          )}
        >
          <ManagePermissionsDialogWrapper>
            <Button>
              {t(
                "dashboard-settings-page:settingsPage.items.permissions.action",
              )}
            </Button>
          </ManagePermissionsDialogWrapper>
        </SettingsItem>
        <SettingsItem
          title={
            <div className="tw-flex tw-items-center tw-gap-2">
              <LuLeafyGreen className="tw-text-success" />
              <span>
                {t(
                  "dashboard-settings-page:settingsPage.items.energySaving.title",
                )}
              </span>
            </div>
          }
          description={
            <div>
              <div>
                {t(
                  "dashboard-settings-page:settingsPage.items.energySaving.description",
                )}
              </div>
              <div className="tw-text-sm tw-italic tw-text-muted-foreground">
                {t(
                  "dashboard-settings-page:settingsPage.items.energySaving.note",
                )}
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
          title={t(
            "dashboard-settings-page:settingsPage.items.onboarding.title",
          )}
          description={t(
            "dashboard-settings-page:settingsPage.items.onboarding.description",
          )}
        >
          <Button onClick={() => navigate("/onboarding")}>
            {t("dashboard-settings-page:settingsPage.items.onboarding.action")}
          </Button>
        </SettingsItem>
      </SettingsSection>

      <SettingsSection
        title={t("dashboard-settings-page:settingsPage.sections.data")}
      >
        <SettingsItem
          title={t("dashboard-settings-page:settingsPage.items.import.title")}
          description={t(
            "dashboard-settings-page:settingsPage.items.import.description",
          )}
        >
          <ImportDataButtons />
        </SettingsItem>
        <SettingsItem
          title={t("dashboard-settings-page:settingsPage.items.export.title")}
          description={t(
            "dashboard-settings-page:settingsPage.items.export.description",
          )}
        >
          <ExportDataButtons />
        </SettingsItem>
      </SettingsSection>

      <SettingsSection
        title={t(
          "dashboard-settings-page:settingsPage.sections.troubleshooting",
        )}
      >
        <SettingsItem
          title={t("dashboard-settings-page:settingsPage.items.reset.title")}
        >
          <ClearAllDataButton />
        </SettingsItem>
      </SettingsSection>
    </div>
  );
}
