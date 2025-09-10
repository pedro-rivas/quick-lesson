import AnimtedBottomContainer from "@/components/AnimatedBottomContainer";
import Button from "@/components/buttons/Button";
import IconButton from "@/components/buttons/IconButton";
import CompleteTheWordPage from "@/components/CompleteTheWordPage";
import * as Layout from "@/components/Layout";
import MatchWordsPage from "@/components/MatchWordsPage";
import ProgressBar from "@/components/ProgressBar";
import SafeAreaView from "@/components/SafeAreaView";
import useTranslation from "@/hooks/useTranslation";
import { useLessonStore } from "@/store/lessonStore";
import { cs } from "@/styles/common";
import { spacing } from "@/styles/spacing";
import * as lessonUtils from "@/utils/lessons";
import { useAudioPlayer } from "expo-audio";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { InteractionManager } from "react-native";
import PagerView from "react-native-pager-view";

enum LessonType {
  MATCH_WORDS,
  COMPLETE_WORDS,
}

export default function PracticeScreenPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getLessonById } = useLessonStore();
  const lesson = getLessonById(id!);

  const t = useTranslation();
  const player = useAudioPlayer("");

  const [page, setPage] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [partialLoad, setPartialLoad] = useState(true);

  const pagerRef = React.useRef<PagerView>(null);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setPartialLoad(false);
    });
  }, []);

  const handleSpeechPress = useCallback(
    (uri: string) => {
      if (uri) {
        player.replace(uri);
        player.seekTo(0);
        setTimeout(() => {
          player.play();
        }, 10);
      }
    },
    [player]
  );

  const handleComplete = useCallback(() => {
    setShowComplete(true);
    handleSpeechPress(require('../../assets/sounds/complete.mp3'));
  }, []);

  const goBack = useCallback(() => {
    router.back();
  }, []);

  const onNextPage = useCallback(() => {
    if (pagerRef.current) {
      pagerRef.current.setPage(page + 1);
      setPage((prev) => prev + 1);
      setShowComplete(false);
    }
  }, [page]);

  const exercises = useMemo(() => {
    if (!lesson?.vocabulary) return [];

    // Vocabulary - Match Words
    const vocab = lesson.vocabulary;
    const firstCount = Math.floor(vocab.length / 2);
    const firstVocabularyLesson = vocab.slice(0, firstCount);
    const secondVocabularyLesson = vocab.slice(firstCount);

    const wordExercises = lessonUtils.createWordExercises(
      firstVocabularyLesson
    );
    const firstWordExercise = wordExercises.slice(0, firstCount);
    const secondWordExercise = wordExercises.slice(firstCount);

    return [
      {
        type: LessonType.MATCH_WORDS,
        vocabulary: firstVocabularyLesson,
      },
      ...(!partialLoad
        ? [
            ...firstWordExercise.map((exercise) => ({
              type: LessonType.COMPLETE_WORDS,
              exercise,
            })),
            {
              type: LessonType.MATCH_WORDS,
              vocabulary: secondVocabularyLesson,
            },
            ...secondWordExercise.map((exercise) => ({
              type: LessonType.COMPLETE_WORDS,
              exercise,
            })),
          ]
        : []),
    ].filter(Boolean);
  }, [lesson, partialLoad]);

  const progress = useMemo(() => {
    return Math.round((page * 100) / exercises.length);
  }, [page, exercises.length]);

  return (
    <SafeAreaView>
      <Layout.Header.Row>
        <IconButton name={'close'} color={"black"} onPress={goBack} />
        <Layout.Spacer />
        <ProgressBar progress={progress} />
      </Layout.Header.Row>
      <PagerView
        ref={pagerRef}
        style={cs.f_1}
        initialPage={0}
        scrollEnabled={false}
      >
        {exercises.map((exercise, index) => {
          if (exercise.type === LessonType.MATCH_WORDS) {
            return (
              <MatchWordsPage
                key={index +1}
                vocabulary={'vocabulary' in exercise ? exercise.vocabulary : []}
                subheading={t("Tap the matching pairs")}
                topic={t("Vocabulary")}
                onComplete={handleComplete}
                onSpeechPress={handleSpeechPress}
              />
            );
          }

          if (exercise.type === LessonType.COMPLETE_WORDS) {
            return (
              <CompleteTheWordPage
                key={index +1}
                exercise={'exercise' in exercise ? exercise.exercise : {}}
                subheading={t("Complete the word")}
                onComplete={handleComplete}
                onSpeechPress={handleSpeechPress}
              />
            );
          }

          return null;
        })}
      </PagerView>
      <Layout.View padding={spacing.m} style={cs.z_1000}>
        {showComplete ? (
          <Button title={t("Continue")} onPress={onNextPage} success />
        ) : (
          <Button
            title={t("Next")}
            onPress={onNextPage}
            secondary
            disabled={partialLoad}
          />
        )}
      </Layout.View>
      <AnimtedBottomContainer show={showComplete} />
    </SafeAreaView>
  );
}