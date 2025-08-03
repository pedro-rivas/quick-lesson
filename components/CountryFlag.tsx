import { images } from "@/assets/images";
import { LANGUAGES, LanguageCode } from "@/constants/languages";
import { commonStyles as cs } from "@/styles/common";
import React from "react";
import { Image, ImageStyle } from "react-native";

const CountryFlag = ({
  countryCode,
  size,
  style,
}: {
  countryCode: LanguageCode;
  size: "small" | "medium" | "tiny";
  style?: ImageStyle;
}) => {
  // @ts-ignore
  const flag = images.flags?.[LANGUAGES?.[countryCode]?.value];

  if (!flag) {
    return null;
  }

  return (
    <Image
      source={flag}
      style={[
        size === "small"
          ? cs.flagSmall
          : size === "tiny"
          ? cs.flagTiny
          : cs.flagMedium,
        style,
      ]}
    />
  );
};

export default React.memo(CountryFlag);
