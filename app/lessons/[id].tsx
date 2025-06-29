import * as Layout from "@/components/Layout";
import LessonNotFound from "@/components/LessonNotFound";
import Pager from "@/components/Pager";
import PhrasesSection from "@/components/PhrasesSection";
import SafeAreaView from "@/components/SafeAreaView";
import { TabBar } from "@/components/TabBar";
import TipsSection, { TipExample } from "@/components/TipsSection";
import VocabularySection from "@/components/VocabularySection";
import TipBottomSheet from "@/components/bottomSheets/TipBottomSheet";
import Button from "@/components/buttons/Button";
import useTranslation from "@/hooks/useTranslation";
import { useLessonStore } from "@/store/lessonStore";
import { commonStyles as cs } from "@/styles/common";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { getLessonById, removeLesson } = useLessonStore();
  const [example, setCurrentExample] = useState<TipExample | null>(null);
  const [renderAllSections, setRenderAllSections] = useState(false);

  const lesson = getLessonById(id!);

  if (!lesson) {
    return <LessonNotFound />;
  }

  useEffect(() => {
    setTimeout(() => {
      setRenderAllSections(true);
    }, 300);
  }, []);

  const t = useTranslation();

  const sections = useMemo(
    () => [
      { title: t("Vocabulary") },
      { title: t("Phrases") },
      { title: t("Tips") },
    ],
    []
  );

  const handleDeleteLesson = useCallback(() => {
    Alert.alert(
      "Delete Lesson",
      `Are you sure you want to delete "${lesson.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            removeLesson(lesson.id);
            router.back();
          },
        },
      ]
    );
  }, [lesson, removeLesson, router]);

  const handleBackPress = useCallback(() => {
    router.back();
  }, []);

  const openExplanation = useCallback((tipExample: TipExample) => {
    setCurrentExample(tipExample);
  }, []);

  const pages = useMemo(
    () => [
      {
        type: "vocabulary",
      },
      ...(renderAllSections
        ? [
            {
              type: "phrases",
            },
            {
              type: "tips",
            },
          ]
        : []),
    ],
    [lesson, renderAllSections]
  );

  return (
    <SafeAreaView>
      <Layout.Header.Row style={cs.lessonHeader}>
        <Layout.Header.Icon onPress={handleBackPress} name={"arrow-back"} />
        <Layout.Header.Title title={lesson.title} />
        <Layout.Header.Icon
          onPress={handleDeleteLesson}
          name={"delete"}
          color="#ff5252"
        />
      </Layout.Header.Row>

      <Pager
        initialPage={0}
        renderTabBar={(props) => (
          <TabBar items={sections.map((section) => section.title)} {...props} />
        )}
      >
        {pages.map((page, index) => {
          switch (page.type) {
            case "vocabulary":
              return (
                <VocabularySection
                  key={index + 1}
                  vocabulary={lesson.vocabulary}
                />
              );
            case "phrases":
              return (
                <PhrasesSection key={index + 1} phrases={lesson.phrases} />
              );
            case "tips":
              return (
                <TipsSection
                  key={index + 1}
                  tips={lesson.relevantGrammar}
                  setExplanation={openExplanation}
                />
              );
            default:
              return null;
          }
        })}
      </Pager>
      <Layout.Footer>
        <Button
          title="Practice"
          onPress={() => router.push(`/practice/${id}` as any)}
        />
      </Layout.Footer>

      {example ? (
        <TipBottomSheet
          tip={example}
          onClose={() => {
            setCurrentExample(null);
          }}
          langCode={lesson.langCode}
        />
      ) : null}
    </SafeAreaView>
  );
}
