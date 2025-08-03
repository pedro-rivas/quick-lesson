import useTheme from "@/hooks/useTheme";
import React, { PropsWithChildren, useMemo } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SafeAreaViewProps = {
  styles?: ViewStyle;
  backgroundColor?: string;
} & PropsWithChildren

/**
 * A layout component that wraps its children within a React Native `View`.
 *
 * @param children - The content to be rendered inside the screen layout.
 */
const SafeAreaView = ({ children, styles: customStyles, backgroundColor }: SafeAreaViewProps) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({ 
        container: {
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor: backgroundColor || colors.background,
        },
      }),
    [insets, colors]
  );

  return <View style={[styles.container, customStyles]}>{children}</View>;
};

SafeAreaView.displayName = "SafeAreaView";

export default React.memo(SafeAreaView);
