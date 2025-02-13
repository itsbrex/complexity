import { SVGProps } from "react";

const FaMarkdown = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.875"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
      <path d="M7 15v-6l2 2l2 -2v6" />
      <path d="M14 13l2 2l2 -2m-2 2v-6" />
    </svg>
  );
};

export default FaMarkdown;
