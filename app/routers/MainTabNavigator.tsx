import {WorkoutStackNavigator} from "./WorkoutStackNavigator";
import {ExercisesStackNavigator} from "./ExercisesStackNavigator";
import {NutritionStackNavigator} from "./NutritionStackNavigator";
import {ProfileStackNavigator} from "./ProfileStackNavigator";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dumbbell, Clipboard, Apple, User } from 'lucide-react-native';
import {useTranslation} from "react-i18next";

const Tab = createBottomTabNavigator();


function TabBarIcon({ Icon, color, size }: { Icon: any; color: string; size: number }) {
    return <Icon color={color} size={size} />;
}

export function MainTabNavigator() {
    const {t} = useTranslation();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    switch (route.name) {
                        case "WorkoutTab":
                            return <Dumbbell color={color} size={size}/>;
                        case "ExercisesTab":
                            return <Clipboard color={color} size={size}/>;
                        // case "NutritionTab":
                        //     return <Apple color={color} size={size}/>;
                        case "ProfileTab":
                            return <User color={color} size={size}/>;
                    }
                }
            })}
        >
            <Tab.Screen
                name="WorkoutTab"
                component={WorkoutStackNavigator}
                options={{ title: t("routes.workout") }}
            />
            <Tab.Screen
                name="ExercisesTab"
                component={ExercisesStackNavigator}
                options={{ title: t("routes.exercises") }}
            />
            {/*<Tab.Screen*/}
            {/*    name="NutritionTab"*/}
            {/*    component={NutritionStackNavigator}*/}
            {/*    options={{ title: t("routes.nutrition") }}*/}
            {/*/>*/}
            <Tab.Screen
                name="ProfileTab"
                component={ProfileStackNavigator}
                options={{ title: t("routes.profile") }}
            />
        </Tab.Navigator>
    )
}