export type QueryBoxType = "main" | "main-modal" | "space" | "follow-up";

export type MessageBlock = {
  $wrapper: JQuery<Element>;
  $answerHeading: JQuery<Element>;
  $query: JQuery<Element>;
  $answer: JQuery<Element>;
};
