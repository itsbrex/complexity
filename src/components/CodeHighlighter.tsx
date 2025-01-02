import { ComponentProps } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import lightStyle from "react-syntax-highlighter/dist/esm/styles/hljs/vs";
import darkStyle from "react-syntax-highlighter/dist/esm/styles/hljs/vs2015";

import { useColorSchemeStore } from "@/data/color-scheme-store";

const INTERPRETED_LANGUAGES: Record<string, string> = {
  html: "xml",
  mermaid: "hsp",
  react: "javascript",
};

const CodeHighlighter = memo(function CodeHighlighter({
  children,
  language,
  ...props
}: ComponentProps<typeof SyntaxHighlighter>) {
  const colorScheme = useColorSchemeStore((state) => state.colorScheme);

  return (
    <SyntaxHighlighter
      style={colorScheme === "dark" ? darkStyle : lightStyle}
      language={INTERPRETED_LANGUAGES[language ?? ""] ?? language}
      {...props}
    >
      {children}
    </SyntaxHighlighter>
  );
});

export default CodeHighlighter;
