import { createUserProfile } from "@/api/db/user";
import { createLesson } from "@/api/gemini";
import * as Layout from "@/components/Layout";
import SafeAreaView from "@/components/SafeAreaView";
import * as Text from "@/components/Text";
import { LanguageCode } from "@/constants/languages";
import useTheme from "@/hooks/useTheme";
import { useLessonStore } from "@/store/lessonStore";
import { useUserStore } from "@/store/userStore";
import { spacing } from "@/styles/spacing";
import { useLocalSearchParams, useRouter } from "expo-router/build/hooks";
import React, { useCallback, useEffect } from "react";
import { ActivityIndicator } from "react-native";

export default function ChooseFirstLessonScreen() {
  const { title, langCode } = useLocalSearchParams<{
    title: string;
    langCode: LanguageCode;
  }>();

  const router = useRouter();
  const { colors } = useTheme();

  const user = useUserStore((s) => s.user);
  const { addLesson } = useLessonStore();

  const { updateUserState } = useUserStore();
  useEffect(() => {
    createAccount();
  }, []);

  const createAccount = useCallback(async () => {
    try {
      const realUser = await createUserProfile(user);
      const lesson = await createLesson({
        topic: title,
        studentLanguage: user.preferences.language!,
        learningLanguage: langCode,
      });
      updateUserState(realUser)
      addLesson(lesson);
      router.replace('/(home)')
    } catch (error) { 
      console.log("Error creating user profile:", error);
    }
  }, [user]);

  return (
    <SafeAreaView backgroundColor={colors.primary}>
      <Layout.Column
        padding={spacing.m}
        flex={1}
        justifyContent="center"
        alignItems="center"
      >
        <ActivityIndicator color={colors.onPrimary} size={"large"} />
        <Layout.Spacer />
        <Text.Header color={colors.onPrimary}>
          {"Creating your first lesson..."}
        </Text.Header>
      </Layout.Column>
    </SafeAreaView>
  );
}
