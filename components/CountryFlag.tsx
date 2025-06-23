import { images } from "@/assets/images";
import { LANGUAGES, LanguageCode } from "@/constants/languages";
import { commonStyles as cs } from "@/styles/common";
import React from "react";
import { Image } from "react-native";

const CountryFlag = ({
  countryCode,
  size,
}: {
  countryCode: LanguageCode;
  size: "small" | "medium";
}) => {
  // @ts-ignore
  const flag = images.flags?.[LANGUAGES?.[countryCode]?.value];

  if (!flag) {
    return null;
  }

  return (
    <Image
      source={flag}
      style={size === "small" ? cs.flagSmall : cs.flagMedium}
    />
  );
};

export default React.memo(CountryFlag);
