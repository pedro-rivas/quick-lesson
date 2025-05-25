import QuickSafeAreaView from "@/components/layout/QuickSafeAreaView";
import { Lesson, useLessonStore } from "@/store/lessonStore";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function LessonsScreen() {
  const { getAllLessons, removeLesson } = useLessonStore();
  const lessons = getAllLessons();

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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderLessonCard = ({ item }: { item: Lesson }) => (
    <Pressable 
      style={styles.card} 
      onPress={() => handleViewLesson(item)}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.lessonTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Pressable
            onPress={() => handleDeleteLesson(item.id, item.title)}
            style={styles.deleteButton}
          >
            <MaterialIcons name="delete" size={20} color="#ff5252" />
          </Pressable>
        </View>
        
        <View style={styles.cardDetails}>
          <Text style={styles.languageText}>{item.language}</Text>
          <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{item.vocabulary.length}</Text>
            <Text style={styles.statLabel}>Vocabulary</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{item.phrases.length}</Text>
            <Text style={styles.statLabel}>Phrases</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{item.relevantGrammar.length}</Text>
            <Text style={styles.statLabel}>Grammar</Text>
          </View>
        </View>
      </View>
      
      <AntDesign name="right" size={16} color="#999" style={styles.chevron} />
    </Pressable>
  );

  if (lessons.length === 0) {
    return (
      <QuickSafeAreaView>
        <View style={styles.container}>
          <Text style={styles.title}>My Lessons</Text>
          <View style={styles.emptyState}>
            <MaterialIcons name="school" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No lessons yet</Text>
            <Text style={styles.emptySubtitle}>
              Generate your first lesson to get started
            </Text>
            <Pressable 
              style={styles.createButton} 
              onPress={() => router.push("/")}
            >
              <Text style={styles.createButtonText}>Create Lesson</Text>
            </Pressable>
          </View>
        </View>
      </QuickSafeAreaView>
    );
  }

  return (
    <QuickSafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Lessons</Text>
          <Text style={styles.subtitle}>{lessons.length} lesson{lessons.length !== 1 ? 's' : ''}</Text>
        </View>
        
        <FlatList
          data={lessons}
          renderItem={renderLessonCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </QuickSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  languageText: {
    fontSize: 14,
    color: "#0b57d0",
    fontWeight: "500",
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 14,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0b57d0",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  chevron: {
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginBottom: 32,
  },
  createButton: {
    backgroundColor: "#0b57d0",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});