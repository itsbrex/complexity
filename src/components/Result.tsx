import { IconType } from "react-icons";
import { BiQuestionMark } from "react-icons/bi";

type ResultProps = {
  title: string;
  description: React.ReactNode;
  icon?: IconType;
};

export function Result({
  title,
  description,
  icon: Icon = BiQuestionMark,
}: ResultProps) {
  return (
    <div className="tw-my-4 tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-4 tw-p-4">
      <div className="tw-flex tw-flex-col tw-items-center tw-gap-2 tw-text-center">
        <Icon className="tw-size-12 tw-text-muted-foreground" />
        <h1 className="tw-text-2xl tw-font-semibold">{title}</h1>
        <div className="tw-text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}
