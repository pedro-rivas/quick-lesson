import useTheme from "@/hooks/useTheme";
import React, { createContext, PropsWithChildren } from "react";
import { ViewStyle } from "react-native";

interface ThemedStyles {
  sectionListBorder: ViewStyle;
  borderBottomColor: ViewStyle;
}

const ThemeContext = createContext<ThemedStyles>({} as ThemedStyles);

export function ThemeProvider({ children }: PropsWithChildren) {
  const theme = useTheme();

  const memoizedStyles = React.useMemo(
    () => ({
      sectionListBorder: {
        borderWidth: 2,
        borderTopWidth: 0,
        borderColor: theme.colors.border,
      },
      borderBottomColor:{
        borderBottomColor: theme.colors.border,
      }
    }),
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
