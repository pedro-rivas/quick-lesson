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

  return rowDataToUserState(data);
}

export async function getUser(email: string): Promise<UserState | null> {

  if (!email) {
    console.log("Email is required to fetch user.");
    return null;
  }

  const { data, error } = await supabase
    .from(USER_TABLE_NAME)
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    // TODO: handle this:
    // Error fetching user: {"code": "PGRST116", "details": "The result contains 0 rows", "hint": null, "message": "JSON object requested, multiple (or no) rows returned"}
    console.log("Error fetching user:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  return rowDataToUserState(data);
}


const rowDataToUserState = (data: any): UserState => {
  return {
     id: data.id,
    email: data.email,
    name: data.name,
    picture: data.picture,
    auth: { provider: data.auth_provider },
    onboardingCompleted: data.onboarding_completed,
    preferences: {
      language: data.language,
      learningLanguage: data.learning_language,
    },
  } as UserState;
};