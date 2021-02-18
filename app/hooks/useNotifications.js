import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { useEffect } from "react";

import users from "../Data/users";

export default useNotification = (notificationListener) => {
	const registerForPushNotifications = async () => {
		const permission = await Permissions.askAsync(
			Permissions.NOTIFICATIONS
		);
		if (!permission.granted) return;

		try {
			const token = await Notifications.getExpoPushTokenAsync();
			users.updateNotificationToken(token.data);
		} catch (error) {
			console.log("Error getting a push token", error);
		}
	};

	useEffect(() => {
		// This doesn't seem to work at the moment :(
		registerForPushNotifications();
		if (notificationListener) {
			const subsctiption = Notifications.addNotificationReceivedListener(
				notificationListener
			);
			console.log("Registered for notifications...");
			// return () => {
			// 	subsctiption.remove();
			// 	console.log("Removed from notifications...");
			// };
		}
	}, []);
};
