import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const LessonEmptyState = () => {
  return (
    <View style={styles.lessonEmptyState}>
      <MaterialIcons name="school" size={64} color="#ccc" />
      <Text style={styles.lessonEmptyTitle}>No lessons yet</Text>
      <Text style={styles.lessonEmptySubtitle}>
        Generate your first lesson using the form above.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  lessonEmptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    minHeight: 200,
  },
  lessonEmptyTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  lessonEmptySubtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginBottom: 32,
  },
});

export default LessonEmptyState; 