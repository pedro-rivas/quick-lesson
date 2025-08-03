import FAB, { FAB_THRESHOLD, FABRef } from "@/components/buttons/FAB";
import * as Layout from "@/components/Layout";
import LessonCard from "@/components/LessonCard";
import LessonEmptyState from "@/components/LessonEmptyState";
import * as List from "@/components/List";
import Pager, { RenderTabBarFnProps } from "@/components/Pager";
import SafeAreaView from "@/components/SafeAreaView";
import { TabBar } from "@/components/TabBar";
import VocabularyRow, { Vocab } from "@/components/VocabularyRow";
import useInsets from "@/hooks/useInsents";
import useTranslation from "@/hooks/useTranslation";
import { Lesson, useLessonStore } from "@/store/lessonStore";
import { useUserStore } from "@/store/userStore";
import { spacing } from "@/styles/spacing";
import { useAudioPlayer } from "expo-audio";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo } from "react";
import {
  ActivityIndicator,
} from "react-native";

export default function HomeScreen() {
  const { loadLessons } = useLessonStore();
  const { lessons, hasMore, loading } = useLessonStore((state) => state);
  const userId = useUserStore((state) => state.user.id!);

  useEffect(() => {
    // TODO: USE reac query or something similar to handle this
    loadLessons({
      userId,
    });
  }, []);

  const t = useTranslation();
  const player = useAudioPlayer("");
  const insets = useInsets();

  const fabRef = React.useRef<FABRef>(null);
  const refs = React.useRef({
    currentPage: 0,
    loading,
    hasMore,
    prevScrollY: 0,
  });

  refs.current.loading = loading;
  refs.current.hasMore = hasMore;

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

  const handleLoadMore = useCallback(() => {
    const { currentPage, hasMore, loading } = refs.current;
    if (!hasMore || loading) return;

    const nextPage = currentPage + 1;
    refs.current.currentPage = nextPage;

    loadLessons({
      userId,
      page: nextPage,
    });
  }, [userId]);

  const handlePressLesson = useCallback((lesson: Lesson) => {
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

  const handlePageChange = useCallback((nextPage: number) => {
    if (nextPage !== 0) {
      fabRef.current?.collapse();
    } else if (refs.current.prevScrollY < FAB_THRESHOLD) {
      fabRef.current?.expand();
    }
  }, []);

  const renderItem = useCallback(({ item }: { item: Lesson }) => {
    return <LessonCard lesson={item} onPress={handlePressLesson} />;
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
      <Pager
        initialPage={0}
        renderTabBar={renderTabBar}
        onPageSelected={handlePageChange}

      >
        <Layout.Column key={1} mh={spacing.m} collapsable={false}>
          <List.Section
            data={lessons}
            renderItem={renderItem}
            scrollEventThrottle={100}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            windowSize={9}
            nestedScrollEnabled={true}
            pinchGestureEnabled={false}
            initialNumToRender={10}
            ListHeaderComponent={
              <Layout.Header.SectionTitle
                title={`${lessonsCount} ${t("Lessons")}`}
              />
            }
            ListEmptyComponent={
              loading && !lessonsCount ? (
                <ActivityIndicator size={"large"} />
              ) : (
                <LessonEmptyState />
              )
            }
            onEndReached={handleLoadMore}
            onRefresh={handleLoadMore}
            refreshing={loading}
          />
        </Layout.Column>

        <Layout.Column key={2} mh={spacing.m} pb={insets.bottom + spacing.m} collapsable={false}>
          <List.Section
            data={allVocabulary}
            renderItem={renderVocab}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            windowSize={7}
            nestedScrollEnabled={true}
            pinchGestureEnabled={false}
            initialNumToRender={4}
            maxToRenderPerBatch={8}
            ListHeaderComponent={
              <Layout.Header.SectionTitle title={`${vocabs} ${t("Words")}`} />
            }
            ListEmptyComponent={<LessonEmptyState />}
          />
        </Layout.Column>
      </Pager>
      <FAB ref={fabRef} onPress={handleCreateLesson} />
    </SafeAreaView>
  );
}
