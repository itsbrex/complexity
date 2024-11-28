import { useGlobalDomObserverStore } from "@/features/plugins/_core/dom-observer/global-dom-observer-store";

type TocItem = {
  id: string;
  title: string;
  element: JQuery<Element>;
  isActive?: boolean;
};

export function useThreadTocItems() {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const activeItemIdRef = useRef<string | null>(null);

  const messageBlocks = useGlobalDomObserverStore(
    (state) => state.threadComponents.messageBlocks,
  );

  useEffect(() => {
    if (!messageBlocks) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeItemIdRef.current = entry.target.id;
            setTocItems((prev) =>
              prev.map((item) => ({
                ...item,
                isActive: item.id === entry.target.id,
              })),
            );
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "-49% 0px -49% 0px",
      },
    );

    observerRef.current = observer;

    setTocItems((prevTocItems) =>
      messageBlocks.map(({ $wrapper, title }, idx) => {
        const id = `toc-item-${idx}`;
        $wrapper.attr("id", id);
        observer.observe($wrapper[0]);
        return {
          id,
          title: title.length > 0 ? title : prevTocItems[idx].title,
          element: $wrapper,
          isActive: id === activeItemIdRef.current,
        };
      }),
    );

    return () => {
      observer.disconnect();
    };
  }, [messageBlocks]);

  return tocItems;
}
