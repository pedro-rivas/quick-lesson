import QuickButton from '@/components/QuickButton';
import { AVAILABLE_LANGUAGES } from '@/constants/languages'; // Assuming this path is correct
import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import RNPickerSelect, { Item } from 'react-native-picker-select';

interface LessonGeneratorFormProps {
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
  topic: string;
  onTopicChange: (topic: string) => void;
  onGenerate: () => void;
  isGenerating: boolean; // To handle loading state from parent
}

const LessonGeneratorForm: React.FC<LessonGeneratorFormProps> = ({
  selectedLanguage,
  onSelectLanguage,
  topic,
  onTopicChange,
  onGenerate,
  isGenerating,
}) => {
  return (
    <View>
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

      <QuickButton 
        onPress={onGenerate}
        disabled={!topic || !selectedLanguage || isGenerating}
        title="Generate"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    backgroundColor: '#f0f4f9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerLabel: {
    fontSize: 18,
    marginRight: 4,
  },
  input: {
    backgroundColor: '#f0f4f9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    fontSize: 18,
  },
  disabledInput: {
    opacity: 0.7,
    backgroundColor: '#e0e0e0',
  }
});

export default LessonGeneratorForm; 