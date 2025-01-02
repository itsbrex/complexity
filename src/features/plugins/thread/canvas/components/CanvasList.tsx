import { LuLoaderCircle, LuX } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import {
  canvasStore,
  useCanvasStore,
} from "@/features/plugins/thread/canvas/store";

export default function CanvasList() {
  const canvasBlocks = useCanvasStore((state) => state.canvasBlocks);

  return (
    <div className="tw-flex tw-size-full tw-flex-col tw-gap-4">
      <div className="tw-flex tw-items-center tw-justify-between tw-border-b tw-border-border/50 tw-bg-background tw-p-2">
        <div className="tw-p-2 tw-text-muted-foreground">
          {t("plugin-canvas:canvas.list.title")}
        </div>
        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => {
            canvasStore.getState().closeCanvasList();
          }}
        >
          <LuX className="tw-size-4 tw-text-muted-foreground" />
        </Button>
      </div>
      <div className="tw-flex tw-flex-col tw-gap-4 tw-overflow-y-auto tw-px-4">
        {Object.values(canvasBlocks).map(
          ({ Icon, count, title, description, isInFlight, onClick }, index) => {
            return (
              <div
                key={index}
                className={cn(
                  "tw-group tw-flex tw-w-full tw-cursor-pointer tw-select-none tw-items-center tw-divide-x-2 tw-divide-border/50 tw-overflow-hidden tw-rounded-lg tw-border tw-border-border/50 tw-bg-secondary tw-transition-all hover:tw-border-primary",
                )}
                onClick={onClick}
              >
                <div
                  className={cn(
                    "tw-group-hover:tw-bg-primary/10 tw-flex tw-aspect-square tw-size-16 tw-items-center tw-justify-center",
                  )}
                >
                  {isInFlight ? (
                    <LuLoaderCircle className="tw-size-4 tw-animate-spin tw-text-muted-foreground" />
                  ) : (
                    <Icon className="tw-size-8" />
                  )}
                </div>
                <div className="tw-flex tw-w-full tw-flex-col tw-border-l tw-bg-background tw-px-4 tw-py-2">
                  <div
                    className={cn(
                      "tw-truncate tw-text-lg tw-text-foreground tw-transition-all group-hover:tw-text-primary",
                    )}
                  >
                    {title}
                  </div>

                  <div className="tw-flex tw-w-max tw-items-center tw-gap-1">
                    {isInFlight ? (
                      <span className="tw-animate-pulse">
                        {t("plugin-canvas:canvas.list.generating")}
                      </span>
                    ) : (
                      <>
                        <span className="tw-text-sm tw-text-muted-foreground">
                          {description}
                        </span>
                        {count > 1 && (
                          <span className="tw-text-sm tw-text-muted-foreground">
                            •{" "}
                            {t("plugin-canvas:canvas.list.versions", { count })}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}
