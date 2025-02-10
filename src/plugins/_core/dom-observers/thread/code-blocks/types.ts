export type CodeBlock = {
  nodes: {
    $wrapper: JQuery<Element>;
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
