import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import route from "./route";
import ProfileScreen from "../screens/Profile/ProfileScreen";

const Stack = createStackNavigator();

export default function ProfileNavigator() {
	return (
		<Stack.Navigator
			initialRouteName={route.PROFILE_SCREEN}
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen
				name={route.PROFILE_SCREEN}
				component={ProfileScreen}
			/>
		</Stack.Navigator>
	);
}
