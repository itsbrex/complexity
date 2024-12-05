import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearchParams } from "react-router-dom";

import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateNewLanguageOptionButton from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content/better-code-blocks/CreateNewLanguageOptionButton";
import BetterCodeBlockFineGrainedOptions from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content/better-code-blocks/FineGrainedOptions";
import BetterCodeBlockGlobalOptions from "@/features/options-page/dashboard/pages/plugins/components/plugin-details/content/better-code-blocks/GlobalOptions";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";
import { betterCodeBlocksFineGrainedOptionsQueries } from "@/services/indexed-db/better-code-blocks/query-keys";

export default function BetterCodeBlocksPluginDetails() {
  const { settings } = useExtensionLocalStorage();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "global";

  const { data: fineGrainedOptions } = useQuery(
    betterCodeBlocksFineGrainedOptionsQueries.list,
  );

  const isFromPluginList = useLocation().state?.fromPluginList;

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <Header />

      {settings?.plugins["thread:betterCodeBlocks"].enabled && (
        <Tabs
          value={activeTab}
          onValueChange={({ value }) => {
            setSearchParams(
              { tab: value },
              {
                state: {
                  fromPluginList: isFromPluginList,
                },
              },
            );
          }}
        >
          <TabsList className="tw-mb-2 tw-justify-start">
            <TabsTrigger value="global">Global</TabsTrigger>
            {fineGrainedOptions?.map((option) => (
              <TabsTrigger key={option.language} value={option.language}>
                {option.language}
              </TabsTrigger>
            ))}
            <CreateNewLanguageOptionButton />
          </TabsList>
          <TabsContent
            value="global"
            className="tw-max-w-[500px] tw-rounded-md tw-bg-secondary tw-p-4"
          >
            <BetterCodeBlockGlobalOptions />
          </TabsContent>
          {fineGrainedOptions?.map((option) => (
            <TabsContent
              key={option.language}
              value={option.language}
              className="tw-rounded-md tw-bg-secondary tw-p-4"
            >
              <BetterCodeBlockFineGrainedOptions language={option.language} />
            </TabsContent>
          ))}
        </Tabs>
      )}
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
