import * as React from "react";
import { View, StyleSheet } from "react-native";
import { MaterialTopTabBar } from "@react-navigation/material-top-tabs";

import CategoryHeading from "../CategoryHeading";

export default function MyPostsTabBar({ ...otherProps }) {
	return (
		<>
			<View style={styles.headerContainer}>
				<CategoryHeading>הפעילות שלי</CategoryHeading>
			</View>
			<MaterialTopTabBar {...otherProps} />
		</>
	);
}

const styles = StyleSheet.create({
	headerContainer: {
		paddingTop: 14,
		paddingHorizontal: 16,
	},
});
