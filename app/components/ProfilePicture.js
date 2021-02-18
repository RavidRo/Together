import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";

const profileImageRegularSize = 70;
const profileImageRadius = 150;
const profileImageWidth = 3;

export default function ProfilePicture({
	getImage,
	size = profileImageRegularSize,
	editable = false,
	uri,
	style,
}) {
	const [image, setImage] = useState(null);
	useEffect(() => {
		if (getImage) {
			getImage().then(setImage);
		}
	}, []);

	const styles = StyleSheet.create({
		profileImage: {
			height: size,
			width: size,
			alignItems: "center",
			justifyContent: "center",
		},
		border: {
			overflow: "hidden",
			borderRadius: profileImageRadius,
			backgroundColor: colors.white,
			borderWidth: image || uri ? 0 : profileImageWidth,
		},
		editIcon: {
			position: "absolute",
			backgroundColor: colors.white,
			borderRadius: profileImageRadius,
			borderWidth: 0.5,
			top: size * (3 / 4) - 4,
			right: size * (3 / 4) - 4,
		},
		image: { width: "100%", height: "100%" },
	});

	return (
		<View style={[styles.profileImage, style]}>
			<View style={[styles.profileImage, styles.border]}>
				{image || uri ? (
					<Image
						source={{ uri: image || uri }}
						style={styles.image}
					/>
				) : (
					<MaterialCommunityIcons
						name="account"
						size={size * (5 / 7)}
						color={colors.dark}
					/>
				)}
			</View>
			{editable && (
				<View style={styles.editIcon}>
					<MaterialCommunityIcons
						name={image || uri ? "delete-forever" : "image-plus"}
						size={27}
						color={colors.dark}
					/>
				</View>
			)}
		</View>
	);
}
