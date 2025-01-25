import { Slider as ArkSlider } from "@ark-ui/react/slider";
import { ComponentProps } from "react";

export type SliderProps = ArkSlider.RootProps;

const SliderContext = ArkSlider.Context;

const Slider = ArkSlider.Root;

const SliderLabel = ({ className, ...props }: ArkSlider.LabelProps) => {
  return (
    <ArkSlider.Label
      className={cn(
        "x-peer-disabled:x-cursor-not-allowed x-peer-disabled:x-opacity-70 x-text-sm x-font-medium x-leading-none",
        className,
      )}
      {...props}
    />
  );
};

const SliderValueText = ({ className, ...props }: ArkSlider.ValueTextProps) => {
  return (
    <ArkSlider.ValueText
      className={cn("x-text-sm x-text-muted-foreground", className)}
      {...props}
    />
  );
};

const SliderControl = ({ className, ...props }: ArkSlider.ControlProps) => {
  return (
    <ArkSlider.Control
      className={cn("x-relative x-flex x-w-full x-touch-none", className)}
      {...props}
    />
  );
};

const SliderTrack = ({ className, ...props }: ArkSlider.TrackProps) => {
  return (
    <ArkSlider.Track
      className={cn(
        "x-relative x-h-2 x-w-full x-grow x-rounded-full x-bg-secondary",
        className,
      )}
      {...props}
    />
  );
};

const SliderRange = ({ className, ...props }: ArkSlider.RangeProps) => {
  return (
    <ArkSlider.Range
      className={cn("x-absolute x-h-full x-bg-primary", className)}
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
        "x-relative -x-mt-1.5 x-block x-h-5 x-w-5 x-select-none x-rounded-full x-border-2 x-border-primary x-bg-background x-ring-offset-background x-transition-colors focus-visible:x-outline-none focus-visible:x-ring-2 focus-visible:x-ring-ring focus-visible:x-ring-offset-2 disabled:x-pointer-events-none disabled:x-opacity-50",
        className,
      )}
      {...props}
    >
      {showValueIndicator && (
        <div
          {...indicatorProps}
          className={cn(
            "x-absolute -x-top-7 x-left-1/2 -x-translate-x-1/2 -x-translate-y-1/2 x-rounded-md x-border x-border-border/50 x-bg-primary x-px-2 x-py-1",
            indicatorProps?.className,
          )}
        >
          <ArkSlider.ValueText className="x-text-xs x-text-primary-foreground" />
          <div className="x-absolute -x-bottom-1 x-left-1/2 -x-translate-x-1/2 x-border-4 x-border-transparent x-border-t-primary" />
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
      className={cn("x-relative x-mt-2 x-flex x-w-full", className)}
      {...props}
    />
  );
};

const SliderMarker = ({ className, ...props }: ArkSlider.MarkerProps) => {
  return (
    <ArkSlider.Marker
      className={cn(
        "x-text-xs x-text-muted-foreground before:x-absolute before:x-top-[-8px] before:x-h-2 before:x-w-[2px] before:x-bg-muted-foreground/50",
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
