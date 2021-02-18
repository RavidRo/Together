import React, { useState } from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "./AppText";
import ProfilePicture from "./ProfilePicture";
import posts from "../Data/posts";
import colors from "../config/colors";
import { postsScreens } from "../config/enumes";
import usersPosts from "../Data/usersPosts";
import texts from "../config/texts";
import ConfirmAlert from "./ConfirmAlert";
import { isRTL } from "expo-localization";

const cardPadding = 12;
const borderRadius = 10;
const marginBottom = 20;
const backgroundColor = colors.white;
const textTimeSize = 14;
const titleFontSize = 19;

const makeOperation = (icon, color, size, onPress) => ({
	icon: {
		name: icon,
		color,
		size,
	},
	onPress: onPress,
});

export default function MiniCard({ post, onPress, postKind, reload }) {
	const [completed, setCompleted] = useState(post.completed);
	const [showCompleteAlert, setShowCompleteAlert] = useState(false);
	const [showDeleteAlert, setShowDeleteAlert] = useState(false);
	const [showUnregisterAlert, setShowUnregisterAlert] = useState(false);

	const alerts = [
		<ConfirmAlert
			key={1}
			{...texts.ALERTS.COMPLETE_POST_ALERT}
			show={showCompleteAlert}
			hide={() => setShowCompleteAlert(false)}
			onConfirm={() =>
				posts
					.setPostAsCompleted(
						post.category,
						post.requireHelp,
						post.id,
						post.ownerId
					)
					.catch("נתקלנו בבעיה")
					.then(() => setCompleted(true))
			}
		/>,
		<ConfirmAlert
			key={2}
			{...texts.ALERTS.DELETE_POST_ALERT}
			show={showDeleteAlert}
			hide={() => setShowDeleteAlert(false)}
			onConfirm={() =>
				posts
					.deletePost(
						post.category,
						post.requireHelp,
						post.id,
						post.ownerId
					)
					.catch("נתקלנו בבעיה")
					.then(reload)
			}
		/>,
		<ConfirmAlert
			key={3}
			{...texts.ALERTS.UNREGISTER_ALERT}
			show={showUnregisterAlert}
			hide={() => setShowUnregisterAlert(false)}
			onConfirm={() => {
				usersPosts
					.cancelRegistration(post.id, post.ownerId)
					.catch("נתקלנו בבעיה");
				reload();
			}}
		/>,
	];

	const operations =
		postKind === postsScreens.MY_POSTS
			? [
					makeOperation(
						"check-bold",
						completed ? colors.light : colors.primary,
						30,
						() => setShowCompleteAlert(!completed)
					),
					makeOperation("delete-forever", "red", 40, () =>
						setShowDeleteAlert(true)
					),
			  ]
			: postKind === postsScreens.MY_REGISTRATIONS
			? [
					makeOperation("cancel", "red", 30, () =>
						setShowUnregisterAlert(true)
					),
			  ]
			: [];

	return (
		<TouchableWithoutFeedback onPress={onPress}>
			<View
				style={[
					styles.card,
					{ borderColor: completed ? colors.primary : colors.black },
				]}
			>
				{alerts}
				<View style={styles.cradHeader}>
					<ProfilePicture getImage={post.getOwnerProfilePicture} />
					<View style={styles.headerDetails}>
						<AppText
							style={styles.title}
							numberOfLines={2}
							weight="bold"
						>
							{post.title}
						</AppText>
						<AppText numberOfLines={1} style={styles.time}>
							{post.time}
						</AppText>
					</View>
					<View style={styles.iconsContainer}>
						<MaterialCommunityIcons
							name="chevron-left"
							color={colors.medium}
							size={40}
						/>

						{operations.map((item, index) => (
							<TouchableWithoutFeedback
								key={index}
								onPress={item.onPress}
							>
								<MaterialCommunityIcons {...item.icon} />
							</TouchableWithoutFeedback>
						))}
					</View>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	card: {
		borderRadius,
		marginBottom,
		borderWidth: 2.5,
		overflow: "hidden",
		backgroundColor,
		elevation: 3,
		padding: cardPadding,
	},
	cradHeader: {
		flexDirection: isRTL ? "row" : "row-reverse",
		alignItems: "center",
		justifyContent: "flex-end",
		width: "100%",
	},
	headerDetails: isRTL
		? {
				flex: 1,
				marginLeft: 10,
		  }
		: {
				flex: 1,
				marginRight: 10,
		  },
	time: {
		fontSize: textTimeSize,
		color: colors.dark,
		alignSelf: isRTL ? "flex-start" : "flex-end",
	},
	title: {
		fontSize: titleFontSize,
		color: colors.black,
	},
	iconsContainer: {
		flexDirection: isRTL ? "row-reverse" : "row",
		alignItems: "center",
		justifyContent: isRTL ? "flex-start" : "flex-end",
	},
});
