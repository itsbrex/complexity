import { LuGithub } from "react-icons/lu";
import { SiDiscord } from "react-icons/si";

import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/typography";

export default function NeedHelp() {
  return (
    <div className="tw-mx-auto tw-flex tw-max-w-2xl tw-flex-col tw-items-center tw-gap-4 tw-px-2 md:tw-gap-8 md:tw-px-4">
      <H1 className="tw-text-balance tw-text-center">Need Help?</H1>
      <div className="tw-w-full tw-text-balance tw-text-center">
        If you need help with setting up or using Complexity, you can reach out
        to us via support channels listed below.
      </div>
      <div className="tw-flex tw-items-center tw-gap-4">
        <Button asChild className="tw-w-max" size="lg" variant="outline">
          <a href="https://discord.gg/cplx" target="_blank" rel="noreferrer">
            <SiDiscord className="tw-mr-2 tw-size-4" />
            <span>Discord</span>
          </a>
        </Button>
        <Button asChild className="tw-w-max" size="lg" variant="outline">
          <a
            href="https://github.com/pnd280/complexity/issues"
            target="_blank"
            rel="noreferrer"
          >
            <LuGithub className="tw-mr-2 tw-size-4" />
            <span>GitHub Issues</span>
          </a>
        </Button>
      </div>
    </div>
  );
}
