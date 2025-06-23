import { BUTTON_ICON_HEIGHT } from "@/constants/style";
import { StyleSheet } from "react-native";
import { spacing } from "./spacing";

export const BORDER_WIDTH = 2;
export const BORDER_RADIUS = 16;

const commonStyles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  border2: {
    borderWidth: BORDER_WIDTH,
  },
  borderBottom2: {
    borderBottomWidth: BORDER_WIDTH,
  },
  borderBottom1: {
    borderBottomWidth: 1,
  },
  opacity70: {
    opacity: 0.7,
  },
  alignSelfEnd: {
    alignSelf: "flex-end",
  },
  borderBottomWidth2: {
    borderBottomWidth: BORDER_WIDTH,
  },
  borderRadius16: {
    borderRadius: BORDER_RADIUS,
  },
  centerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // Components
  flagMedium: {
    width: 64,
    height: 48,
    borderRadius: 4,
    marginRight: spacing.m,
  },
  flagSmall: {
    width: 28,
    height: 21,
    borderRadius: 4,
  },
  speechButton: {
    height: BUTTON_ICON_HEIGHT,
    width: BUTTON_ICON_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: BUTTON_ICON_HEIGHT,
  },
  sectionList: {
    borderWidth: BORDER_WIDTH,
    borderRadius: BORDER_RADIUS,
  },
});

export { commonStyles };
