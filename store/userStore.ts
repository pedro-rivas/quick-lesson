import { LanguageCode } from '@/constants/languages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface UserPreferences {
  language: LanguageCode;
  learningLanguage: LanguageCode;
  preferredLanguage: LanguageCode;
}

interface UserStore {
  userPreferences: UserPreferences;
  setLanguage: (language: LanguageCode) => void;
  setLearningLanguage: (language: LanguageCode) => void;
  setPreferredLanguage: (language: LanguageCode) => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  getUserPreferences: () => UserPreferences;
  resetUserPreferences: () => void;
}

const initialState: UserPreferences = {
      language: 'en-US',
        learningLanguage: 'es-ES',
        preferredLanguage: 'en-US',
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      userPreferences: initialState,
      
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
      
      setPreferredLanguage: (language: LanguageCode) => {
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            preferredLanguage: language,
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
          userPreferences: initialState,
        }));
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 