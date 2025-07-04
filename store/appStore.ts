import { LanguageCode } from "@/constants/languages";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Settings } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AppSettings {
  language: LanguageCode | null;
}

interface AppStore {
  settings: AppSettings;
  setLanguage: (language: LanguageCode) => void;
  getAppSettings: (settings: Settings) => void;
}

const initialSettings: AppSettings = {
  language: null,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      settings: initialSettings,

      setLanguage: (language: LanguageCode) => {
        set((state) => ({
          settings: {
            ...state.settings,
            language: language,
          },
        }));
      },

      getAppSettings: () => {
        return get().settings;
      },

      clearAppSettings: () => {
        set((state) => ({
          settings: initialSettings,
        }));
      },
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
