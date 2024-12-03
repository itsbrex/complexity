import { useQuery } from "@tanstack/react-query";

import { extensionLocalStorageQueries } from "@/services/extension-local-storage/query-keys";
import { useExtensionLocalStorageMutation } from "@/services/extension-local-storage/useExtensionLocalStorageMutation";
import { whereAmI } from "@/utils/utils";

export default function useExtensionLocalStorage() {
  if (whereAmI() !== "unknown")
    throw new Error(
      "Extension local storage can not be reactive in content scripts! Use methods form `extensionLocalStorage` instead.",
    );

  const data = useQuery(extensionLocalStorageQueries.data);
  const mutation = useExtensionLocalStorageMutation();

  return { settings: data.data, mutation };
}
