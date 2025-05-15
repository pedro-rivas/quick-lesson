import translations from "@/assets/locales/en-US.json";
import { useTranslation as translate } from "react-i18next";

type NestedKeys<T> = {
    // @ts-ignore
  [K in keyof T]: T[K] extends object ? `${K}.${NestedKeys<T[K]>}` : K;
}[keyof T];

type TranslationKeys = NestedKeys<typeof translations>;

export default function useTranslation() {
  const { t } = translate();

  return (key: TranslationKeys) => t(key)
}