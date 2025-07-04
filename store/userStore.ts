import { LanguageCode } from "@/constants/languages";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface UserPreferences {
  language: LanguageCode | null;
  learningLanguage: LanguageCode | null;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture: string;
  auth: {
    provider: string;
  };
  onboardingCompleted?: boolean;
}

interface UserStore {
  userPreferences: UserPreferences;
  userProfile: UserProfile | null;
  setLanguage: (language: LanguageCode) => void;
  setLearningLanguage: (language: LanguageCode) => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  getUserPreferences: () => UserPreferences;
  resetUserPreferences: () => void;
  setUserProfile: (profile: UserProfile) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  getUserProfile: () => UserProfile | null;
  clearUserProfile: () => void;
  isAuthenticated: () => boolean;
}

const initialUserPreferences: UserPreferences = {
  language: null,
  learningLanguage: null,
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      userPreferences: initialUserPreferences,
      userProfile: null,

      setLanguage: (language: LanguageCode) => {
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            language: language,
          },
        }));
      },

      setLearningLanguage: (language: LanguageCode) => {
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            learningLanguage: language,
          },
        }));
      },

      updateUserPreferences: (preferences: Partial<UserPreferences>) => {
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            ...preferences,
          },
        }));
      },

      getUserPreferences: () => {
        return get().userPreferences;
      },

      resetUserPreferences: () => {
        set((state) => ({
          userPreferences: initialUserPreferences,
        }));
      },

      setUserProfile: (profile: UserProfile) => {
        set((state) => ({
          userProfile: profile,
        }));
      },

      updateUserProfile: (profile: Partial<UserProfile>) => {
        set((state) => ({
          userProfile: state.userProfile ? {
            ...state.userProfile,
            ...profile,
          } : null,
        }));
      },

      getUserProfile: () => {
        return get().userProfile;
      },

      clearUserProfile: () => {
        set((state) => ({
          userProfile: null,
        }));
      },

      isAuthenticated: () => {
        return get().userProfile !== null;
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
