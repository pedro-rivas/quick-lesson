import { z } from "zod";

const UserPreferencesSchema = z.object({
  language: z.string(),
  learningLanguage: z.string(),
});

export const CreateUserSchema = z.object({
  id: z.string().uuid({ message: "id must be a valid UUID" }),
  email: z.string().email({ message: "email must be a valid email address" }),
  name: z.string().min(1, { message: "name cannot be empty" }),
  // only `picture` can be null
  picture: z
    .string({
      required_error: "picture is required, use null if you don’t have one",
    })
    .url({ message: "picture must be a valid URL" })
    .nullable(),
  auth: z.object({
    provider: z.string({ required_error: "auth.provider is required" }),
  }),
  onboardingCompleted: z.boolean({
    required_error: "onboardingCompleted is required",
  }),
  preferences: UserPreferencesSchema,
});

export const CreateLessonSchema = z.object({
  userId: z.string().uuid({ message: "id must be a valid UUID" }),
  title: z.string().min(1, { message: "title cannot be empty" }),
  topic: z.string().min(1, { message: "topic cannot be empty" }),
  phrases: z
    .array(z.unknown(), { required_error: "phrases is required" })
    .nonempty({ message: "phrases cannot be empty" }),
  vocabulary: z.array(z.unknown(), {
    required_error: "vocabulary is required",
  }),
  relevantGrammar: z.array(z.unknown(), {
    required_error: "relevantGrammar is required",
  }),
  langCode: z.string({ required_error: "langCode is required" }),
  studentLangCode: z.string({ required_error: "studentLangCode is required" }),
  photoUrl: z
    .string()
    .url({ message: "photoUrl must be a valid URL" })
    .nullable(),
});
