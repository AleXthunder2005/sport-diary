import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {WorkoutHome} from "@/app/screens/workout/WorkoutHome";

const WorkoutStack = createNativeStackNavigator();

export function WorkoutStackNavigator() {
    return (
        <WorkoutStack.Navigator screenOptions={{ headerShown: false }}>
            <WorkoutStack.Screen name="WorkoutHome" component={WorkoutHome}  />
            {/*<WorkoutStack.Screen name="WorkoutView" component={WorkoutView} options={{ title: 'Детали тренировки' }} />*/}
            {/*<WorkoutStack.Screen name="ActiveWorkout" component={ActiveWorkout} options={{ title: 'Активная тренировка' }} />*/}
            {/*<WorkoutStack.Screen name="WorkoutSummary" component={WorkoutSummary} options={{ title: 'Итоги тренировки' }} />*/}
            {/*<WorkoutStack.Screen name="WorkoutHistory" component={WorkoutHistory} options={{ title: 'История тренировок' }} />*/}
        </WorkoutStack.Navigator>
    );
}
