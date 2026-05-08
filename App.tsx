import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MainTabNavigator } from "@/app/routers/MainTabNavigator";
import { AuthStackNavigator } from "@/app/routers/AuthStackNavigator";

import { GluestackUIProvider } from '@/app/gluestack-ui-provider';
import '@/global.css';
import "@/app/language/i18n";

import { useEffect, useState } from "react";
import { useColorScheme } from "nativewind";
import i18n from "@/app/language/i18n";
import { preferencesStorage } from "@/app/storages/preferencesStorage";
import { Appearance, View, ActivityIndicator } from "react-native";
import { AppContextProvider } from "@/app/contexts/AppContext";
import { getCurrentUserId, onAuthStateChange } from "@/app/supabase/supabaseClient";
import { authService } from "@/app/services/auth/authService";

export default function App() {
    const { colorScheme, setColorScheme } = useColorScheme();
    const [isReady, setIsReady] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

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

                // Пробуем восстановить сессию
                console.log("[App] Checking for existing session...");
                const hasSession = await authService.checkAndRestoreSession();
                console.log("[App] Session check result:", hasSession);

                if (hasSession) {
                    const userId = await getCurrentUserId();
                    console.log("[App] Session restored, userId:", userId);
                    setIsAuthenticated(true);
                } else {
                    console.log("[App] No session found");
                    setIsAuthenticated(false);
                }
            } catch (e) {
                console.log("Init error", e);
                setIsAuthenticated(false);
            } finally {
                setIsReady(true);
            }
        };

        loadSettings();

        // Подписываемся на изменения авторизации
        const { data: { subscription } } = onAuthStateChange((userId) => {
            console.log("[App] Auth state changed, userId:", userId);
            setIsAuthenticated(!!userId);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Ждём загрузки настроек и проверки авторизации
    if (!isReady || isAuthenticated === null) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#4A90D9" />
            </View>
        );
    }

    return (
        <GluestackUIProvider mode={colorScheme}>
            <SafeAreaProvider>
                <AppContextProvider>
                    <NavigationContainer
                        theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
                    >
                        {isAuthenticated ? (
                            <MainTabNavigator />
                        ) : (
                            <AuthStackNavigator />
                        )}
                        <StatusBar style="auto" />
                    </NavigationContainer>
                </AppContextProvider>
            </SafeAreaProvider>
        </GluestackUIProvider>
    );
}