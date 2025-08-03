import { LanguageCode } from "@/constants/languages";
import { useThemedStyles } from "@/providers/ThemeContext";
import { commonStyles as cs } from "@/styles/common";
import { spacing } from "@/styles/spacing";
import React from "react";
import { TextStyle } from "react-native";
import CountryFlag from "./CountryFlag";
import * as Layout from "./Layout";
import SpeechButton from "./SpeechButton";
import * as Text from "./Text";

export interface Vocab {
  term: string;
  transliteration?: string;
  translation: string;
  langCode: LanguageCode;
}

interface VocabularyRowProps {
  vocab: Vocab;
  idx: number;
  vocabs: number;
  showBorder?: boolean;
  showFlag?: boolean;
  onPress: (uri: string) => void;
}

const VocabularyRow = ({
  vocab,
  idx,
  vocabs,
  showBorder = true,
  showFlag = false,
  onPress,
}: VocabularyRowProps) => {
  const themedStyles = useThemedStyles();

  return (
    <Layout.Row
      key={idx}
      alignItems={"center"}
      padding={spacing.s}
      style={[
        showBorder && idx !== vocabs - 1 && cs.borderBottom2,
        themedStyles.borderColor,
      ]}
    >
      <SpeechButton
        text={vocab.term}
        langCode={vocab.langCode}
        onPress={onPress}
      />
      <Layout.Column ml={spacing.s} flexShrink={1}>
        <Layout.Row alignItems="center">
          {showFlag ? (
            <CountryFlag
              countryCode={vocab.langCode}
              size={"tiny"}
              style={cs.m_r_xs}
            />
          ) : null}
          <Text.Body bold>{vocab.term}</Text.Body>
        </Layout.Row>
        {vocab?.transliteration ? (
          <Layout.Row>
            {vocab.transliteration.split("").map((l) => (
              <Text.Caption style={themedStyles.transliteration as TextStyle}>
                {l}
              </Text.Caption>
            ))}
          </Layout.Row>
        ) : null}
        <Text.Caption style={cs.m_t_xs}>{vocab.translation}</Text.Caption>
      </Layout.Column>
    </Layout.Row>
  );
};

VocabularyRow.displayName = "VocabularyRow";

export default React.memo(VocabularyRow);
