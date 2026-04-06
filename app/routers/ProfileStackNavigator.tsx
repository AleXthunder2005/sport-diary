import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {ProfileHome} from "@/app/screens/profile/ProfileHome";

const ProfileStack = createNativeStackNavigator();

export function ProfileStackNavigator() {
    return (
        <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
            <ProfileStack.Screen name="ProfileHome" component={ProfileHome} options={{ title: 'Профиль' }} />
            {/*<ProfileStack.Screen name="Analytics" component={Analytics} options={{ title: 'Аналитика' }} />*/}
        </ProfileStack.Navigator>
    );
}