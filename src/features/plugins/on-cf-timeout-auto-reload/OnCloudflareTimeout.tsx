import { DialogContext } from "@ark-ui/react/dialog";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import useCloudflareTimeout from "@/features/plugins/on-cf-timeout-auto-reload/useCloudflareTimeout";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";

export default function OnCloudflareTimeout() {
  const settings = ExtensionLocalStorageService.getCachedSync();
  const { isSessionTimeout, handleReload } = useCloudflareTimeout();
  const [countdown, setCountdown] = useState(5);
  const countdownInterval = useRef<NodeJS.Timeout>();

  const isAutoReload =
    settings?.plugins.onCloudflareTimeoutAutoReload.behavior === "reload";

  useEffect(() => {
    if (!isSessionTimeout || !isAutoReload) return;

    countdownInterval.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) {
          handleReload();
          clearInterval(countdownInterval.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval.current);
  }, [handleReload, isSessionTimeout, isAutoReload]);

  if (!isSessionTimeout) return null;

  return (
    <Dialog defaultOpen={true} closeOnInteractOutside={false}>
      <DialogContext>
        {({ setOpen }) => (
          <DialogContent>
            <DialogHeader>Session timeout</DialogHeader>
            <DialogDescription>
              Your session has timed out (most likely due to Cloudflare).
            </DialogDescription>
            <DialogFooter>
              <Button
                onClick={() => {
                  handleReload();
                  setOpen(false);
                }}
              >
                Reload
                {isAutoReload && <span> ({countdown})</span>}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  clearInterval(countdownInterval.current);
                  setOpen(false);
                }}
              >
                Dismiss
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </DialogContext>
    </Dialog>
  );
}
