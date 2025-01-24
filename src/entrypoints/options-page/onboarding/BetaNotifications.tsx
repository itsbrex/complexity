import { H1 } from "@/components/ui/typography";

export default function BetaNotifications() {
  return (
    <div className="tw-mx-auto tw-flex tw-max-w-2xl tw-flex-col tw-items-center tw-gap-4 tw-px-2 md:tw-gap-8 md:tw-px-4">
      <H1 className="tw-text-balance tw-text-center">Multilingual Support</H1>
      <div className="tw-w-full tw-text-balance tw-text-center tw-text-xl">
        Complexity supports all 18 languages on Perplexity.ai. However,
        translation is in very early stages and not guaranteed to be 100%
        accurate. If you find them confusing, please reach out to us via the
        support channels or use English instead.
      </div>
      <div className="tw-overflow-hidden tw-rounded-md tw-border tw-border-border/50">
        <img src="https://i.imgur.com/IOW63ev.png" />
      </div>
    </div>
  );
}
