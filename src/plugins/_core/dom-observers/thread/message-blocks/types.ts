export type MessageBlock = {
  nodes: {
    $wrapper: JQuery<HTMLElement>;
    $query: JQuery<HTMLElement>;
    $queryHoverContainer: JQuery<HTMLElement>;
    $sources: JQuery<HTMLElement>;
    $answerHeading: JQuery<HTMLElement>;
    $answer: JQuery<HTMLElement>;
    $bottomBar: JQuery<HTMLElement>;
  };
  content: {
    title: string;
  };
  states: {
    isInFlight: boolean;
    isEditingQuery: boolean;
    isReadOnly: boolean;
  };
};
