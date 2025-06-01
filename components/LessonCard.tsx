import { Lesson } from "@/store/lessonStore"; // Assuming Lesson type is here
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface LessonCardProps {
  lesson: Lesson;
  onView: (lesson: Lesson) => void;
  onDelete: (id: string, title: string) => void;
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  onView,
  onDelete,
}) => {
  const { colors } = useTheme();

  return (
    <Pressable
      style={[styles.lessonCard, { borderColor: colors.border }]}
      onPress={() => onView(lesson)}
    >
      <View style={styles.lessonCardContent}>
        <View style={styles.lessonCardHeader}>
          <Text style={styles.lessonTitleText} numberOfLines={2}>
            {lesson.title}
          </Text>
          <Pressable
            onPress={() => onDelete(lesson.id, lesson.title)}
            style={styles.lessonDeleteButton}
          >
            <MaterialIcons name="delete" size={20} color="#ff5252" />
          </Pressable>
        </View>

        <View style={styles.lessonCardDetails}>
          <Text style={styles.lessonLanguageText}>{lesson.language}</Text>
          <Text style={styles.lessonDateText}>
            {formatDate(lesson.createdAt)}
          </Text>
        </View>

        <View style={styles.lessonStatsContainer}>
          <View style={styles.lessonStat}>
            <Text style={styles.lessonStatNumber}>
              {lesson.vocabulary.length}
            </Text>
            <Text style={styles.lessonStatLabel}>Vocabulary</Text>
          </View>
          <View style={styles.lessonStat}>
            <Text style={styles.lessonStatNumber}>{lesson.phrases.length}</Text>
            <Text style={styles.lessonStatLabel}>Phrases</Text>
          </View>
          <View style={styles.lessonStat}>
            <Text style={styles.lessonStatNumber}>
              {lesson.relevantGrammar.length}
            </Text>
            <Text style={styles.lessonStatLabel}>Grammar</Text>
          </View>
        </View>
      </View>
      <AntDesign
        name="right"
        size={16}
        color="#999"
        style={styles.lessonChevron}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  lessonCard: {
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
    borderWidth: 1,
    borderColor: "#ebebeb",
  },
  lessonCardContent: {
    flex: 1,
  },
  lessonCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  lessonTitleText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    flex: 1,
    marginRight: 8,
  },
  lessonDeleteButton: {
    padding: 4,
  },
  lessonCardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  lessonLanguageText: {
    fontSize: 14,
    color: "#0b57d0",
    fontWeight: "500",
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  lessonDateText: {
    fontSize: 14,
    color: "#666",
  },
  lessonStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  lessonStat: {
    alignItems: "center",
  },
  lessonStatNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0b57d0",
  },
  lessonStatLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  lessonChevron: {
    marginLeft: 8,
  },
});

LessonCard.displayName = "LessonCard";

export default React.memo(LessonCard);
