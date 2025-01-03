import { ComponentProps } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import lightStyle from "react-syntax-highlighter/dist/esm/styles/hljs/vs";
import darkStyle from "react-syntax-highlighter/dist/esm/styles/hljs/vs2015";

import { useColorSchemeStore } from "@/data/color-scheme-store";

const INTERPRETED_LANGUAGES: Record<string, string> = {
  html: "xml",
  mermaid: "hsp",
  react: "javascript",
  jsx: "javascript",
  tsx: "typescript",
};

const CodeHighlighter = memo(function CodeHighlighter({
  children,
  language,
  ...props
}: ComponentProps<typeof SyntaxHighlighter>) {
  const colorScheme = useColorSchemeStore((state) => state.colorScheme);

  const interpretedLanguage = language
    ? (INTERPRETED_LANGUAGES[language] ?? language)
    : "text";

  const targetLanguage = SyntaxHighlighter.supportedLanguages.includes(
    interpretedLanguage,
  )
    ? interpretedLanguage
    : "text";

  return (
    <SyntaxHighlighter
      style={colorScheme === "dark" ? darkStyle : lightStyle}
      language={targetLanguage}
      {...props}
    >
      {children}
    </SyntaxHighlighter>
  );
});

export default CodeHighlighter;
