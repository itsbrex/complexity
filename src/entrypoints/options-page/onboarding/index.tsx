import { LuCheck } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";

import Cplx from "@/components/icons/Cplx";
import { Button } from "@/components/ui/button";
import {
  Steps,
  StepsContent,
  StepsCompletedContent,
  StepsPrevTrigger,
  StepsNextTrigger,
  StepsContext,
} from "@/components/ui/steps";
import { H1, H2, H3, P } from "@/components/ui/typography";
import BasePermissions from "@/entrypoints/options-page/onboarding/BasePermissions";
import BetaNotifications from "@/entrypoints/options-page/onboarding/BetaNotifications";
import DashboardAccess from "@/entrypoints/options-page/onboarding/DashboardAccess";
import ExtensionIconAction from "@/entrypoints/options-page/onboarding/ExtensionIconAction";
import NeedHelp from "@/entrypoints/options-page/onboarding/NeedHelp";
import PluginEcosystem from "@/entrypoints/options-page/onboarding/PluginEcosystem";
import useIsFromAlpha from "@/entrypoints/options-page/onboarding/useIsFromAlpha";

const steps = [
  {
    title: "Introduction",
    description: "Welcome",
    component: <FirstStep />,
  },
  {
    title: "Permissions",
    description: "Required permissions",
    component: <BasePermissions />,
  },
  {
    title: "Dashboard Access",
    description: "Dashboard access",
    component: <DashboardAccess />,
  },
  {
    title: "Extension Icon Action",
    description:
      "Customize the behavior when left-click on the extension's icon",
    component: <ExtensionIconAction />,
  },
  {
    title: "Plugin Ecosystem",
    description: "Plugin ecosystem",
    component: <PluginEcosystem />,
  },
  {
    title: "Beta Notifications",
    description: "Beta notifications",
    component: <BetaNotifications />,
  },
  {
    title: "Need Help?",
    description: "Need help?",
    component: <NeedHelp />,
  },
];

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="x-flex x-min-h-screen x-bg-background">
      <div className="x-m-auto x-w-full x-max-w-3xl x-px-4 md:x-px-8">
        <div className="x-flex x-justify-center x-rounded-lg x-py-4 md:x-py-8">
          <Steps
            count={steps.length}
            onStepChange={() => window.scrollTo(0, 0)}
          >
            {steps.map((step, index) => (
              <StepsContent key={index} index={index}>
                {step.component}
              </StepsContent>
            ))}

            <StepsCompletedContent>
              <div className="x-flex x-flex-col x-items-center x-justify-center x-space-y-8 x-animate-in x-fade-in md:x-space-y-12">
                <div className="x-rounded-full x-bg-primary/10 x-p-6 md:x-p-8">
                  <div className="x-rounded-full x-bg-foreground x-p-4 md:x-p-5">
                    <LuCheck className="x-h-8 x-w-8 x-text-primary-foreground md:x-h-10 md:x-w-10" />
                  </div>
                </div>
                <H3 className="x-text-xl x-font-semibold md:x-text-2xl">
                  Setup Complete! 🎉
                </H3>
                <P className="x-text-center x-leading-relaxed x-text-muted-foreground">
                  You&apos;re all set to start using the extension.
                </P>
              </div>
            </StepsCompletedContent>

            <div className="x-mx-auto x-mt-6 x-flex x-max-w-max x-justify-between x-gap-3 md:x-mt-8 md:x-gap-4">
              <StepsContext>
                {({ hasPrevStep, hasNextStep }) => (
                  <>
                    {hasPrevStep && (
                      <StepsPrevTrigger>Previous</StepsPrevTrigger>
                    )}
                    {hasNextStep && <StepsNextTrigger>Next</StepsNextTrigger>}
                    {!hasNextStep && (
                      <Button
                        size="lg"
                        onClick={() => navigate("/plugins?from=onboarding")}
                      >
                        Continue to Dashboard
                      </Button>
                    )}
                  </>
                )}
              </StepsContext>
            </div>
          </Steps>
        </div>
      </div>
    </div>
  );
}

function FirstStep() {
  const fromAlpha = useIsFromAlpha();

  return (
    <div className="x-my-8 x-flex x-flex-col x-items-center x-justify-center x-space-y-8 md:x-my-16 md:x-space-y-12">
      <H1 className="x-text-balance x-text-center">
        Make the most of your Perplexity AI
      </H1>
      <div className="x-space-y-8 x-text-center md:x-space-y-12">
        <div className="x-relative">
          <div className="x-group x-relative x-z-0 x-mt-8 x-flex x-flex-col x-place-items-center x-transition-all before:x-absolute before:x-h-[300px] before:x-w-full before:-x-translate-x-1/2 before:x-rounded-full before:x-bg-gradient-to-br before:x-from-transparent before:x-to-primary before:x-opacity-10 before:x-blur-2xl before:x-duration-1000 before:x-ease-in-out before:x-content-[''] before:x-animate-in before:x-fade-in before:x-zoom-in-0 after:x-absolute after:-x-z-20 after:x-h-[180px] after:x-w-[240px] after:x-translate-x-1/3 after:x-bg-gradient-conic after:x-from-primary after:x-via-primary after:x-opacity-40 after:x-blur-2xl after:x-duration-1000 after:x-ease-in-out after:x-content-[''] after:x-animate-in after:x-fade-in after:x-zoom-in-0 sm:before:x-w-[560px] md:x-mt-12 md:before:x-h-[400px] md:after:x-h-[240px] md:after:x-w-[320px] lg:x-mb-0 lg:x-mt-0 before:lg:x-h-[480px]">
            <Cplx className="x-mx-auto x-size-32 x-fill-foreground x-text-primary md:x-size-48" />
          </div>
        </div>
        <div className="x-relative x-z-10">
          {fromAlpha ? (
            <H2 className="x-text-lg x-text-muted-foreground md:x-text-xl">
              A brand new version of Complexity is here!
            </H2>
          ) : (
            <>
              <H2 className="x-text-lg x-text-muted-foreground md:x-text-xl">
                Let&apos;s get started with a quick setup
              </H2>
              <Link
                to="/"
                className="x-cursor-pointer x-text-center x-text-base x-leading-relaxed x-text-muted-foreground x-underline md:x-text-lg"
              >
                or skip and take me to the dashboard
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
