import { Phrase } from '@/components/PhrasesSection';
import { Tip } from '@/components/TipsSection';
import { Vocab } from '@/components/VocabularyRow';
import { LanguageCode } from '@/constants/languages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Lesson {
  id: string;
  title: string;
  language: string;
  topic: string;
  phrases: Phrase[];
  vocabulary: Vocab[];
  relevantGrammar: Tip[];
  createdAt: Date;
  langCode: LanguageCode,
  studentLangCode: LanguageCode,
}

interface LessonStore {
  lessons: Lesson[];
  addLesson: (lesson: Omit<Lesson, 'id' | 'createdAt'>) => string;
  removeLesson: (id: string) => void;
  getLessonById: (id: string) => Lesson | undefined;
  getAllLessons: () => Lesson[];
  updateLesson: (id: string, updates: Partial<Omit<Lesson, 'id' | 'createdAt'>>) => void;
}

export const useLessonStore = create<LessonStore>()(
  persist(
    (set, get) => ({
      lessons: [],
      
      addLesson: (lessonData) => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newLesson: Lesson = {
          ...lessonData,
          id,
          createdAt: new Date(),
        };
        
        set((state) => ({
          lessons: [...state.lessons, newLesson],
        }));
        
        return id;
      },
      
      removeLesson: (id) => {
        set((state) => ({
          lessons: state.lessons.filter((lesson) => lesson.id !== id),
        }));
      },
      
      getLessonById: (id) => {
        return get().lessons.find((lesson) => lesson.id === id);
      },
      
      getAllLessons: () => {
        return get().lessons;
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
      name: 'lesson-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);