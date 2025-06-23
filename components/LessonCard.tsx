import useTheme from "@/hooks/useTheme";
import useTranslation from "@/hooks/useTranslation";
import { Lesson } from "@/store/lessonStore"; // Assuming Lesson type is here
import { commonStyles as cs } from "@/styles/common";
import { spacing } from "@/styles/spacing";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import IconButton from "./buttons/IconButton";
import CountryFlag from "./CountryFlag";
import * as Layout from "./Layout";
import * as Text from "./Text";

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
      <Layout.Column style={cs.flex1}>
        <Layout.Row
          alignItems={"center"}
          justifyContent={"space-between"}
          padding={spacing.s}
        >
          <Text.Body semibold numberOfLines={2}>
            {lesson.title}
          </Text.Body>
          <IconButton onPress={handleDelete} name={"delete"} color="#ff5252" />
        </Layout.Row>

        <Layout.Row alignItems={"center"} justifyContent={"space-between"}>
          <CountryFlag countryCode={lesson.langCode} size={"small"} />
          <Text.Caption>{`${formatDate(lesson.createdAt)}`}</Text.Caption>
        </Layout.Row>

        <Layout.Row justifyContent={"space-around"} alignItems={"center"}>
          <Layout.Column alignItems={"center"}>
            <Text.Body bold color={colors.primary}>
              {lesson.vocabulary.length}
            </Text.Body>
            <Text.Detail style={cs.mtXs}>{t("Vocabulary")}</Text.Detail>
          </Layout.Column>
          <Layout.Column alignItems={"center"}>
            <Text.Body bold color={colors.primary}>
              {lesson.phrases.length}
            </Text.Body>
            <Text.Detail style={cs.mtXs}>{t("Phrases")}</Text.Detail>
          </Layout.Column>
          <Layout.Column alignItems={"center"}>
            <Text.Body bold color={colors.primary}>
              {lesson.relevantGrammar.length}
            </Text.Body>
            <Text.Detail style={cs.mtXs}>{t("Grammar")}</Text.Detail>
          </Layout.Column>
        </Layout.Row>
      </Layout.Column>
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
});

LessonCard.displayName = "LessonCard";

export default React.memo(LessonCard);
