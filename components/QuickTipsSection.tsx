import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import QuickSpeechButton from './SpeechButton';

interface Example {
  sentence: string;
  translation: string;
  explanation: string;
}

interface Tip {
  topic: string;
  description: string;
  examples?: Example[];
}

interface QuickTipsSectionProps {
  tips: Tip[];
  setExplanation: (explanation: string) => void;
}

/**
 * Renders a section displaying quick tips, each with a topic, description, and optional examples.
 * Each example can be pressed to set an explanation and includes a speech button for pronunciation.
 *
 * @param tips - An array of tip objects to display. Each tip contains a topic, description, and optional examples.
 * @param setExplanation - Callback function to set the explanation text when an example is pressed.
 *
 * @returns A React element displaying the tips and their examples, or null if no tips are provided.
 */
const QuickTipsSection: React.FC<QuickTipsSectionProps> = ({ tips, setExplanation }) => {
  if (!tips || tips.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Tips</Text>
      {tips.map((tip, idx) => (
        <View key={idx} style={styles.tipCard}>
          <Text style={styles.tipTopic}>{tip.topic}</Text>
          <Text style={styles.tipDescription}>{tip.description}</Text>
          {tip.examples && tip.examples.length > 0 && (
            <View style={{ marginTop: 24 }}>
              <Text style={styles.examplesLabel}>EXAMPLES</Text>
              <View style={styles.examplesRow}>
                {tip.examples.map((ex, exIdx: number) => (
                  <View key={exIdx} style={styles.exampleCard}>
                    <Pressable onPress={() => setExplanation(ex.explanation)} style={{ flex: 1 }}>
                      <Text style={styles.exampleGerman}>
                        <AntDesign
                          name={'infocirlceo'}
                          size={15}
                          color="#1a237e"
                        />
                        {" " + ex.sentence}
                      </Text>
                      <Text style={styles.exampleEnglish}>
                        {ex.translation}
                      </Text>
                    </Pressable>
                    <QuickSpeechButton text={ex.sentence} />
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  tipCard: {
    backgroundColor: '#eaf4fb',
    borderRadius: 32,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tipTopic: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 12,
  },
  tipDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  examplesLabel: {
    fontSize: 13,
    color: '#7b8a97',
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 1,
  },
  examplesRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  exampleCard: {
    backgroundColor: '#dbeafe',
    borderRadius: 20,
    padding: 16,
    flex: 1,
    minWidth: 180, // Ensure cards don't get too small when wrapped
    marginBottom: 12,
    // marginRight: 12, // Removed as gap is used in examplesRow
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exampleGerman: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  exampleEnglish: {
    fontSize: 15,
    color: '#444',
  },
});

QuickTipsSection.displayName = 'QuickTipsSection';

export default QuickTipsSection; 