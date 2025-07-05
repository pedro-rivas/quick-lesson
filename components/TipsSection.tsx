import { LanguageCode } from "@/constants/languages";
import useTheme from "@/hooks/useTheme";
import useTranslation from "@/hooks/useTranslation";
import { useThemedStyles } from "@/providers/ThemeContext";
import { commonStyles as cs } from "@/styles/common";
import { spacing } from "@/styles/spacing";
import { useAudioPlayer } from "expo-audio";
import React from "react";
import * as Layout from "./Layout";
import * as List from "./List";
import SpeechButton from "./SpeechButton";
import * as Text from "./Text";
import Pressable from "./buttons/Pressable";

export interface TipExample {
  sentence: string;
  translation: string;
  explanation: string;
  transliteration?: string;
}

export interface Tip {
  topic: string;
  description: string;
  examples?: TipExample[];
  langCode: LanguageCode;
}

interface TipsSectionProps {
  tips: Tip[];
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
const TipsSection: React.FC<TipsSectionProps> = ({ tips, setExplanation }) => {
  if (!tips || tips.length === 0) {
    return null;
  }

  const theme = useTheme();
  const themedStyles = useThemedStyles();
  const t = useTranslation();

  const player = useAudioPlayer("");

  const handleSpeechPress = (uri: string) => {
    if (uri) {
      player.replace(uri);
      player.seekTo(0);
      setTimeout(() => {
        player.play();
      }, 10);
    }
  };

  return (
    <List.ScrollView style={cs.p_h_m} showsVerticalScrollIndicator={false}>
      <Layout.Header.SectionTitle title={`${tips.length} ${t("Tips")}`} />
      <Layout.Column mb={spacing.m} style={themedStyles.section}>
        {tips.map((tip, idx) => (
          <Layout.Column
            key={idx}
            padding={spacing.m}
            style={[
              idx !== tips.length - 1 && cs.borderBottom2,
              themedStyles.borderColor,
            ]}
          >
            <Text.H3 color={theme.colors.secondary} style={cs.m_b_m}>
              {tip.topic}
            </Text.H3>
            <Text.Body>{tip.description}</Text.Body>
            {tip?.examples?.length && (
              <Layout.Column mt={spacing.m}>
                <Text.Caption semibold style={cs.m_b_m}>
                  {t("EXAMPLES")}
                </Text.Caption>
                <Layout.Column>
                  {tip.examples.map((ex, exIdx: number) => (
                    <Pressable
                      onPress={() => setExplanation(ex)}
                      key={exIdx}
                      style={[
                        themedStyles.tipsCard,
                        exIdx !== (tip?.examples?.length || 0) - 1 && cs.m_b_m,
                      ]}
                    >
                      <SpeechButton
                        text={ex.sentence}
                        langCode={tip.langCode}
                        onPress={handleSpeechPress}
                      />
                      <Layout.Column style={[cs.f_1, cs.f_s_1]}>
                        <Text.H4 style={cs.m_b_xs}>{ex.sentence}</Text.H4>
                        <Text.Caption>{ex.translation}</Text.Caption>
                      </Layout.Column>
                    </Pressable>
                  ))}
                </Layout.Column>
              </Layout.Column>
            )}
          </Layout.Column>
        ))}
      </Layout.Column>
    </List.ScrollView>
  );
};

TipsSection.displayName = "TipsSection";

export default React.memo(TipsSection);
