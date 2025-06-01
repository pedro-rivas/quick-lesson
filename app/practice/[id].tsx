import QuickSafeAreaView from "@/components/layout/QuickSafeAreaView";
import * as QuickLayout from "@/components/QuickLayout";
import * as QuickText from "@/components/QuickText";
import * as QuickList from "@/components/QuikList";
import { useLessonStore, VocabularyItem } from "@/store/lessonStore";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface VocabularyItemWithState extends VocabularyItem {
  selected: boolean;
  matched: boolean;
}

export default function PracticeScreenPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getLessonById } = useLessonStore();
  const lesson = getLessonById(id!);
  

  const [vocabulary, setVocabulary] = useState<VocabularyItemWithState[]>(
    (lesson?.vocabulary || []).map((v) => ({
      ...v,
      selected: false,
      matched: false,
    }))
  );

  const handleSelect = useCallback((item: VocabularyItemWithState) => {
    setVocabulary((prev) =>
      prev.map((v) =>
        v.term === item.term ? { ...v, selected: !v.selected } : v
      )
    );
  }, []);

  const renderVocabulary = useCallback(
    (vocabulary: VocabularyItemWithState[]) => {
      return vocabulary.map((v) => (
        <QuickLayout.Row
          justifyContent="space-between"
          gap={16}
          style={{ marginBottom: 16 }}
          key={v.term}
        >
          <TouchableOpacity
            style={[styles.card, v.selected && styles.selected]}
            onPress={() => handleSelect(v)}
          >
            <View>
              <QuickText.BodyText>{v.term}</QuickText.BodyText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.card, v.selected && styles.selected]}
            onPress={() => handleSelect(v)}
          >
            <View>
              <QuickText.BodyText>{v.translation}</QuickText.BodyText>
            </View>
          </TouchableOpacity>
        </QuickLayout.Row>
      ));
    },
    []
  );

  return (
    <QuickSafeAreaView>
      <QuickList.ScrollView style={styles.container}>
        <QuickText.Subheading>Tap the matching pairs</QuickText.Subheading>
        <QuickLayout.Spacer />
        <QuickText.BodyText>Vocabulary</QuickText.BodyText>
        <QuickLayout.Spacer />
        {renderVocabulary(vocabulary)}
      </QuickList.ScrollView>
    </QuickSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ebebeb",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  selected: {
    backgroundColor: "#0b57d0",
    borderColor: "#0b57d0",
  },
});
