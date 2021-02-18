import React from "react";
import { View, StyleSheet } from "react-native";

import AppText from "../../components/AppText";
import Screen from "../../components/Screen";
import { categories } from "../../Data/posts";
import { SimpleLineIcons, FontAwesome5 } from "@expo/vector-icons";
import colors from "../../config/colors";
import AppButton from "../../components/AppButton";

const horizontalPaddingHeader = 12;

const buttons = [
	{
		backgroundColor: "#72EFDD",
		iconType: FontAwesome5,
		iconSize: 25,
		iconName: "utensils",
		iconColor: colors.white,
		text: "נשאר לך אוכל?",
		category: categories.FOOD,
	},
	{
		backgroundColor: "#64DFDF",
		iconType: FontAwesome5,
		iconSize: 25,
		iconName: "book",
		iconColor: colors.white,
		text: "למידה",
		category: categories.TEACHING,
	},
	{
		backgroundColor: "#56CFE1",
		iconType: SimpleLineIcons,
		iconSize: 25,
		iconName: "present",
		iconColor: colors.white,
		text: "מוסר משהו?",
		category: categories.THROWN_ITEMS,
	},
	{
		backgroundColor: "#48BFE3",
		iconType: FontAwesome5,
		iconSize: 25,
		iconName: "hands-helping",
		iconColor: colors.white,
		text: "יכול להציע משהו אחר?",
		category: categories.VOLUNTEERING,
	},
];

export default function OptionsScreen({ navigation }) {
	return (
		<Screen style={styles.header}>
			<View style={styles.body}>
				<AppText style={styles.textHeading}>בואו נבחר קטגוריה:</AppText>
				{buttons.map((button) => (
					<AppButton
						key={button.category}
						style={[
							styles.button,
							{ backgroundColor: button.backgroundColor },
						]}
						onPress={() =>
							navigation.navigate("CategoryScreen", {
								category: button.category,
							})
						}
						IconType={button.iconType}
						iconSize={button.iconSize}
						icon={button.iconName}
						iconColor={button.iconColor}
						text={button.text}
					/>
				))}
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	header: {
		paddingHorizontal: horizontalPaddingHeader,
	},
	button: {
		height: 90,
		width: 240,
		alignItems: "center",
		paddingHorizontal: 40,
		marginBottom: 20,
		borderWidth: 0,
	},
	body: {
		flex: 4,
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		alignContent: "center",
	},
	text: {
		fontSize: 16,
		fontWeight: "bold",
	},
	textHeading: {
		color: "black",
		marginBottom: 30,
	},
});
