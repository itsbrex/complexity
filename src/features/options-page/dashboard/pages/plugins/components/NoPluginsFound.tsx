import { Trans } from "react-i18next";
import { BiExtension } from "react-icons/bi";

import { Result } from "@/components/Result";

export default function NoPluginsFound() {
  return (
    <Result
      icon={BiExtension}
      title={t("dashboard-plugins-page:pluginsPage.noPluginsFound.title")}
      description={
        <div className="tw-text-balance">
          <Trans
            i18nKey="dashboard-plugins-page:pluginsPage.noPluginsFound.description"
            components={{
              url: (
                <a
                  href="#"
                  className="tw-underline tw-transition-colors hover:tw-text-foreground"
                  target="_blank"
                  rel="noreferrer"
                />
              ),
            }}
          />
        </div>
      }
    />
  );
}
