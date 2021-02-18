import React from "react";
import { StyleSheet } from "react-native";

import defaultStyles from "../../config/defaultStyles";
import AppText from "../AppText";

export default function ErrorMessage({ error, visible }) {
	return !error || !visible ? null : (
		<AppText weight="bold" style={styles.error}>
			{error}
		</AppText>
	);
}

const styles = StyleSheet.create({
	error: { color: defaultStyles.colors.darkSecondary, alignSelf: "center" },
});
