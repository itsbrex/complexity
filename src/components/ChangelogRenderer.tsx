import { HTMLAttributes } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import ChangelogItemsBlock from "@/components/ChangelogItemsBlock";

export default function ChangelogRenderer({
  changelog,
  className,
  ...props
}: {
  changelog: string;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "tw-prose tw-flex tw-flex-col dark:tw-prose-invert tw-max-w-max",
        className,
      )}
      {...props}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          "items-block": ChangelogItemsBlock,
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="tw-rounded-md tw-border tw-border-border/50 tw-max-w-[1000px]"
            />
          ),
        }}
      >
        {changelog}
      </ReactMarkdown>
    </div>
  );
}
