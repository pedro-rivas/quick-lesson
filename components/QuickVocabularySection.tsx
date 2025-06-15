import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QuickSpeechButton from './SpeechButton';

interface VocabularyItem {
  term: string;
  transliteration?: string;
  translation: string;
}

interface QuickVocabularySectionProps {
  vocabulary: VocabularyItem[];
}

/**
 * Renders a section displaying a list of vocabulary terms, each with its term, optional transliteration, and translation.
 * If the vocabulary list is empty or undefined, nothing is rendered.
 *
 * @param vocabulary - An array of vocabulary objects, each containing a term, optional transliteration, and translation.
 * @returns A React element displaying the vocabulary section, or null if no vocabulary is provided.
 */
const QuickVocabularySection: React.FC<QuickVocabularySectionProps> = ({ vocabulary }) => {
  if (!vocabulary || vocabulary.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Vocabulary</Text>
      {vocabulary.map((vocab, idx) => (
        <View key={idx} style={styles.card}>
          <View>
            <Text style={styles.term}>{vocab.term}</Text>
            {vocab.transliteration ? (
              <Text style={styles.transliteration}>
                {vocab.transliteration}
              </Text>
            ) : null}
            <Text style={styles.translation}>{vocab.translation}</Text>
          </View>
              <QuickSpeechButton text={vocab.term} />
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
  card: {
    backgroundColor: '#eaf1fb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  term: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 4,
  },
  transliteration: {
    fontSize: 16,
    color: '#5c6bc0',
    marginBottom: 4,
  },
  translation: {
    fontSize: 16,
    color: '#333',
  },
});

QuickVocabularySection.displayName = 'QuickVocabularySection';

export default QuickVocabularySection; 