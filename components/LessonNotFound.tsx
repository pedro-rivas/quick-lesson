import useTranslation from "@/hooks/useTranslation";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import * as Layout from "./Layout";
import SafeAreaView from "./SafeAreaView";
import * as Text from "./Text";

const LessonNotFound = () => {
  const t = useTranslation();
  return (
    <SafeAreaView>
      <Layout.Column
        flex={1}
        justifyContent={"center"}
        alignItems={"center"}
        paddingHorizontal={32}
      >
        <MaterialIcons name="error-outline" size={64} color="#ff5252" />
        <Text.H4 style={styles.errorTitle}>{t("Lesson not found")}</Text.H4>
        <Text.Body style={styles.errorSubtitle}>
          {t("This lesson may have been deleted or doesn't exist.")}
        </Text.Body>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text.Body bold style={styles.backButtonText}>
            {t("Go Back")}
          </Text.Body>
        </Pressable>
      </Layout.Column>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  errorTitle: {
    color: "#ff5252",
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    color: "#999",
    textAlign: "center",
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: "#0b57d0",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

LessonNotFound.displayName = "LessonNotFound";

export default React.memo(LessonNotFound);
