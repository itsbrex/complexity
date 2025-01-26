import { LuGithub } from "react-icons/lu";
import { SiDiscord } from "react-icons/si";

import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/typography";

export default function NeedHelp() {
  return (
    <div className="x-mx-auto x-flex x-max-w-2xl x-flex-col x-items-center x-gap-4 x-px-2 md:x-gap-8 md:x-px-4">
      <H1 className="x-text-balance x-text-center">Need Help?</H1>
      <div className="x-w-full x-text-balance x-text-center">
        If you need help with setting up or using Complexity, you can reach out
        to us via support channels listed below.
      </div>
      <div className="x-flex x-items-center x-gap-4">
        <Button asChild className="x-w-max" size="lg" variant="outline">
          <a
            href="https://discord.cplx.app"
            target="_blank"
            rel="noreferrer"
          >
            <SiDiscord className="x-mr-2 x-size-4" />
            <span>Discord</span>
          </a>
        </Button>
        <Button asChild className="x-w-max" size="lg" variant="outline">
          <a
            href="https://github.com/pnd280/complexity/issues"
            target="_blank"
            rel="noreferrer"
          >
            <LuGithub className="x-mr-2 x-size-4" />
            <span>GitHub Issues</span>
          </a>
        </Button>
      </div>
    </div>
  );
}
