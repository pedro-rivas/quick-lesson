import { images } from "@/assets/images";
import LanguageRow, { LanguageRowProps } from "@/components/LanguageRow";
import * as Layout from "@/components/Layout";
import * as List from "@/components/List";
import SafeAreaView from "@/components/SafeAreaView";
import * as Text from "@/components/Text";
import { LanguageCode, LANGUAGES } from "@/constants/languages";
import useTheme from "@/hooks/useTheme";
import useTranslation from "@/hooks/useTranslation";
import { useUserStore } from "@/store/userStore";
import { spacing } from "@/styles/spacing";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { ListRenderItem } from "react-native";

export default function ChooseLanguageScreen() {
  const { shouldGoBack } = useLocalSearchParams();

  const { setLearningLanguage } = useUserStore();
  const learningLanguage = useUserStore(
    (s) => s.userPreferences.learningLanguage
  );

  const t = useTranslation();
  const theme = useTheme();

  const goBack = useCallback(() => {
    router.back();
  }, []);

  const langs = useMemo(() => Object.values(LANGUAGES), []);

  const handleLanguageChange = useCallback((code: LanguageCode) => {
    setLearningLanguage(code);
    setTimeout(() => {
      if (shouldGoBack) {
        goBack();
      }
    }, 300);
  }, []);

  const availableLanguages = useMemo(
    () =>
      langs.map((l) => ({
        id: l.code,
        label: l.label,
        value: l.value,
        code: l.code,
        // @ts-ignore
        image: images.flags[l.value],
        isSelected: l.code === learningLanguage,
        onPress: handleLanguageChange,
      })),
    [learningLanguage]
  );

  const renderItem = useCallback<ListRenderItem<LanguageRowProps>>(
    ({ item }) => <LanguageRow {...item} />,
    [theme]
  );

  return (
    <SafeAreaView>
      <Layout.Header.Row>
        <Layout.Header.Icon name={"arrow-back"} onPress={goBack} />
        <Layout.Header.Title title={t("Choose a language")} />
        <Layout.Header.Spacer />
      </Layout.Header.Row>
      <Layout.Column padding={spacing.m}>
        <Text.Subheading>{t("What do you want to learn?")}</Text.Subheading>
        <Layout.Spacer size={"l"} />
        <List.Section data={availableLanguages} renderItem={renderItem} />
      </Layout.Column>
    </SafeAreaView>
  );
}
