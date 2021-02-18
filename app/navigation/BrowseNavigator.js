import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import route from "./route";
import OptionsScreen from "../screens/Browse/OptionsScreen";
import CategoryScreen from "../screens/Browse/CategoryScreen";
import PostDetailsScreen from "../screens/Browse/PostDetailsScreen";
import CategoryHeading from "./CategoryHeading";
import { categories } from "../Data/posts";

const Stack = createStackNavigator();

export default () => (
	<Stack.Navigator initialRouteName={route.OPTIONS_SCREEN}>
		<Stack.Screen
			name={route.OPTIONS_SCREEN}
			options={{ headerTitle: () => <CategoryHeading /> }}
			component={OptionsScreen}
		/>
		<Stack.Screen
			name={route.CATEGORY_SCREEN}
			component={CategoryScreen}
			options={({ route }) => ({
				headerTitle: () => (
					<CategoryHeading>
						{categories[route.params.category]}
					</CategoryHeading>
				),
			})}
		/>
		<Stack.Screen
			name={route.POST_DETAILS_SCREEN}
			options={{ headerTitle: () => <CategoryHeading /> }}
			component={PostDetailsScreen}
		/>
	</Stack.Navigator>
);
