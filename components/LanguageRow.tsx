import IconButton from "@/components/buttons/IconButton";
import Pressable from "@/components/buttons/Pressable";
import CountryFlag from "@/components/CountryFlag";
import * as Layout from "@/components/Layout";
import * as Text from "@/components/Text";
import { LanguageCode } from "@/constants/languages";
import useTheme from "@/hooks/useTheme";
import { commonStyles as cs } from "@/styles/common";
import React from "react";

export interface LanguageRowProps {
  id: string;
  label: string;
  value: string;
  code: LanguageCode;
  image: string;
  isSelected: boolean;
  onPress: (lang: LanguageCode) => void;
}

const LanguageRow = (lang: LanguageRowProps) => {
  const theme = useTheme();

  const onPress = React.useCallback(() => {
    lang.onPress(lang.code);
  }, [lang]);

  return (
    <Pressable onPress={onPress} style={[cs.centerRow, cs.p_m]}>
      <Layout.Row alignItems={"center"}>
        <CountryFlag size={"medium"} countryCode={lang.code} />
        <Text.Body bold>{lang.label}</Text.Body>
      </Layout.Row>
      {lang.isSelected ? (
        <IconButton
          name={"check-circle"}
          size={34}
          color={theme.colors.primary}
          onPress={onPress}
        />
      ) : (
        <IconButton
          name={"radio-button-unchecked"}
          size={34}
          color={theme.colors.border}
          onPress={onPress}
        />
      )}
    </Pressable>
  );
};

LanguageRow.displayName = "LanguageRow";

export default React.memo(
  LanguageRow,
  (prev, next) => prev.isSelected === next.isSelected
);
