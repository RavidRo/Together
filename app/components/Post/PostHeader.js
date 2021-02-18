import { isRTL } from "expo-localization";
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import AppText from "../AppText";
import ListItemSeparator from "../ListItemSeparator";
import ProfilePicture from "../ProfilePicture";

const profilePictureSize = 50;

export default function PostHeader({
	title,
	getDisplayName,
	displayName,
	getProfilePicture,
	profilePictureUri,
	time,
}) {
	const [asyncDisplayName, setAsyncDisplayName] = useState("טוען...");
	useEffect(() => {
		if (getDisplayName) {
			getDisplayName().then(setAsyncDisplayName);
		}
	}, []);

	return (
		<View style={styles.postHeading}>
			<View style={styles.headerDetails}>
				<ProfilePicture
					getImage={getProfilePicture}
					size={profilePictureSize}
					uri={profilePictureUri}
				/>
				<View style={styles.ownerDetails}>
					<AppText color="black" style={styles.subTitle}>{`${
						displayName ? displayName : asyncDisplayName
					}\n${time}`}</AppText>
				</View>
			</View>

			<ListItemSeparator />
			{title && (
				<AppText color="black" weight="bold" style={styles.title}>
					{title}
				</AppText>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	postHeading: {
		paddingVertical: 6,
	},
	headerDetails: { flexDirection: isRTL ? "row" : "row-reverse" },
	ownerDetails: isRTL
		? { justifyContent: "center", marginLeft: 10 }
		: { justifyContent: "center", marginRight: 10 },
	title: {
		fontSize: 19,
	},
	subTitle: {
		fontSize: 14,
	},
});
