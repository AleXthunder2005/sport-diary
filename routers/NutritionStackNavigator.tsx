import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {NutritionHome} from "../screens/nutrition/NutritionHome";

const NutritionStack = createNativeStackNavigator();

export function NutritionStackNavigator() {
    return (
        <NutritionStack.Navigator screenOptions={{ headerShown: false }}>
            <NutritionStack.Screen name="NutritionHome" component={NutritionHome} options={{ title: 'Питание' }} />
        </NutritionStack.Navigator>
    );
}