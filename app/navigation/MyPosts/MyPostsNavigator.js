import * as React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import route from "../route";
import MyPostsScreen from "../../screens/MyPostsScreen";
import MyPostsTabBar from "./MyPostsTabBar";
import { postsScreens } from "../../config/enumes";
import texts from "../../config/texts";

const Tab = createMaterialTopTabNavigator();

export default function MyPostsNavigator() {
	return (
		<Tab.Navigator
			initialRouteName={route.MY_POSTS_SCREEN}
			screenOptions={{}}
			tabBar={(props) => <MyPostsTabBar {...props} />}
		>
			<Tab.Screen
				name={route.MY_POSTS_SCREEN}
				component={MyPostsScreen}
				options={{ title: texts.MY_POSTS_NAVIGATOR.MY_POSTS }}
				initialParams={{ postsKind: postsScreens.MY_POSTS }}
			/>

			<Tab.Screen
				name={route.MY_POSTS_REGISTRATIONS_SCREEN}
				component={MyPostsScreen}
				options={{ title: texts.MY_POSTS_NAVIGATOR.MY_REGISTRATIONS }}
				initialParams={{ postsKind: postsScreens.MY_REGISTRATIONS }}
			/>

			<Tab.Screen
				name={route.MY_OLD_POSTS_SCREEN}
				component={MyPostsScreen}
				options={{ title: texts.MY_POSTS_NAVIGATOR.MY_ACOMPLISHMENTS }}
				initialParams={{ postsKind: postsScreens.MY_ACCOMPLISHMENTS }}
			/>
		</Tab.Navigator>
	);
}
