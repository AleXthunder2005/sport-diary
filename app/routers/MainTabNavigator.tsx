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
                if (route.name === "WorkoutTab") {
                    return <Dumbbell color={color} size={size} />;
                } else if (route.name === "ExercisesTab") {
                    return <Clipboard color={color} size={size} />;
                } else if (route.name === "NutritionTab") {
                    return <Apple color={color} size={size} />;
                } else if (route.name === "ProfileTab") {
                    return <User color={color} size={size} />;
                }
            }
        })}
    >
        <Tab.Screen
            name="WorkoutTab" // фиксированное имя
            component={WorkoutStackNavigator}
            options={{ tabBarLabel: t("routes.workout") }}
        />
        <Tab.Screen
            name="ExercisesTab"
            component={ExercisesStackNavigator}
            options={{ tabBarLabel: t("routes.exercises") }}
        />
        <Tab.Screen
            name="NutritionTab"
            component={NutritionStackNavigator}
            options={{ tabBarLabel: t("routes.nutrition") }}
        />
        <Tab.Screen
            name="ProfileTab"
            component={ProfileStackNavigator}
            options={{ tabBarLabel: t("routes.profile") }}
        />
    </Tab.Navigator>
)}