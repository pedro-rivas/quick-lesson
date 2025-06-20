import useTranslation from "@/hooks/useTranslation";
import { Lesson } from "@/store/lessonStore"; // Assuming Lesson type is here
import { useTheme } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import IconButton from "./buttons/IconButton";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const MIN_SCALE = 0.99;

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
  const t = useTranslation();

  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(pressed.value, [0, 1], [1, MIN_SCALE]),
      },
    ],
    borderColor: colors.border,
    borderBottomWidth: interpolate(pressed.value, [0, 1], [2, 1]),
    backgroundColor: interpolateColor(
      pressed.value,
      [0, 1],
      ["#fff", "rgba(245, 245, 245, 0.4)"]
    ),
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      pressed.value,
      [0, 1],
      ["#fff", "rgba(245, 245, 245, 0.4)"]
    ),
  }));

  const onPressOut = () => {
    "worklet";
    pressed.value = 0;
  };

  const handlePress = () => {
    "worklet";
    pressed.value = 1;
    runOnJS(vibrate)();
    runOnJS(onView)(lesson);
  };

  const handleDelete = () => {
    onDelete(lesson.id, lesson.title);
  };

  const vibrate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressOut={onPressOut}
      style={[styles.lessonCard, animatedStyle]}
    >
      <View style={styles.lessonCardContent}>
        <View style={styles.lessonCardHeader}>
          <Text style={styles.lessonTitleText} numberOfLines={2}>
            {lesson.title}
          </Text>
          <IconButton
            onPress={handleDelete}
            name={"delete"}
            color="#ff5252"
            animatedStyle={iconAnimatedStyle}
          />
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
            <Text style={styles.lessonStatLabel}>{t("Vocabulary")}</Text>
          </View>
          <View style={styles.lessonStat}>
            <Text style={styles.lessonStatNumber}>{lesson.phrases.length}</Text>
            <Text style={styles.lessonStatLabel}>{t("Phrases")}</Text>
          </View>
          <View style={styles.lessonStat}>
            <Text style={styles.lessonStatNumber}>
              {lesson.relevantGrammar.length}
            </Text>
            <Text style={styles.lessonStatLabel}>{t("Grammar")}</Text>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  lessonCard: {
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  lessonCardContent: {
    flex: 1,
  },
  lessonCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 8,
    paddingRight: 8,
    paddingBottom: 0,
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
    paddingHorizontal: 16,
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
    paddingBottom: 16,
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
