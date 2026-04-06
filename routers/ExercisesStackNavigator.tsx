import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {ExercisesHome} from "../screens/excersise/ExercisesHome";

const ExercisesStack = createNativeStackNavigator();

export function ExercisesStackNavigator() {
    return (
        <ExercisesStack.Navigator screenOptions={{ headerShown: false }}>
            <ExercisesStack.Screen name="ExercisesHome" component={ExercisesHome} options={{ title: 'Упражнения' }} />
            {/*<ExercisesStack.Screen name="ExerciseForm" component={ExerciseForm} options={{ title: 'Добавить упражнение' }} />*/}
            {/*<ExercisesStack.Screen name="ExerciseDetail" component={ExerciseDetail} options={{ title: 'Детали упражнения' }} />*/}
        </ExercisesStack.Navigator>
    );
}