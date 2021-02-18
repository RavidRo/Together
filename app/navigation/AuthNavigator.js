import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import route from "./route";
import LoginScreen from "../screens/Auth/LoginScreen";
import WelcomScreen from "../screens/Auth/WelcomScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";

const Stack = createStackNavigator();

export default function AuthNavigator() {
	return (
		<Stack.Navigator
			initialRouteName={route.WELCOME_SCREEN}
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen
				name={route.WELCOME_SCREEN}
				component={WelcomScreen}
			/>
			<Stack.Screen
				name={route.REGISTER_SCREEN}
				component={RegisterScreen}
			/>
			<Stack.Screen name={route.LOGIN_SCREEN} component={LoginScreen} />
		</Stack.Navigator>
	);
}
