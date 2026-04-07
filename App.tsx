import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MainTabNavigator } from "@/app/routers/MainTabNavigator";

import { GluestackUIProvider } from 'app/gluestack-ui-provider';
import '@/global.css';
import "app/language/i18n";

import { useEffect, useState } from "react";
import { useColorScheme } from "nativewind";
import i18n from "app/language/i18n";
import { preferencesStorage } from "@/app/storages/preferencesStorage";
import { Appearance } from "react-native";
import {AppContextProvider} from "@/app/contexts/AppContext";

export default function App() {
    const { colorScheme, setColorScheme } = useColorScheme();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                // theme
                const savedTheme = await preferencesStorage.getTheme();
                if (!!savedTheme) {
                    setColorScheme(savedTheme as "light" | "dark");
                    console.log("saved theme: " + savedTheme);
                } else {
                    const systemTheme = Appearance.getColorScheme();
                    setColorScheme(systemTheme as "light" | "dark");
                    console.log("system theme: " + systemTheme);
                }

                // language
                const savedLang = await preferencesStorage.getLanguage();
                if (savedLang) {
                    await i18n.changeLanguage(savedLang);
                }
                console.log("saved lang: " + savedLang);
            } catch (e) {
                console.log("Init error", e);
            } finally {
                setIsReady(true);
            }
        };

        loadSettings();
    }, []);

    if (!isReady) return null;

    return (
            <GluestackUIProvider mode={colorScheme}>
                <SafeAreaProvider>
                    <NavigationContainer
                        theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
                    >
                        <MainTabNavigator />
                        <StatusBar style="auto" />
                    </NavigationContainer>
                </SafeAreaProvider>
            </GluestackUIProvider>
    );
}