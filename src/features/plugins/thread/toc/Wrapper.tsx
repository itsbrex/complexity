import { LuX } from "react-icons/lu";

import FloatingToggle from "@/features/plugins/thread/toc/FloatingToggle";
import { usePanelPosition } from "@/features/plugins/thread/toc/usePanelPosition";
import { useThreadTocItems } from "@/features/plugins/thread/toc/useThreadTocItems";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { scrollToElement } from "@/utils/utils";

export const PANEL_WIDTH = 250;

type TocItem = {
  id: string;
  title: string;
  isActive?: boolean;
};

export default function ThreadTocWrapper() {
  const { isMobile } = useIsMobileStore();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const tocItems = useThreadTocItems();
  const { position, isFloating } = usePanelPosition() ?? {};
  const { top, left } = position ?? {};

  const handleToggleOpen = useCallback(() => setIsOpen(true), []);
  const handleToggleClose = useCallback(() => setIsOpen(false), []);

  const panelStyles = useMemo(
    () => ({
      ["--panel-width"]: `${PANEL_WIDTH}px`,
      ["--panel-top"]: top != null ? `${top}px` : undefined,
      ["--panel-left"]: !isFloating && left != null ? `${left}px` : undefined,
    }),
    [top, left, isFloating],
  ) as React.CSSProperties;

  // useScrollToActiveItem(containerRef, tocItems);

  const shouldShowToc = tocItems.length > 1 && !!position;

  useEffect(() => {
    if (!isMobile) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isOpen]);

  if (!shouldShowToc) return null;

  return (
    <>
      {isFloating && (
        <FloatingToggle isOpen={isOpen} onClick={handleToggleOpen} />
      )}
      <div
        ref={containerRef}
        className={cn(
          "tw-custom-scrollbar tw-fixed tw-top-[--panel-top]",
          "tw-max-h-[50vh] tw-w-[--panel-width] tw-overflow-y-auto",
          "tw-transition-all tw-animate-in tw-fade-in",
          {
            "tw-left-[--panel-left]": !isFloating,
            "tw-right-3 tw-rounded-md tw-border tw-border-border/50 tw-bg-secondary tw-p-4 tw-shadow-lg md:tw-right-8":
              isFloating,
            "tw-hidden": isFloating && !isOpen,
          },
        )}
        style={panelStyles}
      >
        {isFloating && <CloseButton onClick={handleToggleClose} />}
        <div className="tw-flex tw-flex-col tw-gap-2">
          {tocItems.map((item, idx) => (
            <TocItem
              key={idx}
              item={item}
              onClick={() => {
                const $element = $(`#${item.id}`);
                if ($element.length) scrollToElement($element, 0, 300);
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

const TocItem = memo(function TocItem({
  item,
  onClick,
}: {
  item: TocItem;
  onClick: () => void;
}) {
  return (
    <div
      className="tw-flex tw-cursor-pointer tw-items-center tw-gap-3"
      onClick={onClick}
    >
      <div
        className={cn("tw-h-5", {
          "tw-min-w-[3px] tw-bg-primary": item.isActive,
          "tw-min-w-[2px] tw-bg-muted-foreground": !item.isActive,
        })}
      />
      <div
        className={cn("tw-block tw-truncate tw-transition-colors", {
          "tw-font-medium tw-text-primary": item.isActive,
          "tw-text-muted-foreground hover:tw-text-foreground": !item.isActive,
        })}
      >
        {item.title}
      </div>
    </div>
  );
});

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="tw-absolute tw-right-2 tw-top-2 tw-cursor-pointer tw-rounded-full tw-p-1 tw-text-muted-foreground tw-transition-colors hover:tw-text-foreground"
      onClick={onClick}
    >
      <LuX className="tw-size-4" />
    </div>
  );
}

function useScrollToActiveItem(
  containerRef: React.RefObject<HTMLDivElement>,
  tocItems: ReturnType<typeof useThreadTocItems>,
) {
  useEffect(() => {
    const activeItem = tocItems.findIndex((item) => item.isActive);
    if (activeItem === -1) return;

    const container = containerRef.current;
    const activeElement = container?.children[0]?.children[
      activeItem
    ] as HTMLElement;

    if (container && activeElement != null) {
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeElement.getBoundingClientRect();

      if (
        activeRect.top < containerRect.top ||
        activeRect.bottom > containerRect.bottom
      ) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [tocItems, containerRef]);
}
