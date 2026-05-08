// navigation/WorkoutStackNavigator.jsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkoutHome from '@/app/screens/workout/WorkoutHome';
import WorkoutActive from '@/app/screens/workout/WorkoutActive';
import WorkoutSummary from '@/app/screens/workout/WorkoutSummary';
import WorkoutHistory from '@/app/screens/workout/WorkoutHistory';
import WorkoutDetail from '@/app/screens/workout/WorkoutDetail';

const WorkoutStack = createNativeStackNavigator();

export function WorkoutStackNavigator() {
    return (
        <WorkoutStack.Navigator screenOptions={{ headerShown: false }}>
            <WorkoutStack.Screen name="WorkoutHome" component={WorkoutHome} />
            <WorkoutStack.Screen name="WorkoutActive" component={WorkoutActive} />
            <WorkoutStack.Screen name="WorkoutSummary" component={WorkoutSummary} />
            <WorkoutStack.Screen name="WorkoutHistory" component={WorkoutHistory} />
            <WorkoutStack.Screen name="WorkoutDetail" component={WorkoutDetail} />
        </WorkoutStack.Navigator>
    );
}