import { QueryObserver } from "@tanstack/react-query";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { PplxApiService } from "@/services/pplx-api/pplx-api";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { extensionExec } from "@/types/hof";
import {
  ImageGenModel,
  isImageGenModelCode,
} from "@/types/plugins/image-gen-model-seletor.types";
import { queryClient } from "@/utils/ts-query-client";

type ImageGenModelSelectorStore = {
  selectedImageGenModel: ImageGenModel["code"];
  setSelectedImageGenModel: (
    selectedImageGenModel: ImageGenModel["code"],
  ) => void;
};

const useImageGenModelSelectorStore =
  createWithEqualityFn<ImageGenModelSelectorStore>()(
    subscribeWithSelector(
      immer(
        (set): ImageGenModelSelectorStore => ({
          selectedImageGenModel: "default",
          setSelectedImageGenModel: async (selectedImageGenModel) => {
            set({ selectedImageGenModel });
            await PplxApiService.setDefaultImageGenModel(selectedImageGenModel);
            queryClient.invalidateQueries({
              queryKey: pplxApiQueries.userSettings.queryKey,
            });
          },
        }),
      ),
    ),
  );

const imageGenModelSelectorStore = useImageGenModelSelectorStore;

async function initImageGenModelSelectorStore() {
  let firstTime = true;

  new QueryObserver(queryClient, pplxApiQueries.userSettings).subscribe(
    (data) => {
      if (data.data && firstTime) {
        imageGenModelSelectorStore.setState((state) => {
          state.selectedImageGenModel = isImageGenModelCode(
            data.data.default_image_generation_model,
          )
            ? data.data.default_image_generation_model
            : "default";
        });

        firstTime = false;
      }
    },
  );
}

extensionExec(() => initImageGenModelSelectorStore())();

export {
  initImageGenModelSelectorStore,
  imageGenModelSelectorStore,
  useImageGenModelSelectorStore,
};
