import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";

export const DarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: "#121212",
    primary: "#0b57d0",
    border: "#333",
  },
};

export const LightTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    background: "#fff",
    primary: "#0b57d0",
    border: "#ebebeb",
  },
};
