import { createLesson } from "@/api/gemini";
import IconButton from "@/components/buttons/IconButton";
import * as Layout from "@/components/Layout";
import LessonGeneratorForm from "@/components/LessonGeneratorForm";
import SafeAreaView from "@/components/SafeAreaView";
import * as Text from "@/components/Text";
import { LANGUAGES } from "@/constants/languages";
import useTheme from "@/hooks/useTheme";
import useTranslation from "@/hooks/useTranslation";
import { useLessonStore } from "@/store/lessonStore";
import { useUserStore } from "@/store/userStore";
import { spacing } from "@/styles/spacing";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { Alert } from "react-native";
import { ZoomIn, ZoomOut } from "react-native-reanimated";

export default function HomeScreen() {
  const [topic, setTopic] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showLessonForm, setShowCreateLessonFrom] = React.useState(false);

  const { addLesson, getAllLessons, removeLesson } = useLessonStore();
  const userLanguage = useUserStore((s) => s.userPreferences.preferredLanguage);
  const learningLanguage = useUserStore(
    (s) => s.userPreferences.learningLanguage
  );
  const t = useTranslation();
  const theme = useTheme();

  const generate = async () => {
    try {
      if (!topic) return;
      setShowCreateLessonFrom(false);
      setLoading(true);

      const lesson = await createLesson({
        studentLanguage: userLanguage,
        learningLanguage: learningLanguage,
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

  const switchLanguage = useCallback(() => {
    router.push("/account/choose-language");
  }, []);

  return (
    <SafeAreaView>
      <Layout.Header>
        <IconButton name={"arrow-back"} onPress={goBack} />
        <Text.Header numberOfLines={1}>{"Create a lesson"}</Text.Header>
        <IconButton name={"language"} onPress={switchLanguage} />
      </Layout.Header>
      <Layout.Column padding={spacing.m}>
        <Text.LandingHeader
          style={[{ color: theme.colors.primary }]}
        >{`${LANGUAGES[learningLanguage]?.label} for `}</Text.LandingHeader>
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
        topic={topic}
        onTopicChange={setTopic}
        onGenerate={generate}
        isGenerating={loading}
      />
    </SafeAreaView>
  );
}
