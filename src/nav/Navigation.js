import * as React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import SvgTest from "../screens/svgTest";
import Register from "../screens/Register";
import Login from "../screens/Login";
import ShoppingLists from "../screens/ShoppingLists"




const Stack = createStackNavigator();

export default function MainStackNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator name="ChatPlusNavigator">
                <Stack.Screen 
                    name="Login"
                    component={Login}
                    options={{headerShown:false}}
                />
                <Stack.Screen 
                    name="Register"
                    component={Register}
                    options={{headerShown:false}}
                />
                <Stack.Screen 
                    name="ShoppingLists"
                    component={ShoppingLists}
                    options={{headerShown:false}}
                />
                 
                <Stack.Screen 
                    name="TestMap"
                    component={SvgTest}
                    options={{headerShown:false}}
                />
                
                
            </Stack.Navigator>
        </NavigationContainer>
    )

}

