import React from "react";
import {
	createStackNavigator,
	HeaderBackButton,
} from "@react-navigation/stack";
import { Dimensions, View } from "react-native";
import Constants from "expo-constants";

import routes from "./route";
import ChatScreen from "../screens/Chat/ChatScreen";
import ContactScreen from "../screens/Chat/ContactsScreen";
import CategoryHeading from "./CategoryHeading";
import AppText from "../components/AppText";
import Heading from "../components/Heading";
import { isRTL } from "expo-localization";

const Stack = createStackNavigator();

export default function ChatNavigator(navigation) {
	return (
		<Stack.Navigator
			initialRouteName={routes.CONTACTS_SCREEN}
			screenOptions={{}}
		>
			<Stack.Screen
				name={routes.CONTACTS_SCREEN}
				component={ContactScreen}
				options={{
					headerTitle: () => <CategoryHeading>שיחות</CategoryHeading>,
				}}
			/>
			<Stack.Screen
				name={routes.CHAT_SCREEN}
				component={ChatScreen}
				options={({ navigation, route }) => ({
					header: () => {
						return (
							<View
								style={{
									height: 80,
									right: 5,
									width: Dimensions.get("screen").width + 10,
									paddingTop: Constants.statusBarHeight,
									flexDirection: "row",
									alignItems: "center",
									elevation: 3,
									borderBottomWidth: 0.1,
								}}
							>
								<HeaderBackButton
									onPress={() =>
										navigation.replace(
											routes.CONTACTS_SCREEN
										)
									}
								/>
								<AppText
									color="black"
									style={{ flex: isRTL ? 0.92 : 0 }}
								>
									{route.params.talkingToName}
								</AppText>
								<View
									style={{
										flex: isRTL ? 0 : 0.92,
									}}
								>
									<Heading
										small
										style={
											isRTL
												? {}
												: { alignSelf: "flex-end" }
										}
									/>
								</View>
							</View>
						);
					},
				})}
			/>
		</Stack.Navigator>
	);
}
