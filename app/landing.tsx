import Button from "@/components/buttons/Button";
import * as Layout from "@/components/Layout";
import SafeAreaView from "@/components/SafeAreaView";
import * as Text from "@/components/Text";
import useTranslation from "@/hooks/useTranslation";
import { useSession } from "@/providers/AuthContext";
import React, { useMemo } from "react";
import { Alert, StyleSheet } from "react-native";

// see https://www.uisources.com/explainer/duolingo-onboarding

export default function LandingPage() {
  const { signIn } = useSession();
  const t = useTranslation();

  const PLACE_HOLDER_LESSONS = useMemo(() => {
    return [
      t("Taking a Taxi"),
      t("Ordering a pizza"),
      t("Booking a hotel"),
      t("a trip to the beach"),
    ];
  }, []);

  const handleContinueWithGoogle = async () => {
    signIn("google").catch((error) => {
      Alert.alert(t("Something went wrong"), error.message);
    });
  };

  const handleContinueWithApple = () => {
    signIn("apple").catch((error) => {
      Alert.alert(t("Something went wrong"), error.message);
    });
  };

  return (
    <SafeAreaView styles={styles.container}>
      <Layout.View flex={1} justifyContent="space-between">
        <Layout.Spacer />
        <Layout.Column justifyContent="center" alignItems="center">
          <Text.LandingHeader>{t("Quick Lesson")}</Text.LandingHeader>
          <Layout.Spacer size="s" />
          <Text.AnimatedText
            style={styles.placeholder}
            text={PLACE_HOLDER_LESSONS}
          />
        </Layout.Column>
        <Layout.Column>
          <Button
            secondary
            title={t("Continue With Google")}
            onPress={handleContinueWithGoogle}
          />
          <Layout.Spacer />
          <Button
            secondary
            title={t("Continue With Apple")}
            onPress={handleContinueWithApple}
          />
        </Layout.Column>
      </Layout.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#23b1fc",
    paddingHorizontal: 20,
  },
  placeholder: {
    fontSize: 18,
    color: "white",
  },
});
