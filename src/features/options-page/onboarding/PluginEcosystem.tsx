import { H1 } from "@/components/ui/typography";
import useIsFromAlpha from "@/features/options-page/onboarding/useIsFromAlpha";

export default function PluginEcosystem() {
  const fromAlpha = useIsFromAlpha();

  const pluginText = fromAlpha ? (
    <span>
      Existing UI/UX tweaks has been renamed to{" "}
      <span className="tw-font-semibold tw-text-primary">PLUGINS</span>.
    </span>
  ) : (
    <span>
      Complexity has a comprehensive set of tweaks/features called{" "}
      <span className="tw-font-semibold tw-text-primary">PLUGINS</span>.
    </span>
  );

  return (
    <div className="tw-mx-auto tw-flex tw-max-w-2xl tw-flex-col tw-items-center tw-gap-4 tw-px-2 md:tw-gap-8 md:tw-px-4">
      <H1 className="tw-text-balance tw-text-center">Plugin Ecosystem</H1>

      <div className="tw-w-full tw-text-balance tw-text-center">
        {pluginText} Most plugins are isolated and can be enabled/disabled
        independently. Each plugin can have further configuration options.
      </div>

      <div className="tw-w-full tw-px-8">
        <div className="tw-relative tw-rounded-md tw-border tw-border-primary/50">
          <div className="tw-absolute tw-left-1/2 tw-top-1/2 tw-z-0 tw-size-[120%] -tw-translate-x-1/2 -tw-translate-y-1/2 tw-rounded-full tw-bg-primary/20 tw-blur-2xl tw-transition-all tw-duration-500 tw-ease-in-out" />
          <img
            src="https://i.imgur.com/I576QlN.png"
            alt="Plugin Ecosystem"
            className="tw-relative tw-w-full tw-rounded-md tw-shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
