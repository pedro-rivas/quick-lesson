import React, { useMemo } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface QuickSafeAreaViewProps {
  children: React.ReactNode;
  styles?: ViewStyle;
}

/**
 * A layout component that wraps its children within a React Native `View`.
 *
 * @param children - The content to be rendered inside the screen layout.
 */
const QuickSafeAreaView = ({ children, styles: customStyles }: QuickSafeAreaViewProps) => {
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({ 
        container: {
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      }),
    [insets]
  );

  return <View style={[styles.container, customStyles]}>{children}</View>;
};

QuickSafeAreaView.displayName = "QuickSafeAreaView";

export default React.memo(QuickSafeAreaView);
