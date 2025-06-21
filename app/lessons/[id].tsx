import * as Layout from "@/components/Layout";
import LessonNotFound from "@/components/LessonNotFound";
import * as List from "@/components/List";
import Pager from "@/components/Pager";
import PhrasesSection from "@/components/PhrasesSection";
import TipsSection from "@/components/QuickTipsSection";
import SafeAreaView from "@/components/SafeAreaView";
import { TabBar } from "@/components/TabBar";
import VocabularySection from "@/components/VocabularySection";
import Button from "@/components/buttons/Button";
import IconButton from "@/components/buttons/IconButton";
import useTranslation from "@/hooks/useTranslation";
import { useLessonStore } from "@/store/lessonStore";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { getLessonById, removeLesson } = useLessonStore();
  const [explanation, setExplanation] = useState("");

  const lesson = getLessonById(id!);

  const t = useTranslation();

  if (!lesson) {
    return <LessonNotFound />;
  }

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

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setExplanation("");
    }
  }, []);

  const handleBackPress = useCallback(() => {
    router.back();
  }, []);

  const pages = useMemo(()=>([
    {
      type: "vocabulary",
      content: <VocabularySection vocabulary={lesson.vocabulary} />,
    },
    {
      type: "phrases",
      content: <PhrasesSection phrases={lesson.phrases} />,
    },
    {
      type: "tips",
      content: (
        <TipsSection
          tips={lesson.relevantGrammar}
          setExplanation={setExplanation}
        />
      ),
    },
  ]),[lesson]);

  return (
    <SafeAreaView>
      <Layout.Header
        style={{
          paddingHorizontal: 8,
          borderBottomWidth: 0,
        }}
      >
        <IconButton onPress={handleBackPress} name={"arrow-back"} />
        <Text style={styles.title} numberOfLines={1}>
          {lesson.title}
        </Text>
        <IconButton
          onPress={handleDeleteLesson}
          name={"delete"}
          color="#ff5252"
        />
      </Layout.Header>

      <Pager
        initialPage={0}
        renderTabBar={(props) => (
          <TabBar items={sections.map((section) => section.title)} {...props} />
        )}
      >
        {pages.map((page, index) => (
          <List.ScrollView
            key={index}
            style={{ flex: 1, padding: 16 }}
            showsVerticalScrollIndicator={false}
          >
            {page.content}
          </List.ScrollView>
        ))}
      </Pager>
      <Layout.Footer>
        <Button
          title="Practice"
          onPress={() => router.push(`/practice/${id}` as any)}
        />
      </Layout.Footer>

      {explanation ? (
        <BottomSheet
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
          handleIndicatorStyle={{ backgroundColor: "#fff" }}
          backgroundStyle={{ backgroundColor: "#0b57d0" }}
        >
          <BottomSheetView style={styles.bottomSheetView}>
            <Text style={{ color: "#fff", fontSize: 18 }}>{explanation}</Text>
          </BottomSheetView>
        </BottomSheet>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  lessonInfo: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    flexShrink: 1,
    marginHorizontal: 16,
  },
  bottomSheetView: {
    flex: 1,
    padding: 24,
    backgroundColor: "#0b57d0",
  },
});
