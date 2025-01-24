type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

export default function SettingsSection({
  title,
  children,
}: SettingsSectionProps) {
  return (
    <section>
      <h2 className="tw-mb-4 tw-text-base tw-font-medium">{title}</h2>
      <div className="tw-divide-y tw-divide-muted tw-overflow-hidden tw-rounded-md tw-bg-secondary tw-px-4">
        {children}
      </div>
    </section>
  );
}
