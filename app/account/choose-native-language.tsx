import { images } from "@/assets/images";
import Button from "@/components/buttons/Button";
import LanguageRow, { LanguageRowProps } from "@/components/LanguageRow";
import * as Layout from "@/components/Layout";
import * as List from "@/components/List";
import SafeAreaView from "@/components/SafeAreaView";
import { APP_LANGUAGES, LanguageCode } from "@/constants/languages";
import useInsets from "@/hooks/useInsents";
import useTranslation from "@/hooks/useTranslation";
import { changeAppLanguage } from "@/i18n";
import { useUserStore } from "@/store/userStore";
import { spacing } from "@/styles/spacing";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { ListRenderItem } from "react-native";

export default function ChooseNativeLanguageScreen() {
  const { setLanguage } = useUserStore();
  const language = useUserStore((s) => s.user.preferences.language);
  const onboardingCompleted = useUserStore((s => s.user.onboardingCompleted));

  const router = useRouter();
  const t = useTranslation();
  const insets = useInsets();

  useFocusEffect(() => {
    if(onboardingCompleted){
      router.replace('/(home)');
    }
  });

  const langs = useMemo(() => Object.values(APP_LANGUAGES), []);

  const handleLanguageChange = useCallback((code: LanguageCode) => {
    setLanguage(code);
    changeAppLanguage(code);
  }, []);

  const handleNext = useCallback(() => {
    router.push("/account/choose-language");
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
        isSelected: l.code === language,
        onPress: l.code === language ? () => {} : handleLanguageChange,
      })),
    [language]
  );

  const renderItem = useCallback<ListRenderItem<LanguageRowProps>>(
    ({ item }) => <LanguageRow {...item} />,
    []
  );

  return (
    <SafeAreaView>
      <Layout.Header.Row>
        <Layout.Header.Spacer />
        <Layout.Header.Title title={t("Choose Your language")} />
        <Layout.Header.Spacer />
      </Layout.Header.Row>
      <Layout.Column ph={spacing.m} flex={1}>
        <List.Section
          ListHeaderComponent={
            <Layout.Header.SectionTitle title={t("Choose a Language")} />
          }
          data={availableLanguages}
          renderItem={renderItem}
        />
        <Layout.Footer.Gradient>
          <Button
            title={t("Continue")}
            onPress={handleNext}
            disabled={!language}
          />
        </Layout.Footer.Gradient>
      </Layout.Column>
    </SafeAreaView>
  );
}
