import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import defaultStyles from "../config/defaultStyles";
import { isRTL } from "expo-localization";

const placeHolderColor = defaultStyles.colors.medium;
const iconSize = 20;
//const backgroundColor = defaultStyles.colors.testLight;
//const borderColor = defaultStyles.colors.dark;
const textColor = defaultStyles.colors.dark;
//const borderRadius = 1;
//const borderWidth = 1.5;

const autoHeight = 35; // Dont change this. If you will change it the height will just jiggle on start

function AppTextInput({
	icon,
	width = "100%",
	children,
	numberOfLines,
	...otherProps
}) {
	const [height, setHeight] = useState(autoHeight);
	return (
		<View
			style={[
				styles.container,
				{ width, borderBottomColor: "black", borderBottomWidth: 2 },
			]}
		>
			{icon && (
				<MaterialCommunityIcons
					name={icon}
					size={iconSize}
					color={"black"}
					style={styles.icon}
				/>
			)}
			<TextInput
				placeholder={children}
				placeholderTextColor={placeHolderColor}
				style={[
					defaultStyles.text,
					styles.text,
					{
						height: numberOfLines
							? Math.max(autoHeight * numberOfLines, height)
							: height,
					},
				]}
				onContentSizeChange={(e) =>
					setHeight(e.nativeEvent.contentSize.height)
				}
				{...otherProps}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: isRTL ? "row" : "row-reverse",
		paddingBottom: 10,
		alignItems: "center",
	},
	icon: isRTL
		? {
				marginRight: 10,
		  }
		: {
				marginLeft: 10,
		  },
	text: {
		flex: 1,
		color: textColor,
	},
});

export default AppTextInput;
