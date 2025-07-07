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
    lesson: {
      error: {
        border: "#FF4B4B",
        background: "#FFD6D6",
        // @ts-ignore
        text: theme.colors.onSurface,
      },
      selected: {
        border: "#1CB0F6",
        background: "#D6EFFF",
        // @ts-ignore
        text: theme.colors.onSurface,
      },
      match: {
        border: "#89e219",
        background: "#D6FFD6",
        // @ts-ignore
        text: theme.colors.onSurface,
      },
      hint: {
        // @ts-ignore
        border: "#1CB0F6",
        background: theme.colors.background,
        // @ts-ignore
        text: theme.colors.onSurface,
      },
      default: {
        border: "#ebebeb",
        background: theme.colors.background,
        // @ts-ignore
        text: theme.colors.onSurface,
      },
    },
  };
};

export default useTheme;
