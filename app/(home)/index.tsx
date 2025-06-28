import * as Layout from "@/components/Layout";
import LessonCard from "@/components/LessonCard";
import LessonEmptyState from "@/components/LessonEmptyState";
import * as List from "@/components/List";
import Pager, { RenderTabBarFnProps } from "@/components/Pager";
import SafeAreaView from "@/components/SafeAreaView";
import { TabBar } from "@/components/TabBar";
import VocabularyRow, { Vocab } from "@/components/VocabularyRow";
import useTranslation from "@/hooks/useTranslation";
import { Lesson, useLessonStore } from "@/store/lessonStore";
import { spacing } from "@/styles/spacing";
import { useAudioPlayer } from "expo-audio";
import { router } from "expo-router";
import React, { useCallback, useMemo } from "react";


export default function HomeScreen() {
  const { getAllLessons } = useLessonStore();
  const lessons = getAllLessons();

  const t = useTranslation();
  const player = useAudioPlayer("");

  const sections = useMemo(
    () => [{ title: t("My Lessons") }, { title: t("Vocabulary") }],
    []
  );

  const { allVocabulary, vocabs, lessonsCount } = useMemo(() => {
    const all = lessons.flatMap((lesson) => lesson.vocabulary || []);
    return {
      allVocabulary: all,
      vocabs: all.length,
      lessonsCount: lessons.length,
    };
  }, [lessons]);

  const handleViewLesson = useCallback((lesson: Lesson) => {
    router.push(`/lessons/${lesson.id}` as any);
  }, []);

  const handleVocabPress = useCallback((uri: string) => {
    if (uri) {
      player.replace(uri);
      player.seekTo(0);
      setTimeout(() => {
        player.play();
      }, 10);
    }
  }, []);

  const handleCreateLesson = useCallback(() => {
    router.push("/create-lesson");
  }, []);

  const renderItem = useCallback(({ item }: { item: Lesson }) => {
    return <LessonCard lesson={item} onPress={handleViewLesson} />;
  }, []);

  const renderVocab = useCallback(
    ({ item, index }: { item: Vocab; index: number }) => {
      return (
        <VocabularyRow
          vocab={item}
          vocabs={vocabs}
          idx={index}
          showBorder={false}
          showFlag={true}
          onPress={handleVocabPress}
        />
      );
    },
    [vocabs]
  );

  const renderTabBar = useCallback(
    (props: RenderTabBarFnProps) => {
      return (
        <TabBar items={sections.map((section) => section.title)} {...props} />
      );
    },
    [sections]
  );

  return (
    <SafeAreaView>
      <Pager initialPage={0} renderTabBar={renderTabBar}>
        <Layout.Column key={1} mh={spacing.m}>
          <List.Section
            data={lessons}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            windowSize={9}
            nestedScrollEnabled={true}
            pinchGestureEnabled={false}
            initialNumToRender={10}
            ListHeaderComponent={
              <Layout.Header.Section
                title={`${lessonsCount} ${t("Lessons")}`}
              />
            }
            ListEmptyComponent={<LessonEmptyState />}
          />
        </Layout.Column>

        <Layout.Column key={2} mh={spacing.m}>
          <List.Section
            data={allVocabulary}
            renderItem={renderVocab}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            windowSize={9}
            nestedScrollEnabled={true}
            pinchGestureEnabled={false}
            initialNumToRender={10}
            ListHeaderComponent={
              <Layout.Header.Section title={`${vocabs} ${t("Words")}`} />
            }
            ListEmptyComponent={<LessonEmptyState />}
          />
        </Layout.Column>
      </Pager>
    </SafeAreaView>
  );
}