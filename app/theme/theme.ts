import { useColorScheme } from "nativewind";

export function useAppTheme() {
    const { colorScheme, setColorScheme } = useColorScheme();

    const toggleTheme = (theme: 'light' | 'dark') => {
        setColorScheme(theme);
    };

    return { colorScheme, toggleTheme };
}