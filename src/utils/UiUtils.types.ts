export type QueryBoxType = "main" | "main-modal" | "space" | "follow-up";

export type MessageBlock = {
  $wrapper: JQuery<Element>;
  $query: JQuery<Element>;
  $sourcesHeading: JQuery<Element>;
  $answerHeading: JQuery<Element>;
  $answer: JQuery<Element>;
};

export type CodeBlock = {
  $wrapper: JQuery<Element>;
  $pre: JQuery<Element>;
  $code: JQuery<Element>;
  $nativeHeader: JQuery<Element>;
  $nativeCopyButton: JQuery<Element>;
};
