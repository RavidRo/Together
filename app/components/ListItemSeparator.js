import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../config/colors";

function ListItemSeparator({ margin = 14, weight = 1, color = colors.medium }) {
	const styles = StyleSheet.create({
		separator: {
			marginVertical: margin,
			width: "100%",
			height: weight,
			backgroundColor: color,
		},
	});
	return <View style={styles.separator} />;
}

export default ListItemSeparator;
