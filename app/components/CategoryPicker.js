import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SimpleLineIcons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";

import AppText from "./AppText";
import { categories } from "../Data/posts";
import colors from "../config/colors";
import texts from "../config/texts";

const activeBackgroundColor = colors.primary;
const inactiveBackgroundColor = colors.white;
const activeIconColor = colors.white;
const inactiveIconColor = colors.primary;

const borderWidth = 2;

const pickers = [
	{
		category: categories.FOOD,
		iconType: FontAwesome5,
		iconName: "utensils",
		categoryName: texts.CATEGORIES.FOOD,
	},
	{
		category: categories.TEACHING,
		iconType: FontAwesome,
		iconName: "book",
		categoryName: texts.CATEGORIES.TEACHING,
	},
	{
		category: categories.THROWN_ITEMS,
		iconType: SimpleLineIcons,
		iconName: "present",
		categoryName: texts.CATEGORIES.THROWN_ITEMS,
	},
	{
		category: categories.VOLUNTEERING,
		iconType: FontAwesome5,
		iconName: "hands-helping",
		categoryName: texts.CATEGORIES.VOLUNTEERING,
	},
];

export default function CategoryPicker({
	defaultCategory = categories.VOLUNTEERING,
	setCategory,
}) {
	const [activeCategory, setActiveCategory] = useState(defaultCategory);
	return (
		<>
			<AppText color="black">בחר קטגוריה:</AppText>

			<View style={styles.catagory}>
				{pickers.map((item) => (
					<TouchableOpacity
						onPress={() => {
							setActiveCategory(item.category);
							setCategory(item.category);
						}}
						key={item.category}
					>
						<View
							style={[
								styles.circle,
								{
									backgroundColor:
										activeCategory === item.category
											? activeBackgroundColor
											: inactiveBackgroundColor,
								},
							]}
						>
							<item.iconType
								size={25}
								name={item.iconName}
								color={
									activeCategory === item.category
										? activeIconColor
										: inactiveIconColor
								}
							></item.iconType>
						</View>
						<AppText style={styles.categoryText}>
							{item.categoryName}
						</AppText>
					</TouchableOpacity>
				))}
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	catagory: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: 10,
		marginBottom: 10,
	},
	circle: {
		borderRadius: 150,
		height: 80,
		width: 80,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: borderWidth,
		borderColor: activeBackgroundColor,
	},
	categoryText: {
		marginTop: 4,
		textAlign: "center",
		color: colors.primary,
	},
});
