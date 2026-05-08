import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '@/app/screens/auth/SignInScreen';
import SignUpScreen from '@/app/screens/auth/SignUpScreen';

const Stack = createNativeStackNavigator();

export function AuthStackNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
    );
}