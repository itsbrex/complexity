import { SVGProps } from "react";

export default function XAiIcon({ ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="0.8em"
      height="0.8em"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 841.89 595.28"
      {...props}
    >
      <g>
        <polygon
          fill="currentColor"
          points="557.09,211.99 565.4,538.36 631.96,538.36 640.28,93.18"
        />
        <polygon
          fill="currentColor"
          points="640.28,56.91 538.72,56.91 379.35,284.53 430.13,357.05"
        />
        <polygon
          fill="currentColor"
          points="201.61,538.36 303.17,538.36 353.96,465.84 303.17,393.31"
        />
        <polygon
          fill="currentColor"
          points="201.61,211.99 430.13,538.36 531.69,538.36 303.17,211.99"
        />
      </g>
    </svg>
  );
}
