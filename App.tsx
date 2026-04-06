import {DarkTheme, NavigationContainer} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {MainTabNavigator} from "@/app/routers/MainTabNavigator";

import { GluestackUIProvider } from 'app/gluestack-ui-provider';
import '@/global.css';
import {useAppTheme} from '@/app/theme/theme';

export default function App() {

    const {colorScheme} = useAppTheme();

    let LightTheme;
    return (
        <GluestackUIProvider mode={colorScheme}>
            <SafeAreaProvider>
                <NavigationContainer theme={colorScheme == 'dark' ? DarkTheme : LightTheme}>
                    <MainTabNavigator/>
                    <StatusBar style="auto" />
                </NavigationContainer>
            </SafeAreaProvider>
        </GluestackUIProvider>
    );
}