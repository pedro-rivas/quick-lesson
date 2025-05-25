import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QuickSpeechButton from './QuickSpeechButton';

interface Phrase {
  phrase: string;
  transliteration?: string;
  translation: string;
}

interface QuickPhrasesSectionProps {
  phrases: Phrase[];
}

/**
 * Renders a section displaying a list of quick phrases with their transliterations and translations.
 * Each phrase is shown in a card with an optional transliteration and a sound icon.
 *
 * @param phrases - An array of phrase objects to display. Each object should contain:
 *   - `phrase`: The main phrase text.
 *   - `transliteration` (optional): The transliteration of the phrase.
 *   - `translation`: The translation of the phrase.
 *
 * @returns A React element displaying the phrases, or `null` if no phrases are provided.
 */
const QuickPhrasesSection: React.FC<QuickPhrasesSectionProps> = ({ phrases }) => {
  if (!phrases || phrases.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Phrases</Text>
      {phrases.map((phrase, idx) => (
        <View key={idx} style={styles.card}>
          <View>
            <Text style={styles.term}>{phrase.phrase}</Text>
            {phrase.transliteration ? (
              <Text style={styles.transliteration}>
                {phrase.transliteration}
              </Text>
            ) : null}
            <Text style={styles.translation}>{phrase.translation}</Text>
          </View>
          <QuickSpeechButton text={phrase.phrase} />
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

QuickPhrasesSection.displayName = 'QuickPhrasesSection';

export default QuickPhrasesSection; 