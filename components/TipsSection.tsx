import { LanguageCode } from "@/constants/languages";
import useTranslation from "@/hooks/useTranslation";
import { commonStyles as cs } from "@/styles/common";
import { spacing } from "@/styles/spacing";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import * as Layout from "./Layout";
import SpeechButton from "./SpeechButton";
import * as Text from "./Text";

export interface TipExample {
  sentence: string;
  translation: string;
  explanation: string;
}

export interface Tip {
  topic: string;
  description: string;
  examples?: TipExample[];
}

interface TipsSectionProps {
  tips: Tip[];
  langCode: LanguageCode;
  setExplanation: (tipExample: TipExample) => void;
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
const TipsSection: React.FC<TipsSectionProps> = ({ tips, langCode, setExplanation }) => {
  if (!tips || tips.length === 0) {
    return null;
  }

  const theme = useTheme();
  const t = useTranslation();

  return (
    <Layout.Column>
      <Text.H4 bold>{`${tips.length} ${t("Tips")}`}</Text.H4>
      <Layout.Column
        mb={spacing.m}
        mt={spacing.m}
        style={[
          cs.border2,
          cs.borderRadius16,
          {
            borderColor: theme.colors.border,
          },
        ]}
      >
        {tips.map((tip, idx) => (
          <Layout.Column
            key={idx}
            padding={spacing.m}
            style={[
              idx !== tips.length - 1 && cs.borderBottom2,
              { borderColor: theme.colors.border },
            ]}
          >
            <Text.H3 style={styles.tipTopic}>{tip.topic}</Text.H3>
            <Text.Body style={styles.tipDescription}>
              {tip.description}
            </Text.Body>
            {tip.examples && tip.examples.length > 0 && (
              <Layout.Column mt={spacing.m}>
                <Text.Caption style={styles.examplesLabel}>
                  EXAMPLES
                </Text.Caption>
                <View style={styles.examplesRow}>
                  {tip.examples.map((ex, exIdx: number) => (
                    <View key={exIdx} style={styles.exampleCard}>
                      <SpeechButton text={ex.sentence}langCode={langCode}/>
                      <Pressable
                        onPress={() => setExplanation(ex)}
                        style={{ flex: 1 }}
                      >
                        <Text.Body style={styles.exampleGerman}>
                          {ex.sentence}
                        </Text.Body>
                        <Text.Body style={styles.exampleEnglish}>
                          {ex.translation}
                        </Text.Body>
                      </Pressable>
                    </View>
                  ))}
                </View>
              </Layout.Column>
            )}
          </Layout.Column>
        ))}
      </Layout.Column>
    </Layout.Column>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#222",
  },
  tipCard: {
    backgroundColor: "#eaf4fb",
    borderRadius: 32,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tipTopic: {
    color: "#1a237e",
    marginBottom: 12,
  },
  tipDescription: {
    marginBottom: 8,
  },
  examplesLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
    letterSpacing: 1,
  },
  examplesRow: {},
  exampleCard: {
    backgroundColor: "#dbeafe",
    borderRadius: 20,
    padding: 16,
    flex: 1,
    minWidth: 180, // Ensure cards don't get too small when wrapped
    marginBottom: 12,
    // marginRight: 12, // Removed as gap is used in examplesRow
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  exampleGerman: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
  },
  exampleEnglish: {
    fontSize: 15,
    color: "#444",
  },
});

TipsSection.displayName = "TipsSection";

export default React.memo(TipsSection);
