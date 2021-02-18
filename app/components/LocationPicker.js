import React from "react";
import { View, StyleSheet } from "react-native";
import { CheckBox } from "react-native-elements";
import AppTextInput from "./AppTextInput";

export default function LocationPicker({ checked, onPress, ...otherProps }) {
	return (
		<>
			<View style={styles.fieldContainer}>
				<AppTextInput
					radius={10}
					numberOfLines={2}
					multiline
					textAlignVertical="top"
					{...otherProps}
				>
					תיאור המיקום
				</AppTextInput>
			</View>
			<View style={styles.fieldContainer}>
				<CheckBox
					title="תשתמש במיקום הנוכחי שלי"
					checked={checked}
					onPress={onPress}
					containerStyle={styles.checkBoxContainer}
				/>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	fieldContainer: {
		marginBottom: 10,
	},
	checkBoxContainer: {
		backgroundColor: "transparent",
		borderWidth: 0,
		padding: 0,
	},
});
