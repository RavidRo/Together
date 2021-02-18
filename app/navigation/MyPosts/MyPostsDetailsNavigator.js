import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import route from "../route";
import PostDetailsScreen from "../../screens/Browse/PostDetailsScreen";
import MyPostsNavigator from "./MyPostsNavigator";
import CategoryHeading from "../CategoryHeading";

const Stack = createStackNavigator();

export default () => (
	<Stack.Navigator initialRouteName={route.MY_POSTS}>
		<Stack.Screen
			name={route.MY_POSTS}
			options={{ headerShown: false }}
			component={MyPostsNavigator}
		/>
		<Stack.Screen
			name={route.POST_DETAILS_SCREEN}
			options={{ headerTitle: () => <CategoryHeading /> }}
			component={PostDetailsScreen}
		/>
	</Stack.Navigator>
);
