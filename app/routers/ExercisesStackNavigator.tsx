import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExercisesHome from '@/app/screens/excersise/ExercisesHome';
import ExerciseForm from "@/app/components/excersise/ExerciseForm";
import ExerciseDetail from "@/app/components/excersise/ExerciseDetail";

const ExercisesStack = createNativeStackNavigator();

export function ExercisesStackNavigator() {
    return (
        <ExercisesStack.Navigator screenOptions={{ headerShown: false }}>
            <ExercisesStack.Screen name="ExercisesHome" component={ExercisesHome} options={{ title: 'Упражнения' }} />
            <ExercisesStack.Screen name="ExerciseForm" component={ExerciseForm} options={{ title: 'Добавить упражнение' }} />
            <ExercisesStack.Screen name="ExerciseDetail" component={ExerciseDetail} options={{ title: 'Детали упражнения' }} />
        </ExercisesStack.Navigator>
    );
}