import AnimatedBottomContainer from "@/components/AnimatedBottomContainer";
import * as Button from "@/components/Button";
import * as Layout from "@/components/Layout";
import SafeAreaView from "@/components/layout/SafeAreaView";
import MatchWordsPage from "@/components/MatchWordsPage";
import QuickButton from "@/components/QuickButton";
import * as Text from "@/components/Text";
import { useLessonStore } from "@/store/lessonStore";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native";

export default function PracticeScreenPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getLessonById } = useLessonStore();
  const lesson = getLessonById(id!);

  const [page, setPage] = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  const handleComplete = useCallback(() => {
    setShowComplete(true);
  }, []);

  const goBack = useCallback(() => {
    router.back();
  }, []);

  return (
    <SafeAreaView>
      <Layout.Header>
        <Button.Icon
          name={"arrow.backward"}
          size={24}
          color={"black"}
          onPress={goBack}
        />
      </Layout.Header>
      <MatchWordsPage
        lesson={lesson!.vocabulary}
        subheading="Tap the matching pairs"
        topic="Vocabulary"
        onComplete={handleComplete}
      />
      <AnimatedBottomContainer show={showComplete}>
        <Text.Subheading style={{ color: "white" }}>Great job!</Text.Subheading>
        <Layout.Spacer />
        <QuickButton title="Next" secondary onPress={() => {}} />
      </AnimatedBottomContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
