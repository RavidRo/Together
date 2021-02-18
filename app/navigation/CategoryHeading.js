import React from "react";
import { View, StyleSheet } from "react-native";
import defaultStyles from "../config/defaultStyles";
import AppText from "../components/AppText";
import Heading from "../components/Heading";
import { isRTL } from "expo-localization";

export default function CategoryHeading({ children }) {
	return (
		<View style={styles.screenHeading}>
			<AppText style={styles.header} weight="bold">
				{children}
			</AppText>
			<Heading small />
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		fontSize: 24,
		color: defaultStyles.colors.primary,
	},
	screenHeading: {
		flexDirection: isRTL ? "row" : "row-reverse",
		justifyContent: "space-between",
		alignItems: "flex-end",
		marginBottom: 15,
	},
});
