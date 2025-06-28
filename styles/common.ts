import { BUTTON_ICON_HEIGHT } from "@/constants/style";
import { StyleSheet } from "react-native";
import { spacing } from "./spacing";

export const BORDER_WIDTH = 2;
export const BORDER_RADIUS = 16;
export const HEADER_HEIGHT = 50;

const commonStyles = StyleSheet.create({
  flex1: {
    flex: 1,
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
  w_85_p: {
    width: "85%",
  },
  // Padding
  p_v_m: {
    paddingVertical: spacing.m,
  },
  // Margin
  m_t_xs: {
    marginTop: spacing.xs,
  },
  m_r_xs: {
    marginRight: spacing.xs,
  },
  m_r_m: {
    marginRight: spacing.m,
  },
  // Border
  border2: {
    borderWidth: BORDER_WIDTH,
  },
  borderBottom2: {
    borderBottomWidth: BORDER_WIDTH,
  },
  borderBottom1: {
    borderBottomWidth: 1,
  },
  borderTopRadius16: {
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
    borderTopWidth: BORDER_WIDTH,
  },
  borderBottomRadius16: {
    borderBottomLeftRadius: BORDER_RADIUS,
    borderBottomRightRadius: BORDER_RADIUS,
    borderBottomWidth: BORDER_WIDTH,
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
  flagTiny: {
    width: 16,
    height: 12,
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
  layoutHeader: {
    height: HEADER_HEIGHT,
    paddingHorizontal: spacing.m,
    width: "100%",
  },
});

export { commonStyles };
