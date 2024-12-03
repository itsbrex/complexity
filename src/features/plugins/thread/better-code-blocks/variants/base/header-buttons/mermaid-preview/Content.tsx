import { sendMessage } from "webext-bridge/content-script";

import { useMirroredCodeBlockContext } from "@/features/plugins/thread/better-code-blocks/MirroredCodeBlockContext";
import { DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS } from "@/utils/dom-selectors";

export default function MermaidPreviewContent() {
  const { codeString, sourceMessageBlockIndex, sourceCodeBlockIndex, content } =
    useMirroredCodeBlockContext()((state) => ({
      codeString: state.codeString,
      sourceMessageBlockIndex: state.sourceMessageBlockIndex,
      sourceCodeBlockIndex: state.sourceCodeBlockIndex,
      content: state.content,
    }));

  useEffect(() => {
    if (content === "mermaid") {
      sendMessage(
        "mermaidRenderer:render",
        {
          selector: `[data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.BLOCK}"][data-index="${sourceMessageBlockIndex}"] [data-cplx-component="${DOM_INTERNAL_DATA_ATTRIBUTES_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.MIRRORED_CODE_BLOCK}"][data-index="${sourceCodeBlockIndex}"] [data-cplx-component="mermaid-placeholder"]`,
        },
        "window",
      );
    }
  }, [content, sourceCodeBlockIndex, sourceMessageBlockIndex]);

  return (
    <div
      className="tw-aspect-square tw-opacity-0 [&:has(svg)]:tw-opacity-100"
      data-cplx-component="mermaid-placeholder"
    >
      {codeString}
    </div>
  );
}
