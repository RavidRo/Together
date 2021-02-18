import React from "react";
import { View, StyleSheet, TouchableHighlight } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import defaultStyles from "../config/defaultStyles";
import AppText from "./AppText";
import colors from "../config/colors";
import { isRTL } from "expo-localization";

const textSpace = 0.8;

export default function AppButton({
	IconType = MaterialCommunityIcons,
	icon,
	iconSize = 20,
	iconColor = defaultStyles.colors.white,
	text,
	style,
	underlayColor = colors.light,
	...otherProps
}) {
	return (
		<TouchableHighlight
			style={[styles.container, style]}
			underlayColor={underlayColor}
			{...otherProps}
		>
			<View style={styles.button}>
				<View style={styles.iconContainer}>
					<IconType name={icon} size={iconSize} color={iconColor} />
				</View>
				<AppText weight="bold" style={styles.buttonText}>
					{text}
				</AppText>
			</View>
		</TouchableHighlight>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#56CFE1",
		paddingVertical: 17,
		paddingHorizontal: 10,
		borderWidth: 0.4,
	},
	button: {
		flexDirection: isRTL ? "row" : "row-reverse",
		alignItems: "center",
		flex: 1,
	},
	buttonText: {
		flex: textSpace,
		textAlign: "center",
		fontSize: 17,
	},
	iconContainer: {
		marginRight: 10,
		flex: 1 - textSpace,
	},
});
