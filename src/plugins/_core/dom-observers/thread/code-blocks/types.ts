export type CodeBlock = {
  nodes: {
    $wrapper: JQuery<Element>;
    $pre: JQuery<Element>;
    $code: JQuery<Element>;
    $nativeHeader: JQuery<Element>;
    $nativeCopyButton: JQuery<Element>;
  };
  content: {
    language: string;
    code: string;
  };
  states: {
    isInFlight: boolean;
  };
};
