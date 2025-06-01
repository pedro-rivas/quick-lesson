import QuickSafeAreaView from "@/components/layout/QuickSafeAreaView";
import QuickButton from "@/components/QuickButton";
import * as QuickLayout from "@/components/QuickLayout";
import QuickPhrasesSection from "@/components/QuickPhrasesSection";
import QuickTipsSection from "@/components/QuickTipsSection";
import QuickVocabularySection from "@/components/QuickVocabularySection";
import { useLessonStore } from "@/store/lessonStore";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getLessonById, removeLesson } = useLessonStore();
  const [explanation, setExplanation] = useState("");

  const lesson = getLessonById(id!);

  if (!lesson) {
    return (
      <QuickSafeAreaView>
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={64} color="#ff5252" />
            <Text style={styles.errorTitle}>Lesson not found</Text>
            <Text style={styles.errorSubtitle}>
              This lesson may have been deleted or doesn't exist.
            </Text>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>Go Back</Text>
            </Pressable>
          </View>
        </View>
      </QuickSafeAreaView>
    );
  }

  const handleDeleteLesson = () => {
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
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      setExplanation("");
    }
  };

  return (
    <QuickSafeAreaView>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backIcon}>
            <AntDesign name="left" size={24} color="#0b57d0" />
          </Pressable>

          <Pressable onPress={handleDeleteLesson} style={styles.deleteIcon}>
            <MaterialIcons name="delete" size={24} color="#ff5252" />
          </Pressable>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Lesson Info */}
          <View style={styles.lessonInfo}>
            <Text style={styles.title}>{lesson.title}</Text>
            <View style={styles.metaContainer}>
              <View style={styles.languageContainer}>
                <Text style={styles.languageText}>{lesson.language}</Text>
              </View>
              <Text style={styles.dateText}>
                {formatDate(lesson.createdAt)}
              </Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsCard}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{lesson.vocabulary.length}</Text>
              <Text style={styles.statLabel}>Vocabulary Terms</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{lesson.phrases.length}</Text>
              <Text style={styles.statLabel}>Phrases</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>
                {lesson.relevantGrammar.length}
              </Text>
              <Text style={styles.statLabel}>Grammar Tips</Text>
            </View>
          </View>

          {/* Content Sections */}
          <QuickVocabularySection vocabulary={lesson.vocabulary} />
          <QuickPhrasesSection phrases={lesson.phrases} />
          <QuickTipsSection
            tips={lesson.relevantGrammar}
            setExplanation={setExplanation}
          />
        </ScrollView>

        <QuickLayout.View style={{ padding: 16 }}>
          <QuickButton
            title="Practice"
            onPress={() => router.push(`/practice/${id}` as any)}
          />
        </QuickLayout.View>

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
      </View>
    </QuickSafeAreaView>
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
  backIcon: {
    padding: 8,
  },
  deleteIcon: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  lessonInfo: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 12,
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
  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stat: {
    alignItems: "center",
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#e0e0e0",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0b57d0",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#ff5252",
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: "#0b57d0",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomSheetView: {
    flex: 1,
    padding: 24,
    backgroundColor: "#0b57d0",
  },
});
