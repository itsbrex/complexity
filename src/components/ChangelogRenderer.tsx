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
        "tw-prose tw-flex tw-max-w-max tw-flex-col dark:tw-prose-invert",
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
                className="tw-max-w-[1000px] tw-rounded-md tw-border tw-border-border/50"
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
