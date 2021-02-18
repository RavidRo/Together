import React from "react";
import Constants from "expo-constants";
import { StyleSheet, SafeAreaView, View } from "react-native";

import defaultStyles from "../config/defaultStyles";

function Screen({ children, style, mainColor = false }) {
	return (
		<SafeAreaView
			style={[
				styles.screen,
				{
					backgroundColor: mainColor
						? defaultStyles.colors.primary
						: defaultStyles.colors.grey,
				},
			]}
		>
			<View style={[styles.view, style]}>{children}</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	screen: {
		paddingTop: Constants.statusBarHeight,
		flex: 1,
	},
	view: {
		flex: 1,
	},
});

export default Screen;
