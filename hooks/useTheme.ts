import { useTheme as useThemeNative } from "@react-navigation/native";

const useTheme = () => {

    const theme = useThemeNative();

    return {
        ...theme,
        colors: {
            ...theme.colors,
            // @ts-ignore
            onPrimary: theme.colors.onPrimary,
        },
    };

}

export default useTheme;