import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Feather } from "@expo/vector-icons";

import AppTextInput from "../AppTextInput";
import ButtonSwitch from "../ButtonSwitch";
import defaultStyles from "../../config/defaultStyles";
import { categoriesYouCasAskForHelpIn } from "../../Data/posts";
import texts from "../../config/texts";

export default function PostsSearch({
	onPress,
	onPressOffering,
	onPressRequiring,
	onChangeText,
	category,
}) {
	return (
		<>
			<View style={styles.searchContainer}>
				<View style={styles.serachBoxContainer}>
					<AppTextInput
						icon="magnify"
						radius={15}
						onChangeText={onChangeText}
					>
						חיפוש
					</AppTextInput>
				</View>
				{/* -------------For the mean whie we removed this,-------------------------------
					-------maybe we will add more search options in the future----------------- */}

				{/* <TouchableWithoutFeedback onPress={onPress}>
					<View style={styles.iconBox}>
						<Feather
							name="more-horizontal"
							color={defaultStyles.colors.dark}
							size={35}
						/>
					</View>
				</TouchableWithoutFeedback> */}
			</View>
			{categoriesYouCasAskForHelpIn.includes(category) && (
				<ButtonSwitch
					left={texts.POSTS_PROPERTIES.WANT_TO_HELP}
					right={texts.POSTS_PROPERTIES.SEAKING_HELP}
					onPressLeft={onPressOffering}
					onPressRight={onPressRequiring}
				/>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 15,
		marginBottom: 15,
	},
	serachBoxContainer: {
		flex: 1,
	},
	iconBox: {
		paddingHorizontal: 10,
		justifyContent: "center",
		alignItems: "center",
	},
});
