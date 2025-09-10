import * as db from "@/api/db";
import { LanguageCode, LANGUAGES } from "@/constants/languages";
import { z } from "zod";
import { generateContent } from "./content";
import { lessonTitlePrompt, termsPrompt, tipsPrompt } from "./prompts";
import { termsConfig, tipsConfig } from "./schemas";

type CreateLessonParams = {
  studentLanguage: LanguageCode;
  learningLanguage: LanguageCode;
  topic: string;
  userId: string;
};

export const createLesson = async (params: CreateLessonParams) => {
  const { studentLanguage, learningLanguage, topic, userId } = params;

  const studentLangMeta = LANGUAGES[studentLanguage];
  const targetLangMeta = LANGUAGES[learningLanguage];
  if (!studentLangMeta || !targetLangMeta) {
    throw new Error("Invalid studentLanguage or learningLanguage code.");
  }

  const titleText = await generateLessonTitle(topic, studentLangMeta.label);
  const title = sanitizeTitle(titleText);

  const existing = await db.Lessons.getLesson({
    title: title,
    langCode: learningLanguage,
    studentLangCode: studentLanguage,
  });

  if (existing) return existing;

  const [vocab, tips] = await Promise.all([
    fetchLessonVocab({
      studentLanguage,
      learningLanguage,
      topic: title,
    }),
    fetchLessonTips({
      studentLanguage,
      learningLanguage,
      topic: title,
    }),
  ]);

  const lessonPayload = {
    title: title,
    userId,
    langCode: learningLanguage,
    studentLangCode: studentLanguage,
    topic,
    phrases: vocab.phrases,
    vocabulary: vocab.vocabulary,
    relevantGrammar: tips.relevantGrammar,
    photoUrl: null,
  };

  const newLesson = await db.Lessons.createLesson(lessonPayload);

  return newLesson;
};

async function generateLessonTitle(
  topic: string,
  studentLang: string
): Promise<string> {
  const options = {
    config: {
      systemInstruction: [{ text: lessonTitlePrompt(topic, studentLang) }],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: `Create a good lesson title for ${topic}` }],
      },
    ],
  };
  const { text = "" } = await generateContent(options);
  if (!text) throw new Error("Failed to generate lesson title.");
  return text;
}

function sanitizeTitle(raw: string): string {
  return raw.replace(/[\r\n]+/g, "").trim();
}

const PhraseSchema = z.object({
  phrase: z.string(),
  transliteration: z.string().optional(),
  translation: z.string(),
});

const VocabularySchema = z.object({
  term: z.string(),
  transliteration: z.string().optional(),
  translation: z.string(),
});

const PhrasesSchema = z.array(PhraseSchema);
const VocabularyArraySchema = z.array(VocabularySchema);

async function fetchLessonVocab({
  studentLanguage,
  learningLanguage,
  topic,
}: {
  studentLanguage: LanguageCode;
  learningLanguage: LanguageCode;
  topic: string;
}) {
  const options = {
    config: {
      systemInstruction: [
        { text: termsPrompt(studentLanguage, learningLanguage) },
      ],
      ...termsConfig,
    },
    contents: [
      {
        role: "user",
        parts: [{ text: `${learningLanguage} for ${topic}` }],
      },
    ],
  };

  const resp = await generateContent(options);
  const data = resp.text ? JSON.parse(resp.text) : {};
  const phrases = PhrasesSchema.safeParse(data.phrases);
  const vocabulary = VocabularyArraySchema.safeParse(data.vocabulary);

  if (phrases.error || vocabulary.error) {
    throw new Error("Invalid response structure from terms generation.");
  }

  return {
    phrases: phrases.data.map((item) => ({
      ...item,
      langCode: learningLanguage,
    })),
    vocabulary: vocabulary.data.map((item) => ({
      ...item,
      langCode: learningLanguage,
    })),
  };
}

const TipSchema = z.object({
  sentence: z.string(),
  translation: z.string(),
  explanation: z.string(),
  transliteration: z.string().optional(),
});

const LessonTipsSchema = z.array(
  z.object({
    topic: z.string(),
    description: z.string(),
    examples: z
      .array(TipSchema)
      .min(1, { message: "At least one example is required." }),
  })
);

async function fetchLessonTips({
  studentLanguage,
  learningLanguage,
  topic,
}: {
  studentLanguage: LanguageCode;
  learningLanguage: LanguageCode;
  topic: string;
}) {
  const options = {
    config: {
      systemInstruction: [
        { text: tipsPrompt(studentLanguage, learningLanguage) },
      ],
      ...tipsConfig,
    },
    contents: [
      {
        role: "user",
        parts: [{ text: `${learningLanguage} for ${topic}` }],
      },
    ],
  };

  const resp = await generateContent(options);
  const data = resp.text ? JSON.parse(resp.text) : {};
  const relevantGrammar = LessonTipsSchema.safeParse(data.relevantGrammar);

  if (relevantGrammar.error) {
    throw new Error("Invalid response structure from tips generation.");
  }

  return {
    relevantGrammar: relevantGrammar.data.map((item) => ({
      ...item,
      langCode: learningLanguage,
    })),
  };
}
