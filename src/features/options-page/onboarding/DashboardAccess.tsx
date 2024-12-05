import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/typography";

export default function DashboardAccess() {
  const [isPinnedOnToolbar, setShouldShow] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    chrome.action.getUserSettings().then((settings) => {
      setShouldShow(settings.isOnToolbar);
    });
  }, []);

  return (
    <>
      <div className="tw-mx-auto tw-flex tw-max-w-2xl tw-flex-col tw-items-center tw-gap-4 tw-px-2 md:tw-gap-8 md:tw-px-4">
        <H1 className="tw-text-balance tw-text-center">Dashboard</H1>
        <div className="tw-w-full tw-text-balance tw-text-center">
          The Settings Dashboard is a new way to manage all of your Complexity
          settings and data. You can always access it via{" "}
          <span className="tw-underline">right-clicking</span> the
          extension&apos;s icon.
        </div>
        <div className="tw-max-w-[500px] tw-rounded-md tw-border tw-border-border/50">
          <img
            src="https://i.imgur.com/zgT1Wlz.png"
            alt="Dashboard Shortcut"
            className="tw-relative tw-w-full tw-rounded-md tw-shadow-lg"
          />
        </div>
      </div>

      {!isPinnedOnToolbar && !isDismissed && (
        <div
          className="tw-fixed tw-right-4 tw-top-4 tw-hidden tw-w-[500px] tw-flex-col tw-items-center tw-justify-center tw-gap-4 tw-rounded-md tw-border tw-border-border/50 tw-bg-secondary tw-p-4 tw-duration-300 tw-animate-in tw-fade-in tw-slide-in-from-top-4 md:tw-flex"
          onClick={() => setIsDismissed(true)}
        >
          <img
            src="https://i.imgur.com/M8LQwV0.png"
            alt="pin-dashboard-instruction"
          />
          <div>
            Pin the extension to your toolbar to always have access to the
            Dashboard. And <span className="tw-underline">left-click</span> the
            extension icon to open a new tab of Perplexity.ai.
          </div>
          <Button variant="default">Dismiss</Button>
        </div>
      )}
    </>
  );
}
