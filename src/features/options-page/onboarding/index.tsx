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
import BasePermissions from "@/features/options-page/onboarding/BasePermissions";
import BetaNotifications from "@/features/options-page/onboarding/BetaNotifications";
import DashboardAccess from "@/features/options-page/onboarding/DashboardAccess";
import NeedHelp from "@/features/options-page/onboarding/NeedHelp";
import PluginEcosystem from "@/features/options-page/onboarding/PluginEcosystem";

const steps = [
  {
    title: "Introduction",
    description: "Welcome",
    component: (
      <div className="tw-my-8 tw-flex tw-flex-col tw-items-center tw-justify-center tw-space-y-8 md:tw-my-16 md:tw-space-y-12">
        <H1 className="tw-text-balance tw-text-center">
          Make the most of your Perplexity AI
        </H1>
        <div className="tw-space-y-8 tw-text-center md:tw-space-y-12">
          <div className="tw-relative">
            <div className="tw-group tw-relative tw-z-0 tw-mt-8 tw-flex tw-flex-col tw-place-items-center tw-transition-all before:tw-absolute before:tw-h-[300px] before:tw-w-full before:-tw-translate-x-1/2 before:tw-rounded-full before:tw-bg-gradient-to-br before:tw-from-transparent before:tw-to-primary before:tw-opacity-10 before:tw-blur-2xl before:tw-duration-1000 before:tw-ease-in-out before:tw-content-[''] before:tw-animate-in before:tw-fade-in before:tw-zoom-in-0 after:tw-absolute after:-tw-z-20 after:tw-h-[180px] after:tw-w-[240px] after:tw-translate-x-1/3 after:tw-bg-gradient-conic after:tw-from-primary after:tw-via-primary after:tw-opacity-40 after:tw-blur-2xl after:tw-duration-1000 after:tw-ease-in-out after:tw-content-[''] after:tw-animate-in after:tw-fade-in after:tw-zoom-in-0 sm:before:tw-w-[560px] md:tw-mt-12 md:before:tw-h-[400px] md:after:tw-h-[240px] md:after:tw-w-[320px] lg:tw-mb-0 lg:tw-mt-0 before:lg:tw-h-[480px]">
              <Cplx className="tw-mx-auto tw-size-32 tw-fill-foreground tw-text-primary md:tw-size-48" />
            </div>
          </div>
          <div className="tw-relative tw-z-10">
            <H2 className="tw-text-lg tw-text-muted-foreground md:tw-text-xl">
              Let&apos;s get started with a quick setup
            </H2>
            <Link
              to="/settings"
              className="tw-cursor-pointer tw-text-center tw-text-base tw-leading-relaxed tw-text-muted-foreground tw-underline md:tw-text-lg"
            >
              or import your existing settings
            </Link>
          </div>
        </div>
      </div>
    ),
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
    title: "Plugin Ecosystem",
    description: "Plugin ecosystem",
    component: <PluginEcosystem />,
  },
  {
    title: "Need Help?",
    description: "Need help?",
    component: <NeedHelp />,
  },
  {
    title: "Beta Notifications",
    description: "Beta notifications",
    component: <BetaNotifications />,
  },
];

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="tw-flex tw-min-h-screen tw-bg-background">
      <div className="tw-m-auto tw-w-full tw-max-w-3xl tw-px-4 md:tw-px-8">
        <div className="tw-flex tw-justify-center tw-rounded-lg tw-py-4 md:tw-py-8">
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
              <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-space-y-8 tw-animate-in tw-fade-in md:tw-space-y-12">
                <div className="tw-rounded-full tw-bg-primary/10 tw-p-6 md:tw-p-8">
                  <div className="tw-rounded-full tw-bg-foreground tw-p-4 md:tw-p-5">
                    <LuCheck className="tw-h-8 tw-w-8 tw-text-primary-foreground md:tw-h-10 md:tw-w-10" />
                  </div>
                </div>
                <H3 className="tw-text-xl tw-font-semibold md:tw-text-2xl">
                  Setup Complete! 🎉
                </H3>
                <P className="tw-text-center tw-leading-relaxed tw-text-muted-foreground">
                  You&apos;re all set to start using the extension.
                </P>
              </div>
            </StepsCompletedContent>

            <div className="tw-mx-auto tw-mt-6 tw-flex tw-max-w-max tw-justify-between tw-gap-3 md:tw-mt-8 md:tw-gap-4">
              <StepsContext>
                {({ hasPrevStep, hasNextStep }) => (
                  <>
                    {hasPrevStep && (
                      <StepsPrevTrigger>Previous</StepsPrevTrigger>
                    )}
                    {hasNextStep && <StepsNextTrigger>Next</StepsNextTrigger>}
                    {!hasNextStep && (
                      <Button size="lg" onClick={() => navigate("/")}>
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
