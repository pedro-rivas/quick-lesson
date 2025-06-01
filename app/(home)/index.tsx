import { createLesson } from "@/api/gemini";
import QuickSafeAreaView from "@/components/layout/SafeAreaView";
import LessonCard from "@/components/LessonCard";
import LessonEmptyState from "@/components/LessonEmptyState";
import LessonGeneratorForm from "@/components/LessonGeneratorForm";
import QuickButton from "@/components/QuickButton";
import useTranslation from "@/hooks/useTranslation";
import { Lesson, useLessonStore } from "@/store/lessonStore";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const studentLanguage = "spanish";

export default function HomeScreen() {
  const [selectedLanguage, setSelectedLanguage] = React.useState("");
  const [topic, setTopic] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showLessonForm, setShowCreateLessonFrom] = React.useState(false);

  const { addLesson, getAllLessons, removeLesson } = useLessonStore();
  const lessons = getAllLessons();
  const t = useTranslation();

  const generate = async () => {
    try {
      if (!selectedLanguage || !topic) return;
      setShowCreateLessonFrom(false);
      setLoading(true);

      const lesson = await createLesson({
        studentLanguage,
        selectedLanguage,
        topic,
      });

      addLesson(lesson);

      setTopic("");
    } catch (error: any) {
      Alert.alert(t("Something went wrong"), error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = (id: string, title: string) => {
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
  };

  const handleViewLesson = (lesson: Lesson) => {
    router.push(`/lessons/${lesson.id}` as any);
  };

  const renderItem = ({ item }: { item: Lesson }) => {
    return (
      <LessonCard
        lesson={item}
        onView={handleViewLesson}
        onDelete={handleDeleteLesson}
      />
    );
  };

  return (
    <QuickSafeAreaView>
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        {selectedLanguage ? (
          <Text style={styles.title}>
            <Text style={styles.bigTitle}>
              {selectedLanguage
                ? selectedLanguage.charAt(0).toUpperCase() +
                  selectedLanguage.slice(1)
                : ""}{" "}
              for
            </Text>
            {topic ? "\n" + topic : ""}
          </Text>
        ) : (
          <Text style={styles.title}>{t("Quick Lesson")}</Text>
        )}

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

          {lessons.length === 0 && !loading ? (
            <LessonEmptyState />
          ) : (
            <FlatList
              data={lessons}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.lessonListContainer}
              scrollEnabled={false}
              windowSize={9}
            />
          )}
        </View>
        {/* --- End My Lessons Section --- */}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {showLessonForm ? (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <LessonGeneratorForm
              selectedLanguage={selectedLanguage}
              onSelectLanguage={setSelectedLanguage}
              topic={topic}
              onTopicChange={setTopic}
              onGenerate={generate}
              isGenerating={loading}
              onClose={() => setShowCreateLessonFrom(false)}
            />
          </Animated.View>
        ) : (
          <View style={{ padding: 16 }}>
            <QuickButton
              onPress={() => {
                setShowCreateLessonFrom(true);
              }}
              title="New Lesson"
              loading={loading}
              disabled={loading}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </QuickSafeAreaView>
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
    marginBottom: 24,
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
  lessonsSectionContainer: {
    marginTop: 32,
  },
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
});
