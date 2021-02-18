import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import {
	MaterialCommunityIcons,
	FontAwesome,
	FontAwesome5,
} from "@expo/vector-icons";

import BrowseNavigator from "./BrowseNavigator";
import ProfileNavigator from "./ProfileNavigator";
import NewPostScreen from "../screens/Browse/NewPostScreen";
import NewPostButton from "./NewPostButton";
import useNotifications from "../hooks/useNotifications";
import navigation from "./rootNavigation";
import ChatNavigator from "./ChatNavigator";
import MyPostsDetailsNavigator from "./MyPosts/MyPostsDetailsNavigator";
import routes from "./route";

const Tab = createBottomTabNavigator();

export default function AppNavigator({ route }) {
	const focusedChatNavigatorRouteName =
		route &&
		route.state &&
		getFocusedRouteNameFromRoute(route.state?.routes[3]);

	useNotifications((notification) => {
		console.log("Recieved notification", notification);
		navigation.navigate(routes.CHAT_SCREEN);
	});

	return (
		<Tab.Navigator
			initialRouteName={routes.BROWSE}
			screenOptions={{ headerShown: false }}
			tabBarOptions={{
				showLabel: false,
				keyboardHidesTabBar: true,
			}}
		>
			<Tab.Screen
				name={routes.MY_POST_DETAILS}
				component={MyPostsDetailsNavigator}
				options={{
					unmountOnBlur: true,
					tabBarIcon: ({ color, size }) => (
						<FontAwesome
							name="clone"
							color={color}
							size={size - 4}
						/>
					),
				}}
			/>
			<Tab.Screen
				name={routes.BROWSE}
				component={BrowseNavigator}
				options={({ route }) => ({
					tabBarIcon: ({ color, size }) => (
						<FontAwesome5
							name="search"
							color={color}
							size={size - 1}
						/>
					),
				})}
			/>
			<Tab.Screen
				name={routes.NEW_POST_SCREEN}
				component={NewPostScreen}
				options={({ navigation }) => ({
					tabBarButton: () =>
						(focusedChatNavigatorRouteName !== routes.CHAT_SCREEN ||
							getFocusedRouteNameFromRoute(route) !==
								routes.CHAT) && (
							<NewPostButton
								onPress={() =>
									navigation.navigate(routes.NEW_POST_SCREEN)
								}
							/>
						),
				})}
			/>
			<Tab.Screen
				name={routes.CHAT}
				component={ChatNavigator}
				options={({ route }) => ({
					unmountOnBlur: true,
					tabBarIcon: ({ color, size }) => (
						<FontAwesome
							name="comments"
							color={color}
							size={size}
						/>
					),
					tabBarVisible:
						getFocusedRouteNameFromRoute(route) !==
						routes.CHAT_SCREEN,
				})}
			/>
			<Tab.Screen
				name={routes.PROFILE}
				component={ProfileNavigator}
				options={{
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="account"
							color={color}
							size={size}
						/>
					),
				}}
			/>
		</Tab.Navigator>
	);
}
