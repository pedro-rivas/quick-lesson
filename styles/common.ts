import { BUTTON_ICON_HEIGHT } from "@/constants/style";
import { Dimensions, StyleSheet } from "react-native";
import { scale } from "./scale";
import { spacing } from "./spacing";

export const BORDER_WIDTH = 2;
export const BORDER_RADIUS = 16;
export const HEADER_HEIGHT = scale.ms(50);
export const UNSTABLE_PRESS_DELAY = 100;

const commonStyles = StyleSheet.create({
  o_60: {
    opacity: 0.6,
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
  z_1000: {
    zIndex: 1000,
  },
  w_85_p: {
    width: "85%",
  },
  // Flex
  flex1: {
    flex: 1,
  },
  f_1: {
    flex: 1,
  },
  f_s_1: {
    flexShrink: 1,
  },
  // Padding
  p_h_m: {
    paddingHorizontal: spacing.m,
  },
  p_m: {
    padding: spacing.m,
  },
  p_v_m: {
    paddingVertical: spacing.m,
  },
  // Margin
  m_b_xs: {
    marginBottom: spacing.xs,
  },
  m_b_s: {
    marginBottom: spacing.s,
  },
  m_b_m: {
    marginBottom: spacing.m,
  },
  m_t_xs: {
    marginTop: spacing.xs,
  },
  m_r_xs: {
    marginRight: spacing.xs,
  },
  m_r_m: {
    marginRight: spacing.m,
  },
  m_h_m: {
    marginHorizontal: spacing.m,
  },
  m_l_s: {
    marginLeft: spacing.s,
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
  // Text
  bodyText: {
    fontSize: 16,
  },
  caption: {
    fontSize: 14,
    color: "#5A6672",
  },
  detail: {
    fontSize: 12,
    color: "#5A6672",
  },
  h4: {
    fontSize: 18,
    fontWeight: "bold",
  },
  h3: {
    fontSize: 20,
    fontWeight: "bold",
  },
  h2: {
    fontSize: 24,
    fontWeight: "bold",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lessonHeader: {
    paddingHorizontal: spacing.s,
    borderBottomWidth: 0,
  },
  wordButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderBottomWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  wordButtonGrow: {
    flexGrow: 1,
    width: Dimensions.get("window").width / 2 - spacing.l * 2,
  },
});

export { commonStyles, commonStyles as cs };
