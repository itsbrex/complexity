import { H1 } from "@/components/ui/typography";
import ExtensionIconActionSelect from "@/entrypoints/options-page/dashboard/pages/settings/components/ExtensionIconActionSelect";

export default function ExtensionIconAction() {
  return (
    <div className="x-mx-auto x-flex x-max-w-2xl x-flex-col x-items-center x-gap-4 x-px-2 md:x-gap-8 md:x-px-4">
      <H1 className="x-text-balance x-text-center">Extension Icon Action</H1>
      <div className="x-w-full x-text-balance x-text-center">
        Don&apos;t like the default? Customize the behavior when left-click the
        extension&apos;s icon.
      </div>

      <ExtensionIconActionSelect />

      <div className="x-max-w-[500px] x-rounded-md x-border x-border-border/50">
        <img
          src="https://i.imgur.com/UF288wx.png"
          alt="Dashboard Shortcut"
          className="x-relative x-w-full x-rounded-md x-shadow-lg"
        />
      </div>
    </div>
  );
}
