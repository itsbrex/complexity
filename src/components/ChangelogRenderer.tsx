import { HTMLAttributes, ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import ChangelogItemsBlock from "@/components/ChangelogItemsBlock";

type ChangelogComponents = ComponentPropsWithoutRef<
  typeof ReactMarkdown
>["components"];

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
        "x-prose x-flex x-max-w-max x-flex-col dark:x-prose-invert",
        className,
      )}
      {...props}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={
          {
            "items-block": ChangelogItemsBlock,
            link: () => <div />,
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                className="x-max-w-[1000px] x-rounded-md x-border x-border-border/50"
              />
            ),
          } as ChangelogComponents
        }
      >
        {changelog}
      </ReactMarkdown>
    </div>
  );
}
