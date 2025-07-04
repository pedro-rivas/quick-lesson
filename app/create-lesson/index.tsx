import { createLesson } from "@/api/gemini";
import Pressable from "@/components/buttons/Pressable";
import CountryFlag from "@/components/CountryFlag";
import * as Layout from "@/components/Layout";
import LessonGeneratorForm from "@/components/LessonGeneratorForm";
import SafeAreaView from "@/components/SafeAreaView";
import * as Text from "@/components/Text";
import { LANGUAGES } from "@/constants/languages";
import useTheme from "@/hooks/useTheme";
import useTranslation from "@/hooks/useTranslation";
import { useLessonStore } from "@/store/lessonStore";
import { useUserStore } from "@/store/userStore";
import { commonStyles as cs } from "@/styles/common";
import { spacing } from "@/styles/spacing";
import { router } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { Alert } from "react-native";

export default function CreateLessonScreen() {
  const [topic, setTopic] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const { addLesson } = useLessonStore();
  const userPreferences = useUserStore((s) => s.user.preferences);
  const userLanguage = userPreferences.language!
  const learningLanguage = userPreferences.learningLanguage!

  const t = useTranslation();
  const theme = useTheme();

  const generate = async () => {
    try {
      if (!topic) return;

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
    router.push({
      pathname: "/account/choose-language",
      params: { shouldGoBack: "true" },
    });
  }, []);

  const styles = useMemo(
    () => ({
      header: {
        color: theme.colors.primary,
      },
      subheading: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#32CD32",
        ...cs.o_60,
      } as const,
    }),
    [theme]
  );

  return (
    <SafeAreaView>
      <Layout.Header.Row>
        <Layout.Header.Icon name={"arrow-back"} onPress={goBack} />
        <Layout.Header.Title title={t("Create a lesson")} />
        <Pressable onPress={switchLanguage}>
          <CountryFlag countryCode={learningLanguage} size={"small"} />
        </Pressable>
      </Layout.Header.Row>
      <Layout.Column padding={spacing.m}>
        <Text.LandingHeader style={styles.header}>
          {`${LANGUAGES[learningLanguage]?.label} ${t("For")} `}
        </Text.LandingHeader>
        {topic ? (
          <Text.Animated style={styles.subheading}>
            {topic?.split("").map((l, i) => (
              <Text.Animated key={i}>{`${l}`}</Text.Animated>
            ))}
          </Text.Animated>
        ) : (
          <Text.Animated style={styles.subheading}>
            {t("Taking a Taxi")}
          </Text.Animated>
        )}
      </Layout.Column>

      <LessonGeneratorForm
        topic={topic}
        onTopicChange={setTopic}
        onGenerate={generate}
        isGenerating={loading}
        switchLanguage={switchLanguage}
      />
    </SafeAreaView>
  );
}
