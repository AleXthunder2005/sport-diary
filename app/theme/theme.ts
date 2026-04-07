import { useColorScheme } from "nativewind";
import { preferencesStorage } from "app/storages/preferencesStorage";

export function useAppTheme() {
    const { colorScheme, setColorScheme } = useColorScheme();

    const toggleTheme = async (theme: 'light' | 'dark') => {
        setColorScheme(theme);
        await preferencesStorage.setTheme(theme);
    };

    return { colorScheme, toggleTheme };
}