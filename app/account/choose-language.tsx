import { images } from "@/assets/images";
import IconButton from "@/components/buttons/IconButton";
import * as Layout from "@/components/Layout";
import SafeAreaView from "@/components/SafeAreaView";
import * as Text from "@/components/Text";
import { LANGUAGES } from "@/constants/languages";
import useTheme from "@/hooks/useTheme";
import useTranslation from "@/hooks/useTranslation";
import { useUserStore } from "@/store/userStore";
import { commonStyles as cs } from "@/styles/common";
import { spacing } from "@/styles/spacing";
import { router } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { FlatList, Image } from "react-native";

export default function ChooseLanguageScreen() {
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
        label: l.label,
        value: l.value,
        code: l.code,
        // @ts-ignore
        image: images.flags[l.value],
        isSelected: l.code === learningLanguage,
        onPress: () => {
          setLearningLanguage(l.code);
        },
      })),
    [learningLanguage]
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
        <FlatList
          data={availableLanguages}
          contentContainerStyle={[
            cs.sectionList,
            {
              borderColor: theme.colors.border,
            },
          ]}
          renderItem={({ item }) => (
            <Layout.Row
              key={item.code}
              padding={spacing.m}
              alignItems={"center"}
              justifyContent="space-between"
            >
              <Layout.Row alignItems={"center"}>
                <Image
                  source={item.image}
                  style={{
                    width: 64,
                    height: 48,
                    borderRadius: 4,
                    marginRight: spacing.m,
                  }}
                />
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
            </Layout.Row>
          )}
          ItemSeparatorComponent={() => (
            <Layout.View
              style={{ height: 2, backgroundColor: theme.colors.border }}
            />
          )}
        />
      </Layout.Column>
    </SafeAreaView>
  );
}
