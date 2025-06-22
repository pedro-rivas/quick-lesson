import QuickButton from "@/components/buttons/Button";
import LessonCard from "@/components/LessonCard";
import LessonEmptyState from "@/components/LessonEmptyState";
import * as List from "@/components/List";
import SafeAreaView from "@/components/SafeAreaView";
import { LanguageCode } from "@/constants/languages";
import useTranslation from "@/hooks/useTranslation";
import { Lesson, useLessonStore } from "@/store/lessonStore";
import { useUserStore } from "@/store/userStore";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import Animated from "react-native-reanimated";

export default function HomeScreen() {
  const [selectedLanguage, setSelectedLanguage] =
    React.useState<LanguageCode | null>(null);
  const [topic, setTopic] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const { addLesson, getAllLessons, removeLesson } = useLessonStore();
  const { getUserPreferences } = useUserStore();
  const userPreferences = getUserPreferences();
  const userLanguage = userPreferences.preferredLanguage;
  const lessons = getAllLessons();
  const t = useTranslation();

  const handleDeleteLesson = useCallback((id: string, title: string) => {
    Alert.alert(
      "Delete Lesson",
      `Are you sure you want to delete "${title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeLesson(id),
        },
      ]
    );
  }, []);

  const handleViewLesson = useCallback((lesson: Lesson) => {
    router.push(`/lessons/${lesson.id}` as any);
  }, []);

  const renderItem = useCallback(({ item }: { item: Lesson }) => {
    return (
      <LessonCard
        lesson={item}
        onView={handleViewLesson}
        onDelete={handleDeleteLesson}
      />
    );
  }, []);

  return (
    <SafeAreaView>
      <List.FlatList
        data={lessons}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lessonListContainer}
        scrollEnabled={true}
        windowSize={9}
        nestedScrollEnabled={true}
        pinchGestureEnabled={false}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>{t("Quick Lesson")}</Text>
            {/* --- My Lessons Section --- */}
            <View style={styles.lessonsSectionContainer}>
              <View style={styles.lessonsHeader}>
                <Text style={styles.lessonsTitle}>My Lessons</Text>
                {lessons.length > 0 && (
                  <Text style={styles.lessonsSubtitle}>
                    {lessons.length} lesson{lessons.length !== 1 ? "s" : ""}
                  </Text>
                )}
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={<LessonEmptyState />}
      />

      <Animated.View style={{ padding: 16 }}>
        <QuickButton
          onPress={() => {
            router.push("/create-lesson");
          }}
          title="New Lesson"
          loading={loading}
          disabled={loading}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 24,
    color: "#222",
  },
  bigTitle: {
    color: "#0b57d0",
    fontSize: 36,
  },
  bottomSheetView: {
    flex: 1,
    padding: 24,
    // backgroundColor: "#0b57d0",
  },
  lessonsSectionContainer: {},
  lessonsHeader: {
    marginBottom: 24,
  },
  lessonsTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
  },
  lessonsSubtitle: {
    fontSize: 16,
    color: "#666",
  },
  lessonListContainer: {
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  input: {
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    backgroundColor: "rgba(151, 151, 151, 0.25)",
  },
});
