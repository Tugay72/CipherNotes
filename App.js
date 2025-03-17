import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './pages/home';
import CreateNote from './pages/create_note';
import Settings from './pages/settings';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                <Stack.Screen name="CreateNote" component={CreateNote} options={{ headerShown: false }} />
                <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
