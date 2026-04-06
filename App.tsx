import { NavigationContainer } from '@react-navigation/native';

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import './global.css';
import {MainTabNavigator} from "./routers/MainTabNavigator";



export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <MainTabNavigator/>
                <StatusBar style="auto" />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}