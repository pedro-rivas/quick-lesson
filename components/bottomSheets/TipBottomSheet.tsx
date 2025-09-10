import * as Text from "@/components/Text";
import { TipExample } from "@/components/TipsSection";
import { LanguageCode } from "@/constants/languages";
import useTheme from "@/hooks/useTheme";
import useTranslation from "@/hooks/useTranslation";
import { commonStyles as cs } from "@/styles/common";
import { spacing } from "@/styles/spacing";
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useAudioPlayer } from "expo-audio";
import React, { useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Layout from "../Layout";
import SpeechButton from "../SpeechButton";

interface TipBottomSheetProps {
  tip: TipExample;
  onClose: () => void;
  langCode: LanguageCode;
}

const TipBottomSheet = ({ tip, langCode, onClose }: TipBottomSheetProps) => {
  const { onPrimary, primary } = useTheme().colors;
  const t = useTranslation();
  const insets = useSafeAreaInsets();

  const player = useAudioPlayer("");

  const handlePress = useCallback(
    (uri: string) => {
      if (uri) {
        player.replace(uri);
        player.seekTo(0);
        setTimeout(() => {
          player.play();
        }, 10);
      }
    },
    [player]
  );

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        handleIndicatorStyle: { backgroundColor: onPrimary },
        backgroundStyle: { backgroundColor: primary },
        container: {
          ...cs.p_m,
          paddingBottom: insets.bottom + spacing.m,
        },
        translation: {
          color: onPrimary,
          opacity: 0.7,
        },
        explanation: {
          color: onPrimary,
          marginTop: spacing.m,
          marginBottom: spacing.s,
          opacity: 0.7,
        },
      }),
    [primary, onPrimary, insets.bottom]
  );

  return (
    <BottomSheet
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      enableDynamicSizing={true}
      handleIndicatorStyle={styles.handleIndicatorStyle}
      backgroundStyle={styles.backgroundStyle}
    >
      <BottomSheetView style={styles.container}>
        <Layout.Row alignItems="center">
          <SpeechButton
            text={tip.sentence}
            langCode={langCode}
            onPress={handlePress}
            color={onPrimary}
          />
          <Layout.Column ml={spacing.s} flexShrink={1}>
            <Text.H3 color={onPrimary}>{tip.sentence}</Text.H3>
            <Text.Body style={styles.translation}>{tip.translation}</Text.Body>
          </Layout.Column>
        </Layout.Row>
        <Text.Caption style={styles.explanation}>
          {t("Explanation")}
        </Text.Caption>
        <Text.Body color={onPrimary}>{tip.explanation}</Text.Body>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default TipBottomSheet;
