import { BUTTON_HEIGHT } from "@/components/buttons/Button";
import useTheme from "@/hooks/useTheme";
import { BORDER_WIDTH } from "@/styles/common";
import { spacing } from "@/styles/spacing";
import React, { createContext, PropsWithChildren } from "react";
import { ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ThemedStylesFields =
  | "sectionListBorder"
  | "borderBottomColor"
  | "fab"
  | "link";

type ThemedStyles = {
  [key in ThemedStylesFields]: ViewStyle
};

const ThemeContext = createContext<ThemedStyles>({} as ThemedStyles);

export function ThemeProvider({ children }: PropsWithChildren) {
  const theme = useTheme();
  const insents = useSafeAreaInsets();

  const memoizedStyles = React.useMemo(
    () =>
      ({
        sectionListBorder: {
          borderWidth: BORDER_WIDTH,
          borderTopWidth: 0,
          borderColor: theme.colors.border,
        },
        borderBottomColor: {
          borderBottomColor: theme.colors.border,
        },
        fab: {
          position: "absolute",
          bottom: insents.bottom + spacing.m,
          right: spacing.m,
          backgroundColor: theme.colors.primary,
          borderRadius: BUTTON_HEIGHT,
          height: BUTTON_HEIGHT,
          minWidth: BUTTON_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        },
        link: {
          color: theme.colors.primary,
          textDecorationLine: "underline",
        },
      } as ThemedStyles),
    [theme]
  );

  return (
    <ThemeContext.Provider value={memoizedStyles}>
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
