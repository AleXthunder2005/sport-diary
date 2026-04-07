import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTranslation } from "react-i18next";
import { User, Moon, Sun, Globe, Ruler, Weight, Sparkles } from "lucide-react-native";
import { Switch } from "react-native";
import { useAppTheme } from "@/app/theme/theme";
import { preferencesStorage } from "@/app/storages/preferencesStorage";
import { getColor } from "@/app/colors/colors";

export const ProfileHome = () => {
    const { toggleTheme, colorScheme } = useAppTheme();
    const { t, i18n } = useTranslation();

    const [language, setLanguage] = useState(i18n.language);
    const [isDark, setIsDark] = useState(colorScheme === "dark");

    const currentTheme = isDark ? 'dark' : 'light';

    const onChangeLanguage = async (lang: string) => {
        setLanguage(lang);
        await i18n.changeLanguage(lang);
        await preferencesStorage.setLanguage(lang);
    };

    const onToggleTheme = () => {
        const newTheme = isDark ? "light" : "dark";
        toggleTheme(newTheme);
        setIsDark(!isDark);
    };

    // Получаем цвета для текущей темы
    const colors = {
        primary: getColor(currentTheme, 'primary'),
        primaryForeground: getColor(currentTheme, 'primary-foreground'),
        mutedForeground: getColor(currentTheme, 'muted-foreground'),
        foreground: getColor(currentTheme, 'foreground'),
        background: getColor(currentTheme, 'background'),
        card: getColor(currentTheme, 'card'),
        border: getColor(currentTheme, 'border'),
        muted: getColor(currentTheme, 'muted'),
        switchBackground: getColor(currentTheme, 'switch-background'),
    };

    return (
        <ScrollView className="flex-1 bg-background">
            {/* Decorative Header Pattern */}
            <View className="absolute top-0 left-0 right-0 h-64 overflow-hidden">
                <View className="absolute top-0 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                <View className="absolute top-20 -right-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
                <View className="absolute bottom-0 left-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl -translate-x-1/2" />
            </View>

            {/* Main Content */}
            <View className="px-4 pt-12 pb-8">
                {/* Welcome Card */}
                <View className="bg-card rounded-2xl shadow-soft-2 mb-6 overflow-hidden border border-border/50">
                    <View className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />

                    <View className="p-6 items-center relative z-10">
                        {/* Animated Avatar Container */}
                        <View className="relative mb-4">
                            <View className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-110" />
                            {/* Улучшенный аватар с контрастным фоном */}
                            <View className="w-28 h-28 rounded-full justify-center items-center shadow-lg" style={{ backgroundColor: isDark ? colors.primaryForeground : colors.primary }}>
                                <User size={52} color={isDark ? colors.primary : colors.primaryForeground} />
                            </View>
                            <View className="absolute -bottom-1 -right-1 rounded-full p-2 border-2 border-card shadow-sm" style={{ backgroundColor: colors.primary, borderColor: colors.card }}>
                                <Sparkles size={8} color={colors.primaryForeground} />
                            </View>
                        </View>

                        <Text className="text-2xl font-bold text-foreground mb-1">
                            {t("profile.welcome_back")}
                        </Text>
                        <Text className="text-muted-foreground text-base">
                            {t("profile.manage_your_profile")}
                        </Text>
                    </View>
                </View>

                {/* Stats Cards Row */}
                <View className="flex-row gap-4 mb-6">
                    {/* Height Card */}
                    <View className="flex-1 bg-card rounded-xl p-4 border border-border/50 shadow-soft-1">
                        <View className="flex-row items-center gap-2 mb-2">
                            <View className="bg-primary/10 p-2 rounded-lg">
                                <Ruler size={20} color={colors.primary} />
                            </View>
                            <Text className="text-muted-foreground text-sm uppercase tracking-wide">
                                {t("profile.height")}
                            </Text>
                        </View>
                        <Text className="text-foreground text-2xl font-bold">
                            180 <Text className="text-base font-normal text-muted-foreground">cm</Text>
                        </Text>
                    </View>

                    {/* Weight Card */}
                    <View className="flex-1 bg-card rounded-xl p-4 border border-border/50 shadow-soft-1">
                        <View className="flex-row items-center gap-2 mb-2">
                            <View className="bg-primary/10 p-2 rounded-lg">
                                <Weight size={20} color={colors.primary} />
                            </View>
                            <Text className="text-muted-foreground text-sm uppercase tracking-wide">
                                {t("profile.weight")}
                            </Text>
                        </View>
                        <Text className="text-foreground text-2xl font-bold">
                            75 <Text className="text-base font-normal text-muted-foreground">kg</Text>
                        </Text>
                    </View>
                </View>

                {/* Settings Card */}
                <View className="bg-card rounded-2xl shadow-soft-2 overflow-hidden border border-border/50">
                    <View className="p-6">
                        <Text className="text-lg font-semibold text-foreground mb-4">
                            {t("profile.preferences")}
                        </Text>

                        {/* Language Picker */}
                        <View className="mb-6">
                            <View className="flex-row items-center gap-2 mb-3">
                                <Globe size={18} color={colors.mutedForeground} />
                                <Text className="text-muted-foreground text-sm font-medium">
                                    {t("profile.changeLanguage")}
                                </Text>
                            </View>
                            <View className="bg-input-background rounded-xl border border-border overflow-hidden">
                                <Picker
                                    selectedValue={language}
                                    onValueChange={(itemValue) => onChangeLanguage(itemValue)}
                                    dropdownIconColor={colors.foreground}
                                    className="text-foreground"
                                    style={{ color: colors.foreground }}
                                >
                                    <Picker.Item label="Русский" value="ru" />
                                    <Picker.Item label="English" value="en" />
                                </Picker>
                            </View>
                        </View>

                        {/* Theme Toggle - Улучшенный Switch */}
                        <View className="pt-2">
                            <View className="flex-row items-center justify-between p-4 bg-input-background rounded-xl border border-border">
                                <View className="flex-row items-center gap-3">
                                    {isDark ? (
                                        <Moon size={20} color={colors.primary} />
                                    ) : (
                                        <Sun size={20} color={colors.primary} />
                                    )}
                                    <View>
                                        <Text className="text-foreground font-medium text-base">
                                            {t("profile.changeTheme")}
                                        </Text>
                                        <Text className="text-muted-foreground text-xs">
                                            {isDark ? t("profile.dark_mode") : t("profile.light_mode")}
                                        </Text>
                                    </View>
                                </View>
                                <Switch
                                    value={isDark}
                                    onValueChange={onToggleTheme}
                                    trackColor={{
                                        false: colors.switchBackground,
                                        true: colors.primary
                                    }}
                                    thumbColor={isDark ? colors.primaryForeground : colors.primaryForeground}
                                    ios_backgroundColor={colors.switchBackground}
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Decorative Bottom Element */}
                <View className="mt-8 items-center">
                    <View className="h-px w-16 bg-border" />
                    <Text className="text-muted-foreground text-xs mt-3">
                        {t("profile.app_version")} 1.0.0
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};