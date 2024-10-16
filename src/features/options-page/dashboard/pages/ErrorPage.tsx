import { LuAlertCircle } from "react-icons/lu";
import { useNavigate, useRouteError } from "react-router-dom";

import { Result } from "@/components/Result";
import { Button } from "@/components/ui/button";
import { P } from "@/components/ui/typography";

type ErrorPageProps = {
  error?: Error;
  resetError?: () => void;
};

export default function ErrorPage({ error, resetError }: ErrorPageProps) {
  const routerError = useRouteError();

  const navigate = useNavigate();

  const handleHomeClick = () => {
    if (resetError) {
      resetError();
    }
    navigate("/");
  };

  return (
    <div className="tw-flex tw-h-full tw-min-h-screen tw-items-center tw-justify-center">
      <Result
        icon={LuAlertCircle}
        title="Something went wrong"
        description={
          <div className="tw-text-balance">
            <P className="tw-mb-4 tw-text-sm tw-text-muted-foreground">
              {error?.message ||
                "An unexpected error occurred. Please check the console."}
            </P>
            <Button onClick={handleHomeClick}>Return to Homepage</Button>
            <div className="tw-my-4 tw-mt-8 tw-max-h-[300px] tw-overflow-auto tw-rounded-md tw-bg-secondary tw-p-2 tw-font-mono">
              Error: {(routerError as Error).message}
            </div>
          </div>
        }
      />
    </div>
  );
}
