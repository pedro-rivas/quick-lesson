import * as Layout from "@/components/Layout";
import * as List from "@/components/List";
import * as Text from "@/components/Text";
import { VocabularyItem } from "@/store/lessonStore";
import React from "react";
import { StyleSheet } from "react-native";

interface CompleteTheWordPageProps {
  exercise: {
    word: VocabularyItem;
    letters: string[];
  }
  subheading: string;
  topic: string;
  onComplete: () => void;
}

const CompleteTheWordPage = ({
    exercise,
    subheading,
    topic,
    onComplete,
}: CompleteTheWordPageProps) => {

    const { word, letters } = exercise;

  return (
    <List.ScrollView style={styles.container}>
      <Text.Subheading>{subheading}</Text.Subheading>
      <Layout.Spacer />
      <Text.BodyText>{topic}</Text.BodyText>
      <Layout.Spacer />
      <Layout.Row gap={16}>
        <Layout.Row>
            {letters.map((letter)=> (
         
                    <Text.BodyText style={{ fontWeight: 'bold' }}>{letter}</Text.BodyText>
             
            ))}
        </Layout.Row>
      </Layout.Row>
    </List.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});


CompleteTheWordPage.displayName = 'CompleteTheWordPage';

export default CompleteTheWordPage;