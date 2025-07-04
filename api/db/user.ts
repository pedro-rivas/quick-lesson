import { USER_TABLE_NAME } from "@/constants/config";
import { supabase } from "@/lib/supabase";
import { UserState } from "@/store/userStore";
import { CreateUserSchema } from "./schemas";

export async function createUserProfile(raw: UserState): Promise<UserState> {
  const user = CreateUserSchema.parse(raw) as UserState;

  const { data, error } = await supabase
    .from(USER_TABLE_NAME)
    .insert({
      auth_id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      auth_provider: user.auth.provider,
      onboarding_completed: true,
      language: user.preferences.language,
      learning_language: user.preferences.learningLanguage,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return {
    id: user.id,
    email: data.email,
    name: data.name,
    picture: data.picture,
    auth: { provider: data.auth_provider },
    onboardingCompleted: data.onboarding_completed,
    preferences: {
      language: data.language,
      learningLanguage: data.learning_language,
    },
  };
}
