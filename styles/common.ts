import { BUTTON_ICON_HEIGHT } from "@/constants/style";
import { StyleSheet } from "react-native";

const commonStyles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  border2: {
    borderWidth: 2,
  },
  borderBottom2: {
    borderBottomWidth: 2,
  },
  borderBottom1: {
    borderBottomWidth: 1,
  },
  opacity70: {
    opacity: 0.7,
  },
  borderRadius16: {
    borderRadius: 16,
  },
  speechButton: {
    height: BUTTON_ICON_HEIGHT,
    width: BUTTON_ICON_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: BUTTON_ICON_HEIGHT,
  },
});

export { commonStyles };
