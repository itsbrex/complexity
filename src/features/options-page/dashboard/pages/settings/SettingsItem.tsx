type SettingsItemProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function SettingsItem({
  title,
  description,
  children,
}: SettingsItemProps) {
  return (
    <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-4 tw-py-4">
      <div>
        <div className="tw-font-medium">{title}</div>
        {description && (
          <div className="tw-text-sm tw-text-muted-foreground">
            {description}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
