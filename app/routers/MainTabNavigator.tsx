import {WorkoutStackNavigator} from "./WorkoutStackNavigator";
import {ExercisesStackNavigator} from "./ExercisesStackNavigator";
import {NutritionStackNavigator} from "./NutritionStackNavigator";
import {ProfileStackNavigator} from "./ProfileStackNavigator";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dumbbell, Clipboard, Apple, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

function TabBarIcon({ Icon, color, size }: { Icon: any; color: string; size: number }) {
    return <Icon color={color} size={size} />;
}

export function MainTabNavigator() {
return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
                if (route.name === 'Тренировка') {
                    return <Dumbbell color={color} size={size} />;
                } else if (route.name === 'Упражнения') {
                    return <Clipboard color={color} size={size} />;
                } else if (route.name === 'Питание') {
                    return <Apple color={color} size={size} />;
                } else if (route.name === 'Профиль') {
                    return <User color={color} size={size} />;
                }
            }
        })}
    >
        <Tab.Screen name="Тренировка" component={WorkoutStackNavigator} />
        <Tab.Screen name="Упражнения" component={ExercisesStackNavigator} />
        <Tab.Screen name="Питание" component={NutritionStackNavigator} />
        <Tab.Screen name="Профиль" component={ProfileStackNavigator} />
    </Tab.Navigator>
)}