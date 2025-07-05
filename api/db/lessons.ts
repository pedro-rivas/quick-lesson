import { LESSONS_TABLE_NAME, SYSTEM_ID } from "@/constants/config";
import { LanguageCode } from "@/constants/languages";
import { supabase } from "@/lib/supabase";
import { Lesson } from "@/store/lessonStore";
import { logger } from "@/utils";
import { PostgrestError } from "@supabase/supabase-js";
import { CreateLessonSchema } from "./schemas";

type PartialLesson = Omit<Lesson, "id" | "createdAt">;

export async function createLesson(raw: PartialLesson): Promise<Lesson> {
  const lesson = CreateLessonSchema.parse(raw) as PartialLesson;

  const { data, error } = await supabase
    .from(LESSONS_TABLE_NAME)
    .insert({
      user_id: lesson.userId,
      title: lesson.title,
      topic: lesson.topic,
      lang_code: lesson.langCode,
      student_lang_code: lesson.studentLangCode,
      phrases: lesson.phrases,
      vocabulary: lesson.vocabulary,
      relevant_grammar: lesson.relevantGrammar,
      image_url: lesson?.photoUrl || null,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return rowDataToLesson(data);
}

export async function getLesson({
  title,
  langCode,
  studentLangCode,
}: {
  title: string;
  langCode: LanguageCode;
  studentLangCode: LanguageCode;
}): Promise<Lesson | null> {
  const { data, error } = await supabase
    .from(LESSONS_TABLE_NAME)
    .select("*")
    .eq("title", title)
    .eq("lang_code", langCode)
    .eq("student_lang_code", studentLangCode)
    .single();

  // Need to improve this to check the type of error
  if (error) {
    if ((error as PostgrestError).code !== "PGRST116") {
      console.error("Error fetching lesson:", error);
    }
    return null;
  }

  if (!data) {
    return null;
  }

  return rowDataToLesson(data);
}

const PAGE_SIZE = 15;

export async function getLessonsByUserId({
  userId,
  page = 0,
  pageSize = PAGE_SIZE,
}: {
  userId: string;
  page?: number;
  pageSize?: number;
}): Promise<{
  lessons: Lesson[];
  hasMore: boolean;
}> {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error } = await supabase
    .from(LESSONS_TABLE_NAME)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false }) // Newest first
    .limit(pageSize)
    .range(from, to);

  const hasMore = data && data.length === pageSize ? true : false;

  if (error) {
    logger.recordError("api/db/lessons.ts", error);
  }

  if (!data || error) {
    return {
      lessons: [],
      hasMore,
    };
  }

  return {
    lessons: data.map(rowDataToLesson),
    hasMore,
  };
}

export async function deleteLesson(lessonId: string): Promise<void> {
  const { error } = await supabase
    .from(LESSONS_TABLE_NAME)
    .update({ user_id: SYSTEM_ID })
    .eq("id", lessonId);

  if (error) {
    logger.recordError("api/db/lessons", error);
  }
}

const rowDataToLesson = (data: any): Lesson => {
  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    topic: data.topic,
    phrases: data.phrases,
    vocabulary: data.vocabulary,
    relevantGrammar: data.relevant_grammar,
    createdAt: data.created_at,
    langCode: data.lang_code,
    studentLangCode: data.student_lang_code,
    photoUrl: data.image_url || null,
  };
};
