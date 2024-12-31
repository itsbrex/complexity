import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import {
  useMirroredCodeBlocksStore,
  getMirroredCodeBlockByLocation,
} from "@/features/plugins/thread/better-code-blocks/store";
import { useCanvasStore } from "@/features/plugins/thread/canvas/store";

export default function MarkdownRenderer() {
  const selectedCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );
  const mirroredCodeBlocks = useMirroredCodeBlocksStore(
    (state) => state.blocks,
  );
  const selectedCodeBlock = getMirroredCodeBlockByLocation({
    mirroredCodeBlocks,
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });
  const code = selectedCodeBlock?.codeString;

  return (
    <div className="tw-prose tw-mx-auto tw-p-4 tw-py-8 dark:tw-prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {code}
      </ReactMarkdown>
    </div>
  );
}
