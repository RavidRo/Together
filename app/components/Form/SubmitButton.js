import { useFormikContext } from "formik";
import React from "react";
import { StyleSheet, TouchableHighlight } from "react-native";

import AppTextBlack from "../AppTextBlack";

export default function SubmitButton({ children }) {
	const { handleSubmit } = useFormikContext();
	return (
		<TouchableHighlight
			style={styles.registerBtn}
			underlayColor={"white"}
			onPress={handleSubmit}
		>
			<AppTextBlack weight="bold">{children}</AppTextBlack>
		</TouchableHighlight>
	);
}

const styles = StyleSheet.create({
	registerBtn: {
		marginTop: 10,
		width: "100%",
		alignItems: "center",
		backgroundColor: "white",
		padding: 11,
		justifyContent: "center",
		//borderWidth: 1.5,
		//borderColor: defaultStyles.colors.white,
	},
});
