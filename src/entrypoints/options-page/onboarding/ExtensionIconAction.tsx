import { H1 } from "@/components/ui/typography";
import ExtensionIconActionSelect from "@/entrypoints/options-page/dashboard/pages/settings/components/ExtensionIconActionSelect";

export default function ExtensionIconAction() {
  return (
    <div className="tw-mx-auto tw-flex tw-max-w-2xl tw-flex-col tw-items-center tw-gap-4 tw-px-2 md:tw-gap-8 md:tw-px-4">
      <H1 className="tw-text-balance tw-text-center">Extension Icon Action</H1>
      <div className="tw-w-full tw-text-balance tw-text-center">
        Don&apos;t like the default? Customize the behavior when left-click the
        extension&apos;s icon.
      </div>

      <ExtensionIconActionSelect />

      <div className="tw-max-w-[500px] tw-rounded-md tw-border tw-border-border/50">
        <img
          src="https://i.imgur.com/UF288wx.png"
          alt="Dashboard Shortcut"
          className="tw-relative tw-w-full tw-rounded-md tw-shadow-lg"
        />
      </div>
    </div>
  );
}
