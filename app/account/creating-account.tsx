import * as Layout from "@/components/Layout";
import SafeAreaView from "@/components/SafeAreaView";
import * as Text from "@/components/Text";
import { LanguageCode } from "@/constants/languages";
import useTheme from "@/hooks/useTheme";
import { useUserStore } from "@/store/userStore";
import { spacing } from "@/styles/spacing";
import { useLocalSearchParams } from "expo-router/build/hooks";
import React, { useCallback, useEffect } from "react";
import { ActivityIndicator } from "react-native";

export default function ChooseFirstLessonScreen() {
  const { title, langCode } = useLocalSearchParams<{
    title: string;
    langCode: LanguageCode;
  }>();

  const { colors } = useTheme();

  const user = useUserStore((s) => s.user);
  
  const { setOnboardingComplete } = useUserStore();
  useEffect(() => {
    createAccount();
  }, []);

  const createAccount = useCallback(async () => {
    // Create User in db
    // Create Lesson

    setOnboardingComplete();
  }, []);

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
