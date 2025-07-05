import * as db from "@/api/db";
import { Phrase } from "@/components/PhrasesSection";
import { Tip } from "@/components/TipsSection";
import { Vocab } from "@/components/VocabularyRow";
import { LanguageCode } from "@/constants/languages";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Lesson {
  id: string;
  userId: string;
  title: string;
  topic: string;
  phrases: Phrase[];
  vocabulary: Vocab[];
  relevantGrammar: Tip[];
  createdAt: Date;
  langCode: LanguageCode;
  studentLangCode: LanguageCode;
  photoUrl: string | null;
}

interface LessonStore {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  addLesson: (lesson: Lesson) => void;
  removeLesson: (id: string) => void;
  getLessonById: (id: string) => Lesson | undefined;
  loadLessons: ({}: {
    userId: string;
    page?: number,
    ageSize?: number
  }) => Promise<Lesson[] | void>;
  updateLesson: (
    id: string,
    updates: Partial<Omit<Lesson, "id" | "createdAt">>
  ) => void;
}

export const useLessonStore = create<LessonStore>()(
  persist(
    (set, get) => ({
      lessons: [],
      loading: false,
      error: null,
      hasMore: true,

      loadLessons: async (params) => {
        set({ loading: true, error: null });
        try {
          const {lessons: newLessons, hasMore } = await db.Lessons.getLessonsByUserId(params);
          set((state) =>{
            const existingIds = new Set(state.lessons.map((l) => l.id))
            const uniqueNew = newLessons.filter((l) => !existingIds.has(l.id))
            const merged = [...uniqueNew, ...state.lessons].sort((a, b) => {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            return { lessons: merged, loading: false, hasMore, error: null };
          })
        } catch (error) {
          set({ error: "Failed to load lessons", loading: false });
        }
      },

      addLesson: (lessonData) => {
        set((state) => ({
          lessons: [...state.lessons, lessonData],
        }));
      },

      removeLesson: (id) => {
        set((state) => ({
          lessons: state.lessons.filter((lesson) => lesson.id !== id),
        }));
      },

      getLessonById: (id) => {
        return get().lessons.find((lesson) => lesson.id === id);
      },

      updateLesson: (id, updates) => {
        set((state) => ({
          lessons: state.lessons.map((lesson) =>
            lesson.id === id ? { ...lesson, ...updates } : lesson
          ),
        }));
      },
    }),
    {
      name: "lesson-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
