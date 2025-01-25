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
    <div className="x-relative">
      {!loaded && (
        <div className="x-absolute x-inset-0 x-flex x-items-center x-justify-center x-bg-muted/10">
          <div className="x-h-6 x-w-6 x-animate-spin x-rounded-full x-border-2 x-border-primary x-border-t-transparent" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`x-w-full ${!loaded ? `x-min-h-[${minHeight}]` : ""} ${className}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
