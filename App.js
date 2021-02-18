import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import navigationTheme from "./app/navigation/navigationTheme";
import AuthNavigator from "./app/navigation/AuthNavigator";
import route from "./app/navigation/route";
import AppNavigator from "./app/navigation/AppNavigator";
import { navigationRef } from "./app/navigation/rootNavigation";

const Stack = createStackNavigator();
const MainNavigator = () => (
	<Stack.Navigator
		initialRouteName={route.AUTH}
		screenOptions={{ headerShown: false }}
	>
		<Stack.Screen name={route.APP} component={AppNavigator} />
		<Stack.Screen name={route.AUTH} component={AuthNavigator} />
	</Stack.Navigator>
);

export default function App() {
	return (
		<NavigationContainer ref={navigationRef} theme={navigationTheme}>
			<MainNavigator />
		</NavigationContainer>
	);
}
