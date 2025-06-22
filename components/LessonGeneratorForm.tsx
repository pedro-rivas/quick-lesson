import Button from "@/components/buttons/Button";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Animated from "react-native-reanimated";

interface LessonGeneratorFormProps {
  topic: string;
  onTopicChange: (topic: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const LessonGeneratorForm: React.FC<LessonGeneratorFormProps> = ({
  topic,
  onTopicChange,
  onGenerate,
  isGenerating,
}) => {
  return (
    <Animated.View style={[styles.container]}>
      <View style={styles.formContent}>
        <TextInput
          placeholder="Taking a taxi"
          value={topic}
          onChangeText={onTopicChange}
          style={[styles.input, isGenerating && styles.disabledInput]}
          onSubmitEditing={onGenerate}
          autoFocus={true}
          editable={!isGenerating}
        />

        <Button
          onPress={onGenerate}
          disabled={!topic || isGenerating}
          title="Generate"
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 8,
    zIndex: 1000,
  },
  formContent: {
    flex: 1,
    marginRight: 8,
  },
  picker: {
    backgroundColor: "#f0f4f9",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerLabel: {
    fontSize: 18,
    marginRight: 4,
  },
  input: {
    backgroundColor: "#f0f4f9",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    fontSize: 18,
  },
  disabledInput: {
    opacity: 0.7,
    backgroundColor: "#e0e0e0",
  },
  closeButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: "#e0e0e0",
    marginLeft: 16,
  },
});

export default LessonGeneratorForm;
