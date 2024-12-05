import { LuGithub, LuMail } from "react-icons/lu";
import { SiDiscord } from "react-icons/si";

import { Button } from "@/components/ui/button";

export default function HelpPage() {
  return (
    <div>
      <div className="tw-flex tw-flex-col tw-gap-2">
        <h1 className="tw-text-2xl tw-font-bold">Need Help?</h1>
        <p className="tw-text-muted-foreground">
          Have questions or need assistance?
        </p>

        <div>Complexity has multiple support channels:</div>

        <div className="tw-flex tw-items-center tw-gap-4">
          <Button asChild className="tw-w-max">
            <a
              href="https://discord.gg/fxzqdkwmWx"
              target="_blank"
              rel="noreferrer"
            >
              <SiDiscord className="tw-mr-2 tw-size-4" />
              <span>Discord</span>
            </a>
          </Button>
          <Button asChild className="tw-w-max">
            <a
              href="https://github.com/pnd280/complexity/issues"
              target="_blank"
              rel="noreferrer"
            >
              <LuGithub className="tw-mr-2 tw-size-4" />
              <span>GitHub Issues</span>
            </a>
          </Button>

          <div className="tw-text-muted-foreground">or</div>

          <Button asChild className="tw-w-max">
            <a href="mailto:pnd280@gmail.com" target="_blank" rel="noreferrer">
              <LuMail className="tw-mr-2 tw-size-4" />
              <span>pnd280@gmail.com</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
