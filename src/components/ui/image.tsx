import { useState } from "react";

type ImageProps = {
  src: string;
  alt: string;
  className?: string;
  minHeight?: string;
};

export function Image({
  src,
  alt,
  className = "",
  minHeight = "200px",
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="tw-relative">
      {!loaded && (
        <div className="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-muted/10">
          <div className="tw-h-6 tw-w-6 tw-animate-spin tw-rounded-full tw-border-2 tw-border-primary tw-border-t-transparent" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`tw-w-full ${!loaded ? `tw-min-h-[${minHeight}]` : ""} ${className}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
