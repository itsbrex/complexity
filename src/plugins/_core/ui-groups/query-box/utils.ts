export function findToolbarPortalContainer(queryBox: HTMLElement | null) {
  if (!queryBox) return null;

  const $container = $(queryBox).find("textarea").parent().next();

  return $container.length ? $container[0] : null;
}
