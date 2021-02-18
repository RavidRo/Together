import React, { useState } from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";

import defaultStyles from "../config/defaultStyles";
import AppText from "./AppText";

const RIGHT = true;
const LEFT = false;

const backgroundColorActive = defaultStyles.colors.primary;
const backgroundColorInactive = defaultStyles.colors.white;
const textColorActive = defaultStyles.colors.white;
const textColorInactive = defaultStyles.colors.primary;

export default function ButtonSwitch({
	left,
	right,
	onPressRight,
	onPressLeft,
	style,
}) {
	const [leftRight, setLeftRight] = useState(RIGHT);
	return (
		<View style={[styles.container, style]}>
			<TouchableWithoutFeedback
				onPress={() => {
					setLeftRight(RIGHT);
					onPressRight();
				}}
			>
				<View
					style={[
						styles.button,
						{
							backgroundColor:
								leftRight === RIGHT
									? backgroundColorActive
									: backgroundColorInactive,
						},
					]}
				>
					<AppText
						style={{
							color:
								leftRight === RIGHT
									? textColorActive
									: textColorInactive,
						}}
					>
						{right}
					</AppText>
				</View>
			</TouchableWithoutFeedback>
			<TouchableWithoutFeedback
				onPress={() => {
					setLeftRight(LEFT);
					onPressLeft();
				}}
			>
				<View
					style={[
						styles.button,
						{
							backgroundColor:
								leftRight === LEFT
									? backgroundColorActive
									: backgroundColorInactive,
						},
					]}
				>
					<AppText
						style={{
							color:
								leftRight === LEFT
									? textColorActive
									: textColorInactive,
						}}
					>
						{left}
					</AppText>
				</View>
			</TouchableWithoutFeedback>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	button: {
		paddingVertical: 8,
		alignItems: "center",
		justifyContent: "center",
		height: 50,
		width: 170,
		borderWidth: 1,
		borderColor: defaultStyles.colors.primary,
	},
});
