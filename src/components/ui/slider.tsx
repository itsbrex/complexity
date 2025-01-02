import { Slider as ArkSlider } from "@ark-ui/react/slider";
import { ComponentProps } from "react";

export type SliderProps = ArkSlider.RootProps;

const SliderContext = ArkSlider.Context;

const Slider = ArkSlider.Root;

const SliderLabel = ({ className, ...props }: ArkSlider.LabelProps) => {
  return (
    <ArkSlider.Label
      className={cn(
        "tw-peer-disabled:tw-cursor-not-allowed tw-peer-disabled:tw-opacity-70 tw-text-sm tw-font-medium tw-leading-none",
        className,
      )}
      {...props}
    />
  );
};

const SliderValueText = ({ className, ...props }: ArkSlider.ValueTextProps) => {
  return (
    <ArkSlider.ValueText
      className={cn("tw-text-sm tw-text-muted-foreground", className)}
      {...props}
    />
  );
};

const SliderControl = ({ className, ...props }: ArkSlider.ControlProps) => {
  return (
    <ArkSlider.Control
      className={cn("tw-relative tw-flex tw-w-full tw-touch-none", className)}
      {...props}
    />
  );
};

const SliderTrack = ({ className, ...props }: ArkSlider.TrackProps) => {
  return (
    <ArkSlider.Track
      className={cn(
        "tw-relative tw-h-2 tw-w-full tw-grow tw-rounded-full tw-bg-secondary",
        className,
      )}
      {...props}
    />
  );
};

const SliderRange = ({ className, ...props }: ArkSlider.RangeProps) => {
  return (
    <ArkSlider.Range
      className={cn("tw-absolute tw-h-full tw-bg-primary", className)}
      {...props}
    />
  );
};

const SliderThumb = ({
  className,
  indicatorProps,
  showValueIndicator,
  ...props
}: ArkSlider.ThumbProps & {
  showValueIndicator?: boolean;
  indicatorProps?: ComponentProps<"div">;
}) => {
  return (
    <ArkSlider.Thumb
      className={cn(
        "tw-relative -tw-mt-1.5 tw-block tw-h-5 tw-w-5 tw-rounded-full tw-border-2 tw-border-primary tw-bg-background tw-ring-offset-background tw-transition-colors focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 disabled:tw-pointer-events-none disabled:tw-opacity-50 tw-select-none",
        className,
      )}
      {...props}
    >
      {showValueIndicator && (
        <div
          {...indicatorProps}
          className={cn(
            "tw-absolute -tw-top-7 tw-left-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2 tw-rounded-md tw-border tw-border-border/50 tw-bg-primary tw-px-2 tw-py-1",
            indicatorProps?.className,
          )}
        >
          <ArkSlider.ValueText className="tw-text-xs tw-text-primary-foreground" />
          <div className="tw-absolute -tw-bottom-1 tw-left-1/2 -tw-translate-x-1/2 tw-border-4 tw-border-transparent tw-border-t-primary" />
        </div>
      )}
      <ArkSlider.HiddenInput />
    </ArkSlider.Thumb>
  );
};

const SliderMarkerGroup = ({
  className,
  ...props
}: ArkSlider.MarkerGroupProps) => {
  return (
    <ArkSlider.MarkerGroup
      className={cn("tw-relative tw-mt-2 tw-flex tw-w-full", className)}
      {...props}
    />
  );
};

const SliderMarker = ({ className, ...props }: ArkSlider.MarkerProps) => {
  return (
    <ArkSlider.Marker
      className={cn(
        "tw-text-xs tw-text-muted-foreground before:tw-absolute before:tw-top-[-8px] before:tw-h-2 before:tw-w-[2px] before:tw-bg-muted-foreground/50",
        className,
      )}
      {...props}
    />
  );
};

export {
  Slider,
  SliderContext,
  SliderLabel,
  SliderValueText,
  SliderControl,
  SliderTrack,
  SliderRange,
  SliderThumb,
  SliderMarkerGroup,
  SliderMarker,
};
