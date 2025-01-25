import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { useCanvasStore } from "@/plugins/canvas/store";
import {
  useMirroredCodeBlocksStore,
  getMirroredCodeBlockByLocation,
} from "@/plugins/thread-better-code-blocks/store";

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
    <div className="x-prose x-mx-auto x-p-4 x-py-8 dark:x-prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {code}
      </ReactMarkdown>
    </div>
  );
}
