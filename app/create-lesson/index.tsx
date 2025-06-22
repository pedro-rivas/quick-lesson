import { createLesson } from "@/api/gemini";
import IconButton from "@/components/buttons/IconButton";
import * as Layout from "@/components/Layout";
import LessonGeneratorForm from "@/components/LessonGeneratorForm";
import SafeAreaView from "@/components/SafeAreaView";
import * as Text from "@/components/Text";
import { LanguageCode, LANGUAGES } from "@/constants/languages";
import useTheme from "@/hooks/useTheme";
import useTranslation from "@/hooks/useTranslation";
import { useLessonStore } from "@/store/lessonStore";
import { useUserStore } from "@/store/userStore";
import { spacing } from "@/styles/spacing";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { Alert, StyleSheet } from "react-native";
import { ZoomIn, ZoomOut } from "react-native-reanimated";

export default function HomeScreen() {
  const [selectedLanguage, setSelectedLanguage] =
    React.useState<LanguageCode | null>(null);
  const [topic, setTopic] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showLessonForm, setShowCreateLessonFrom] = React.useState(false);

  const { addLesson, getAllLessons, removeLesson } = useLessonStore();
  const { getUserPreferences } = useUserStore();
  const userPreferences = getUserPreferences();
  const userLanguage = userPreferences.preferredLanguage;
  const lessons = getAllLessons();
  const t = useTranslation();
  const theme = useTheme();

  const generate = async () => {
    try {
      if (!selectedLanguage || !topic) return;
      setShowCreateLessonFrom(false);
      setLoading(true);

      const lesson = await createLesson({
        studentLanguage: userLanguage,
        learningLanguage: selectedLanguage,
        topic,
      });

      addLesson(lesson);

      setTopic("");

      router.back();
    } catch (error: any) {
      Alert.alert(t("Something went wrong"), error.message);
    } finally {
      setLoading(false);
    }
  };

  const goBack = useCallback(() => {
    router.back();
  }, []);

  const switchLanguage = useCallback(() => {}, []);

  return (
    <SafeAreaView>
      <Layout.Header>
        <IconButton name={"arrow-back"} onPress={goBack} />
        <Text.Header numberOfLines={1}>{"Create a lesson"}</Text.Header>
        <IconButton name={"language"} onPress={goBack} />
      </Layout.Header>
      <Layout.Column padding={spacing.m}>
        <Text.LandingHeader
          style={[{ color: theme.colors.primary }]}
        >{`${LANGUAGES[selectedLanguage]?.label} for `}</Text.LandingHeader>
        {topic ? (
          <Text.Animated
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#32CD32",
            }}
          >
            {topic?.split("").map((l, i) => (
              <Text.Animated
                entering={ZoomIn}
                exiting={ZoomOut}
                key={i}
              >{`${l}`}</Text.Animated>
            ))}
          </Text.Animated>
        ) : null}
      </Layout.Column>

      <LessonGeneratorForm
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
        topic={topic}
        onTopicChange={setTopic}
        onGenerate={generate}
        isGenerating={loading}
        onClose={goBack}
      />
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
