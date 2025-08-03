import Button from "@/components/buttons/Button";
import * as Layout from "@/components/Layout";
import useTranslation from "@/hooks/useTranslation";
import { commonStyles as cs } from "@/styles/common";
import { spacing } from "@/styles/spacing";
import React from "react";
import { StyleSheet, TextInput } from "react-native";
import Pressable from "./buttons/Pressable";
import * as Text from "./Text";

interface LessonGeneratorFormProps {
  topic: string;
  onTopicChange: (topic: string) => void;
  onGenerate: () => void;
  switchLanguage: () => void;
  isGenerating: boolean;
}

const LessonGeneratorForm: React.FC<LessonGeneratorFormProps> = ({
  topic,
  onTopicChange,
  onGenerate,
  switchLanguage,
  isGenerating,
}) => {
  const t = useTranslation();

  return (
    <Layout.Column padding={spacing.m}>
      <TextInput
        placeholder={t("Taking a Taxi")}
        value={topic}
        onChangeText={onTopicChange}
        style={[styles.input, isGenerating && styles.disabledInput]}
        placeholderTextColor={"#888"}
        onSubmitEditing={onGenerate}
        autoFocus={true}
        editable={!isGenerating}
      />
      <Button
        onPress={onGenerate}
        disabled={!topic || isGenerating}
        loading={isGenerating}
        title={t("Create Lesson")}
      />
      <Layout.Spacer size={"m"} />
      <Pressable onPress={switchLanguage} style={cs.alignSelfEnd}>
        <Text.Link>{t("Change language")}</Text.Link>
      </Pressable>
    </Layout.Column>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#f0f4f9",
    borderRadius: 16,
    padding: 16,
    marginBottom: spacing.l,
    fontSize: 18,
  },
  disabledInput: {
    opacity: 0.7,
    backgroundColor: "#e0e0e0",
  },
});

export default LessonGeneratorForm;
