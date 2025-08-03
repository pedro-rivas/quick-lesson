import { BUTTON_ICON_SIZE } from "@/constants/style";
import useTheme from "@/hooks/useTheme";
import useTranslation from "@/hooks/useTranslation";
import { useThemedStyles } from "@/providers/ThemeContext";
import { commonStyles as cs } from "@/styles/common";
import React, { useImperativeHandle } from "react";
import Animated, {
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import * as Text from "../Text";
import { IconSymbol } from "../ui/IconSymbol";
import { BUTTON_HEIGHT } from "./Button";
import Pressable from "./Pressable";

export const FAB_THRESHOLD = 100;
const PADDING_HORIZONTAL = Math.round((BUTTON_HEIGHT - BUTTON_ICON_SIZE) / 2);

export interface FABRef {
  collapse: () => void;
  expand: () => void;
}

const FAB = React.forwardRef(({ onPress }: { onPress: () => void }, ref) => {
  const theme = useTheme();
  const themedStyles = useThemedStyles();
  const t = useTranslation();

  const collapse = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      display: collapse.value === 0 ? "none" : "flex",
      height: BUTTON_HEIGHT,
      paddingHorizontal: PADDING_HORIZONTAL,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    };
  }, []);

  const iconStyle = useAnimatedStyle(() => {
    return {
      display: collapse.value === 1 ? "none" : "flex",
      opacity: 1,
      height: BUTTON_HEIGHT,
      aspectRatio: 1,
      justifyContent: "center",
      alignItems: "center",
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      collapse: () => {
        collapse.value = 0;
      },
      expand: () => {
        collapse.value = 1;
      },
    }),
    []
  );

  const AddCircle = () => (
    <IconSymbol
      key={"add-circle"}
      name="add-circle"
      size={BUTTON_ICON_SIZE}
      color="white"
    />
  );

  return (
    <Pressable
      // @ts-ignore
      layout={LinearTransition.duration(300)}
      style={themedStyles.fab}
      onPress={onPress}
    >
      <Animated.View style={iconStyle}>
        <AddCircle />
      </Animated.View>
      <Animated.View style={animatedStyle}>
        <AddCircle />
        <Text.H4
          color={theme.colors.onPrimary}
          style={cs.m_l_s}
        >
          {t("New Lesson")}
        </Text.H4>
      </Animated.View>
    </Pressable>
  );
});

FAB.displayName = "FAB";

export default React.memo(FAB);
