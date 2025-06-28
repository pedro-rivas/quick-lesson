import useTheme from "@/hooks/useTheme";
import useTranslation from "@/hooks/useTranslation";
import { useThemedStyles } from "@/providers/ThemeContext";
import { commonStyles as cs } from "@/styles/common";
import React, { useImperativeHandle } from "react";
import Animated, {
    LinearTransition,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import * as Text from "../Text";
import IconButton from "./IconButton";
import Pressable from "./Pressable";

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
      opacity: withTiming(collapse.value === 0 ? 0 : 1, { duration: 600 }),
      display: collapse.value === 0 ? "none" : "flex",
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

  return (
    <Pressable
      // @ts-ignore
      layout={LinearTransition}
      style={themedStyles.fab}
      onPress={onPress}
    >
      <IconButton name="add-circle" color="white" />
      <Animated.View style={[animatedStyle, cs.m_r_m]}>
        <Text.Body semibold color={theme.colors.onPrimary}>
          {t("New Lesson")}
        </Text.Body>
      </Animated.View>
    </Pressable>
  );
});

FAB.displayName = "FAB";

export default React.memo(FAB);
