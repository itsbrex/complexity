import { ComponentType, SVGProps } from "react";
import { HiCheckCircle } from "react-icons/hi2";
import { LuCookie, LuDatabase } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { H1, H3, P, Ul } from "@/components/ui/typography";
import { useExtensionPermissions } from "@/services/extension-permissions/useExtensionPermissions";

const basePermissionsDetails: Record<
  string,
  {
    permissions?: chrome.runtime.ManifestPermissions[];
    hostPermissions?: string[];
    title: string;
    description: React.ReactNode;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
  }
> = {
  storage: {
    permissions: ["storage"],
    title: "Extension Storage Access",
    description: (
      <div>
        <div>
          <div>Store your settings locally in extension storage.</div>
          <div>
            The extension does NOT have access to browsing history, bookmarks,
            or other data.
          </div>
        </div>
        <div className="tw-mt-2">
          This permission is automatically granted when installing the
          extension.
        </div>
      </div>
    ),
    icon: LuDatabase,
  },
};

export default function BasePermissions() {
  const {
    query: { data: permissions },
    handleGrantPermission,
  } = useExtensionPermissions();

  const grantedPermissions = new Set([
    ...(permissions?.permissions ?? []),
    ...(permissions?.origins ?? []),
  ]);

  if (!permissions) return null;

  return (
    <div className="tw-mx-auto tw-flex tw-max-w-2xl tw-flex-col tw-gap-4 tw-px-2 md:tw-gap-8 md:tw-px-4">
      <H1 className="tw-text-balance tw-text-center">
        Complexity needs your permissions to work
      </H1>

      <div className="tw-space-y-3 md:tw-space-y-4">
        {Object.entries(basePermissionsDetails).map(
          ([
            key,
            { title, permissions, hostPermissions, description, icon: Icon },
          ]) => {
            const isGranted = permissions?.every((p) =>
              grantedPermissions.has(p),
            );
            return (
              <Card
                key={key}
                data-granted={isGranted ? true : undefined}
                className={cn(
                  "tw-group tw-border-border/50 tw-transition-all tw-duration-500 tw-ease-in-out data-[granted]:tw-bg-primary/10 data-[granted]:tw-shadow-lg",
                )}
              >
                <CardContent className="tw-flex tw-items-start tw-gap-3 tw-p-3 md:tw-items-center md:tw-gap-4 md:tw-p-4">
                  <div className="tw-flex tw-h-8 tw-w-8 tw-shrink-0 tw-items-center tw-justify-center tw-self-start tw-rounded-md tw-bg-primary-foreground tw-text-primary md:tw-h-9 md:tw-w-9">
                    <Icon className="tw-size-4 md:tw-size-5" />
                  </div>
                  <div className="tw-flex-grow tw-space-y-1.5 md:tw-space-y-2">
                    <H3 className="tw-text-sm tw-font-medium tw-text-primary md:tw-text-base">
                      {title}
                    </H3>
                    <div className="tw-text-xs tw-text-muted-foreground md:tw-text-sm">
                      {description}
                    </div>
                    <div className="tw-mt-2 tw-flex tw-items-center tw-justify-end">
                      <Button
                        size="sm"
                        variant={isGranted ? "outline" : "default"}
                        disabled={isGranted}
                        className="tw-text-xs group-data-[granted]:tw-text-success group-data-[granted]:!tw-opacity-100 md:tw-text-sm"
                        onClick={() =>
                          handleGrantPermission({
                            permissions: permissions ?? [],
                            hostPermissions,
                          })
                        }
                      >
                        {isGranted ? (
                          <span className="tw-flex tw-items-center tw-gap-1.5 md:tw-gap-2">
                            <HiCheckCircle className="tw-h-3.5 tw-w-3.5 md:tw-h-4 md:tw-w-4" />
                            Granted
                          </span>
                        ) : (
                          "Grant Permission"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          },
        )}
        <P className="tw-text-balance tw-text-center tw-text-xs tw-text-muted-foreground md:tw-text-sm">
          You may be asked to grant additional permissions for certain features.
          Rest assured that you&apos;ll always be prompted for consent before
          any action.
        </P>
      </div>
    </div>
  );
}
