import { createUserProfile } from "@/api/db/user";
import * as gemini from "@/api/gemini";
import * as Layout from "@/components/Layout";
import SafeAreaView from "@/components/SafeAreaView";
import * as Text from "@/components/Text";
import { LanguageCode } from "@/constants/languages";
import useTheme from "@/hooks/useTheme";
import useTranslation from "@/hooks/useTranslation";
import { useLessonStore } from "@/store/lessonStore";
import { useUserStore } from "@/store/userStore";
import { spacing } from "@/styles/spacing";
import { logger } from "@/utils";
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
  const t = useTranslation();

  const user = useUserStore((s) => s.user);
  const { addLesson } = useLessonStore();

  const { updateUserState } = useUserStore();
  useEffect(() => {
    createAccount();
  }, []);

  const createAccount = useCallback(async () => {
    try {
      const realUser = await createUserProfile(user);
      const lesson = await gemini.lessons.createLesson({
        topic: title,
        studentLanguage: realUser.preferences.language!,
        learningLanguage: langCode,
        userId: realUser.id!,
      });
      updateUserState(realUser)
      addLesson(lesson);
      router.replace('/(home)')
    } catch (error) { 
      logger.recordError('app/account/creating-account', error)
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
          {t('Creating your first lesson...')}
        </Text.Header>
      </Layout.Column>
    </SafeAreaView>
  );
}
