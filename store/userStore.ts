import { LanguageCode } from "@/constants/languages";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface UserState {
  id: string | null;
  email: string | null;
  name: string | null;
  picture: string | null;
  auth: {
    provider: string | null;
  };
  onboardingCompleted: boolean;
  preferences: {
    language: LanguageCode | null;
    learningLanguage: LanguageCode | null;
  };
}

interface UserStore {
  user: UserState;
  updateUserState: (state: Partial<UserState>) => void;
  setOnboardingComplete: () => void;
  setLanguage: (language: LanguageCode) => void;
  setLearningLanguage: (language: LanguageCode) => void;
  clearUserProfile: () => void;
}

const initialState: UserState = {
  id: null,
  email: null,
  name: null,
  picture: null,
  auth: {
    provider: null,
  },
  onboardingCompleted: false,
  preferences: {
    language: null,
    learningLanguage: null,
  },
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      // State
      user: initialState,

      // Actions
      updateUserState: (updates) =>
        set((state) => ({
          user: {
            ...state.user,
            ...updates,
            preferences: { ...state.user.preferences, ...updates.preferences },
          },
        })),

      setOnboardingComplete: () =>
        set((state) => ({
          user: { ...state.user, onboardingCompleted: true },
        })),

      setLanguage: (language) =>
        set((state) => ({
          user: {
            ...state.user,
            preferences: {
              ...state.user.preferences,
              language,
            },
          },
        })),

      setLearningLanguage: (learningLanguage) =>
        set((state) => ({
          user: {
            ...state.user,
            preferences: {
              ...state.user.preferences,
              learningLanguage,
            },
          },
        })),

      clearUserProfile: () =>
        set(() => ({
          user: initialState,
        })),
    }),

    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
