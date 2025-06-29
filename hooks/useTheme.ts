import { commonStyles } from "@/styles/common";
import { useTheme as useThemeNative } from "@react-navigation/native";

const useTheme = () => {
  const theme = useThemeNative();

  return {
    ...theme,
    colors: {
      ...theme.colors,
      // @ts-ignore
      onPrimary: theme.colors.onPrimary,
      // @ts-ignore
      onSurface: theme.colors.onSurface,
      // @ts-ignore
      ripple: theme.colors.ripple,
    },
    cs: commonStyles,
  };
};

export default useTheme;
