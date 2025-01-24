import { useEffect } from "react";
import { TbError404 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

import { Result } from "@/components/Result";

export default function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/plugins");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="tw-flex tw-h-full tw-min-h-screen tw-items-center tw-justify-center">
      <Result
        icon={TbError404}
        title="Page not found"
        description={
          <div className="tw-text-balance">
            You will be redirected to the home page in 5 seconds...
          </div>
        }
      />
    </div>
  );
}
