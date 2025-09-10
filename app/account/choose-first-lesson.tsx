import * as Layout from "@/components/Layout";
import LessonCard from "@/components/LessonCard";
import * as List from "@/components/List";
import SafeAreaView from "@/components/SafeAreaView";
import { INITIAL_LESSONS } from "@/constants/languages";
import useTheme from "@/hooks/useTheme";
import useTranslation from "@/hooks/useTranslation";
import { Lesson } from "@/store/lessonStore";
import { useUserStore } from "@/store/userStore";
import { spacing } from "@/styles/spacing";
import { router } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { ListRenderItem } from "react-native";

export default function ChooseFirstLessonScreen() {
  const learningLanguage = useUserStore(
    (s) => s.user.preferences.learningLanguage
  );

  const t = useTranslation();
  const theme = useTheme();

  const goBack = useCallback(() => {
    router.back();
  }, []);

  const handleNext = useCallback((lesson: Lesson) => {
    router.push({
      pathname: "/account/creating-account",
      params: { title: lesson.title, langCode: lesson.langCode },
    });
  }, []);

  const initialLessons = useMemo(
    () =>
      INITIAL_LESSONS.map((lesson, i) => ({
        id: `$lesson-${i}`,
        langCode: learningLanguage,
        title: t(lesson.title as any),
      })) as Lesson[],
    [learningLanguage]
  );

  const renderItem = useCallback<ListRenderItem<Lesson>>(
    ({ item }) => <LessonCard lesson={item} onPress={handleNext} />,
    [theme]
  );

  return (
    <SafeAreaView>
      <Layout.Header.Row>
        <Layout.Header.Icon name={"arrow-back"} onPress={goBack} />
        <Layout.Header.Title title={t("Choose a Lesson")} />
        <Layout.Header.Spacer />
      </Layout.Header.Row>
      <Layout.Column ph={spacing.m} flex={1}>
        <List.Section
          ListHeaderComponent={
            <Layout.Header.SectionTitle title={t("Choose your first lesson")} />
          }
          data={initialLessons}
          renderItem={renderItem}
          initialNumToRender={8}
          showsVerticalScrollIndicator={false}
        />
      </Layout.Column>
    </SafeAreaView>
  );
}
