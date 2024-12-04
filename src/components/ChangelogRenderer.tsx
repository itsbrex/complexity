import { HTMLAttributes } from "react";
import { Remark } from "react-remark";
import rehypeRaw from "rehype-raw";

import ChangelogItemsBlock from "@/components/ChangelogItemsBlock";
import { InlineCode, Ul } from "@/components/ui/typography";

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
        "tw-prose tw-flex tw-flex-col tw-gap-4 dark:tw-prose-invert",
        className,
      )}
      {...props}
    >
      <Remark
        rehypePlugins={[rehypeRaw as any]}
        remarkToRehypeOptions={{ allowDangerousHtml: true }}
        rehypeReactOptions={{
          components: {
            code: InlineCode,
            ul: Ul,
            "items-block": ChangelogItemsBlock,
          },
        }}
      >
        {changelog}
      </Remark>
    </div>
  );
}
