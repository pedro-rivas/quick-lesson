import { images } from "@/assets/images";
import IconButton from "@/components/buttons/IconButton";
import Pressable from "@/components/buttons/Pressable";
import * as Layout from "@/components/Layout";
import * as List from "@/components/List";
import SafeAreaView from "@/components/SafeAreaView";
import * as Text from "@/components/Text";
import { LANGUAGES } from "@/constants/languages";
import useTheme from "@/hooks/useTheme";
import useTranslation from "@/hooks/useTranslation";
import { useUserStore } from "@/store/userStore";
import { commonStyles as cs } from "@/styles/common";
import { spacing } from "@/styles/spacing";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { Image, ListRenderItem } from "react-native";

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

  const availableLanguages = useMemo(
    () =>
      Object.values(LANGUAGES).map((l) => ({
        id: l.code,
        label: l.label,
        value: l.value,
        code: l.code,
        // @ts-ignore
        image: images.flags[l.value],
        isSelected: l.code === learningLanguage,
        onPress: () => {
          setLearningLanguage(l.code);
          setTimeout(() => {
            if (shouldGoBack) {
              goBack();
            }
          }, 300);
        },
      })),
    [learningLanguage]
  );

  const renderItem = useCallback<
    ListRenderItem<(typeof availableLanguages)[number]>
  >(
    ({ item }) => {
      return (
        <Pressable
          onPress={item.onPress}
          style={[cs.centerRow, { padding: spacing.m }]}
        >
          <Layout.Row alignItems={"center"}>
            <Image source={item.image} style={cs.flagMedium} />
            <Text.Body bold>{item.label}</Text.Body>
          </Layout.Row>
          {item.isSelected ? (
            <IconButton
              name={"check-circle"}
              size={34}
              color={theme.colors.primary}
              onPress={item.onPress}
            />
          ) : (
            <IconButton
              name={"radio-button-unchecked"}
              size={34}
              color={theme.colors.border}
              onPress={item.onPress}
            />
          )}
        </Pressable>
      );
    },
    [theme]
  );

  return (
    <SafeAreaView>
      <Layout.Header>
        <IconButton name={"arrow-back"} onPress={goBack} />
        <Text.Header numberOfLines={1}>{t("Choose a language")}</Text.Header>
        <Layout.Spacer size={"xxl"} />
      </Layout.Header>
      <Layout.Column padding={spacing.m}>
        <Text.Subheading>{t("What do you want to learn?")}</Text.Subheading>
        <Layout.Spacer size={"l"} />
        <List.Section data={availableLanguages} renderItem={renderItem} />
      </Layout.Column>
    </SafeAreaView>
  );
}
