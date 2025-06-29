import { commonStyles } from "@/styles/common";
import { useTheme as useThemeNative } from "@react-navigation/native";

const useTheme = () => {
  const theme = useThemeNative();

  return {
    ...theme,
    colors: {
      ...theme.colors,
      primary: theme.colors.primary,
      // @ts-ignore
      onPrimary: theme.colors.onPrimary,
      // @ts-ignore
      ripple: theme.colors.ripple,
      // @ts-ignore
      secondary: theme.colors.secondary,
      // @ts-ignore
      onSecondary: theme.colors.onSecondary,
      // @ts-ignore
      surface: theme.colors.surface,
      // @ts-ignore
      onSurface: theme.colors.onSurface,
    },
    cs: commonStyles,
  };
};

export default useTheme;
