import Button from "@/components/buttons/Button";
import * as Text from "@/components/Text";
import { AVAILABLE_LANGUAGES, LanguageCode } from "@/constants/languages";
import { useUserStore } from "@/store/userStore";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import RNPickerSelect, { Item } from "react-native-picker-select";
import Animated, {
  useAnimatedKeyboard,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface LessonGeneratorFormProps {
  selectedLanguage: LanguageCode | null; // Use LanguageCode for type safety
  onSelectLanguage: (language: LanguageCode) => void;
  topic: string;
  onTopicChange: (topic: string) => void;
  onGenerate: () => void;
  isGenerating: boolean; // To handle loading state from parent
  onClose: () => void;
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
  const { setLearningLanguage } = useUserStore();

  const handleLanguageChange = (langCode: LanguageCode) => {
    // Update the learning language in the user store
    setLearningLanguage(langCode);
    // Call the parent's onSelectLanguage callback
    onSelectLanguage(langCode);
  };

  const animatedKeyboard = useAnimatedKeyboard();
  const insents = useSafeAreaInsets();
  const bottomInsets = useSharedValue(insents.bottom);
  const ty = useSharedValue(0);
  const opacity = useSharedValue(0);

  return (
    <Animated.View style={[styles.container]}>

      <View style={styles.formContent}>
        <RNPickerSelect
          onValueChange={(_, index) => {
            const langCode = AVAILABLE_LANGUAGES[index - 1]?.code || "";
            handleLanguageChange(langCode);
          }}
          items={[...AVAILABLE_LANGUAGES] as Item[]}
          disabled={isGenerating}
        >
          <View style={[styles.picker, isGenerating && styles.disabledInput]}>
            <Text.Body style={styles.pickerLabel}>
              {!selectedLanguage ? "Select Language" : selectedLanguage}
            </Text.Body>
            <AntDesign name={"down"} size={16} color="#0b57d0" />
          </View>
        </RNPickerSelect>

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
          disabled={!topic || !selectedLanguage || isGenerating}
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
