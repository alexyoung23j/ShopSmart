import * as React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import SvgTest from "../screens/svgTest";
import Register from "../screens/Register";
import Login from "../screens/Login";
import ShoppingLists from "../screens/ShoppingLists"
import SelectStore from "../screens/SelectStore"
import MapScreen from "../screens/MapScreen"





const Stack = createStackNavigator()
Stack.navigationOptions = ({navigation}) => ({
    swipeEnabled: false
  });

export default function MainStackNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator name="ChatPlusNavigator">
                <Stack.Screen 
                    name="Login"
                    component={Login}
                    options={{headerShown:false, gestureEnabled: false}}
                />
                <Stack.Screen 
                    name="Register"
                    component={Register}
                    options={{headerShown:false, gestureEnabled: false}}
                />
                <Stack.Screen 
                    name="ShoppingLists"
                    component={ShoppingLists}
                    options={{headerShown:false, gestureEnabled: false}}
                />
                 
                <Stack.Screen 
                    name="SelectStore"
                    component={SelectStore}
                    options={{headerShown:false, gestureEnabled: false}}
                />

                <Stack.Screen 
                    name="MapScreen"
                    component={MapScreen}
                    options={{headerShown:false, gestureEnabled: false}}
                />


                
                
            </Stack.Navigator>
        </NavigationContainer>
    )

}

