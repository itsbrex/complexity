import { H1 } from "@/components/ui/typography";

export default function BetaNotifications() {
  return (
    <div className="x-mx-auto x-flex x-max-w-2xl x-flex-col x-items-center x-gap-4 x-px-2 md:x-gap-8 md:x-px-4">
      <H1 className="x-text-balance x-text-center">Multilingual Support</H1>
      <div className="x-w-full x-text-balance x-text-center x-text-xl">
        Complexity supports all 18 languages on Perplexity.ai. However,
        translation is in very early stages and not guaranteed to be 100%
        accurate. If you find them confusing, please reach out to us via the
        support channels or use English instead.
      </div>
      <div className="x-overflow-hidden x-rounded-md x-border x-border-border/50">
        <img src="https://i.imgur.com/IOW63ev.png" />
      </div>
    </div>
  );
}
