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
    onPrimary: "#fff",
    secondary: "#1a237e",
    onSecondary: "#fff",
    border: "#333",
    onSurface: "#fff",
    ripple: "rgba(11, 87, 208, 0.32)",
    surface: "#1e3a8a",
  },
};

export const LightTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    background: "#fff",
    primary: "#0b57d0",
    onPrimary: "#fff",
    secondary: "#1a237e",
    onSecondary: "#fff",
    border: "#ebebeb",
    onSurface: "#222",
    ripple: "rgba(0, 0, 0, 0.08)",
    surface: "#dbeafe",
  },
};
