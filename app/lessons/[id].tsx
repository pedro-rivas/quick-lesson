import * as Layout from "@/components/Layout";
import LessonNotFound from "@/components/LessonNotFound";
import * as List from "@/components/List";
import Pager from "@/components/Pager";
import PhrasesSection from "@/components/QuickPhrasesSection";
import TipsSection from "@/components/QuickTipsSection";
import SafeAreaView from "@/components/SafeAreaView";
import { TabBar } from "@/components/TabBar";
import VocabularySection from "@/components/VocabularySection";
import Button from "@/components/buttons/Button";
import IconButton from "@/components/buttons/IconButton";
import { useLessonStore } from "@/store/lessonStore";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getLessonById, removeLesson } = useLessonStore();
  const [explanation, setExplanation] = useState("");

  const lesson = getLessonById(id!);

  if (!lesson) {
    return <LessonNotFound />;
  }

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

  const pages = [
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
  ];

  return (
    <SafeAreaView>
      <Layout.Header style={{
        paddingHorizontal: 8,
        borderBottomWidth: 0,
      }}>
        <IconButton onPress={handleBackPress} name={"arrow-back"} />
        <Text style={styles.title} numberOfLines={1}>{lesson.title}</Text>
        <IconButton
          onPress={handleDeleteLesson}
          name={"delete"}
          color="#ff5252"
        />
      </Layout.Header>

      <Pager
        initialPage={0}
        renderTabBar={(props) => (
          <TabBar
            items={[
              { title: "Vocabulary" },
              { title: "Phrases" },
              { title: "Tips" },
            ].map((section) => section.title)}
            {...props}
          />
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
    marginHorizontal:16,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  languageContainer: {
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  languageText: {
    fontSize: 14,
    color: "#0b57d0",
    fontWeight: "600",
  },
  dateText: {
    fontSize: 14,
    color: "#666",
  },
  bottomSheetView: {
    flex: 1,
    padding: 24,
    backgroundColor: "#0b57d0",
  },
});
