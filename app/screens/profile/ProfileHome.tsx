import React from "react";
import { Button, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "@/app/theme/theme";

export const ProfileHome = () => {
    const { toggleTheme, colorScheme } = useAppTheme();
    const { t, i18n } = useTranslation();

    const onChangeLanguage = async () => {
        await i18n.changeLanguage(i18n.language === "ru" ? "en" : "ru")
    }
    return (
        <View className="flex-1 bg-background">
            <Text className="text-xl font-bold text-center text-primary p-10">
                {t("profile")} ({colorScheme})
            </Text>

            <Button
                title={t("changeTheme")}
                onPress={() =>
                    toggleTheme(colorScheme === "dark" ? "light" : "dark")
                }
            />

            <Button
                title={t("changeLanguage")}
                onPress={onChangeLanguage}
            />
        </View>
    );
};