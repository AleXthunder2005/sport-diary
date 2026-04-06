import React, { useState } from "react";
import {Button, Text, View} from "react-native";
import {useAppTheme} from "@/app/theme/theme";

export const ProfileHome = () => {

    const {toggleTheme, colorScheme} = useAppTheme()
    const [language, setLanguage] = useState("ru");

    return (

        <View className="flex-1 bg-background">
            <Text className="text-xl font-bold text-center text-primary p-10">
                Профиль ({colorScheme})
            </Text>
            <Button
                title={"Сменить тему"}
                onPress={() => toggleTheme(colorScheme == "dark" ? "light" : "dark")}
            />
        </View>
    );
};