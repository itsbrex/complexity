import { LuMail } from "react-icons/lu";
import { SiKofi, SiPaypal } from "react-icons/si";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SponsorDialogWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog closeOnEscape={false} closeOnInteractOutside={false}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <div className="tw-absolute tw-inset-0 -tw-z-10 tw-bg-gradient-to-b tw-from-primary/20 tw-to-transparent" />

        <DialogHeader>
          <DialogTitle>{t("common:sponsorDialog.title")}</DialogTitle>
          <DialogDescription className="tw-text-foreground">
            {t("common:sponsorDialog.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="tw-w-full tw-space-y-2">
          <div className="tw-text-muted-foreground">
            {t("common:sponsorDialog.donation.title")}
          </div>
          <div className="tw-flex tw-flex-col tw-gap-2">
            <Button className="tw-space-x-2">
              <a
                href="https://paypal.me/pnd280"
                target="_blank"
                rel="noreferrer"
                className="tw-flex tw-items-center tw-gap-2"
              >
                <SiPaypal className="tw-size-6" />
                <span>PayPal</span>
              </a>
            </Button>
            <Button className="tw-space-x-2">
              <a
                href="https://ko-fi.com/pnd280"
                target="_blank"
                rel="noreferrer"
                className="tw-flex tw-items-center tw-gap-2"
              >
                <SiKofi className="tw-size-6" />
                <span>Ko-fi</span>
              </a>
            </Button>
          </div>
        </div>
        <div className="tw-mt-4 tw-w-full tw-space-y-2">
          <div className="tw-text-muted-foreground">
            {t("common:sponsorDialog.sponsorship.title")}
          </div>
          <Button className="tw-group tw-w-full tw-space-x-2">
            <a href="mailto:pnd280@gmail.com" target="_blank" rel="noreferrer">
              <span className="tw-flex tw-items-center tw-gap-2 group-hover:tw-hidden">
                <LuMail className="tw-size-6" />
                <span>
                  {t("common:sponsorDialog.sponsorship.contactEmail")}
                </span>
              </span>
              <span className="tw-hidden tw-animate-in tw-fade-in-0 group-hover:tw-block group-hover:tw-text-primary">
                pnd280@gmail.com
              </span>
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
