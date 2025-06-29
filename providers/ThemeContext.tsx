import { BUTTON_HEIGHT } from "@/components/buttons/Button";
import useTheme from "@/hooks/useTheme";
import { BORDER_RADIUS, BORDER_WIDTH, commonStyles as cs } from "@/styles/common";
import { spacing } from "@/styles/spacing";
import React, { createContext, PropsWithChildren } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ThemedStylesFields =
  | "sectionListBorder"
  | "borderBottomColor"
  | "fab"
  | "link"
  | "section"
  | "borderColor"
  | "transliteration"
  | "tipsCard";

type ThemedStyles = {
  [key in ThemedStylesFields]: ViewStyle;
};

const ThemeContext = createContext<ThemedStyles>({} as ThemedStyles);

export function ThemeProvider({ children }: PropsWithChildren) {
  const theme = useTheme();
  const insents = useSafeAreaInsets();

  const memoizedStyles = React.useMemo(
    () =>
      StyleSheet.create({
        sectionListBorder: {
          borderWidth: BORDER_WIDTH,
          borderTopWidth: 0,
          borderColor: theme.colors.border,
        },
        borderBottomColor: {
          borderBottomColor: theme.colors.border,
        },
        borderColor: {
          borderColor: theme.colors.border,
        },
        fab: {
          position: "absolute",
          bottom: insents.bottom + spacing.m,
          right: spacing.m,
          backgroundColor: theme.colors.primary,
          borderRadius: BUTTON_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          overflow: "hidden",
          zIndex: 1000,
        },
        link: {
          color: theme.colors.primary,
          textDecorationLine: "underline",
        },
        section: {
          ...cs.border2,
          ...cs.borderRadius16,
          borderColor: theme.colors.border,
        },
        transliteration: {
          ...cs.borderBottom1,
          borderColor: theme.colors.primary,
          marginRight: 2,
        },
        tipsCard: {
          backgroundColor: theme.colors.surface,
          borderRadius: BORDER_RADIUS,
          padding: spacing.m,
          paddingLeft: spacing.s,
          flexDirection: "row",
          alignItems: "center",
        },
      }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={memoizedStyles as ThemedStyles}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemedStyles = () => {
  const styles = React.useContext(ThemeContext);
  if (!styles) {
    throw new Error("useThemedStyles must be used within a ThemeProvider");
  }
  return styles;
};
