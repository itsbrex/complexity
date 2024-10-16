import { insertCss } from "@/utils/utils";

type CleanupFunction = () => void;

export function useInsertCss({
  css,
  id,
  inject = true,
}: {
  css: string;
  id: string;
  inject?: boolean;
}) {
  const cleanupRef = useRef<CleanupFunction>();

  useEffect(() => {
    const cleanup = () => {
      cleanupRef.current?.();
    };

    if (!inject) {
      cleanup();
      return;
    }

    cleanupRef.current = insertCss({
      css,
      id,
    });

    return cleanup;
  }, [css, inject, id]);
}
