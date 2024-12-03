export default function DesktopSidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="tw-w-max tw-max-w-[250px] tw-border-r tw-border-border">
      {children}
    </div>
  );
}
