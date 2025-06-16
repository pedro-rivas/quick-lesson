import QuickButton from "@/components/Button";
import { AVAILABLE_LANGUAGES } from "@/constants/languages"; // Assuming this path is correct
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import RNPickerSelect, { Item } from "react-native-picker-select";
import QuickButtonIcon from "./QuickButtonIcon";

interface LessonGeneratorFormProps {
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
  topic: string;
  onTopicChange: (topic: string) => void;
  onGenerate: () => void;
  isGenerating: boolean; // To handle loading state from parent
  onClose?: () => void;
}

const LessonGeneratorForm: React.FC<LessonGeneratorFormProps> = ({
  selectedLanguage,
  onSelectLanguage,
  topic,
  onTopicChange,
  onGenerate,
  isGenerating,
  onClose,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.formContent}>
        <RNPickerSelect
          onValueChange={(_, index) =>
            onSelectLanguage(AVAILABLE_LANGUAGES[index - 1]?.label || "")
          }
          items={[...AVAILABLE_LANGUAGES] as Item[]}
          disabled={isGenerating}
        >
          <View style={[styles.picker, isGenerating && styles.disabledInput]}>
            <Text style={styles.pickerLabel}>
              {!selectedLanguage ? "Select Language" : selectedLanguage}
            </Text>
            <AntDesign name={"down"} size={16} color="#0b57d0" />
          </View>
        </RNPickerSelect>

        <TextInput
          placeholder="Taking a taxi"
          value={topic}
          onChangeText={onTopicChange}
          style={[styles.input, isGenerating && styles.disabledInput]}
          onSubmitEditing={onGenerate}
          autoFocus
          editable={!isGenerating}
        />

        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>

        <QuickButton
          onPress={onGenerate}
          disabled={!topic || !selectedLanguage || isGenerating}
          title="Generate"
          style={{flex: 1}}
        />
              {onClose ? (
        <QuickButtonIcon
          onPress={onClose}
          iconName="close"
          style={styles.closeButton}
        />
      ) : null}
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f0f4f9",
    padding: 16,
    borderRadius: 8,
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
