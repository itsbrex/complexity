import { toast } from "@/components/ui/use-toast";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";
import packageJson from "~/package.json";

export default function Version() {
  const { mutation, settings } = useExtensionLocalStorage();

  const [clicks, setClicks] = useState(0);

  const clickResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (clickResetTimeoutRef.current) {
      clearTimeout(clickResetTimeoutRef.current);
    }

    if (clicks >= 7) {
      setClicks(0);

      if (settings?.devMode) {
        toast({
          title: "Dev mode already enabled",
        });
        return;
      }

      mutation.mutate((draft) => {
        draft.devMode = true;
      });

      toast({
        title: "Dev mode enabled",
      });
    }

    clickResetTimeoutRef.current = setTimeout(() => {
      setClicks(0);
    }, 1000);

    return () => {
      if (clickResetTimeoutRef.current) {
        clearTimeout(clickResetTimeoutRef.current);
      }
    };
  }, [clicks, settings?.devMode, mutation]);

  return (
    <div
      className="x-mx-auto x-mb-4 x-w-fit x-text-xs x-text-muted-foreground"
      onClick={() => setClicks((prev) => prev + 1)}
    >
      v{packageJson.version}
    </div>
  );
}
