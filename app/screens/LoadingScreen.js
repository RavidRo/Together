import React from "react";
import { View, StyleSheet, Modal } from "react-native";
import LotteView from "lottie-react-native";

import colors from "../config/colors";

const loadAnimation = require("../assets/animations/loading.json");
const doneAnimation = require("../assets/animations/formUploaded.json");

export default function LoadingScreen({ visible, loading, onDone }) {
	return (
		<Modal visible={visible}>
			<View style={styles.container}>
				{loading ? (
					<LotteView
						source={loadAnimation}
						autoPlay
						loop
						style={styles.animation}
					/>
				) : (
					<LotteView
						source={doneAnimation}
						autoPlay
						loop={false}
						onAnimationFinish={onDone}
						style={styles.animation}
					/>
				)}
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
		backgroundColor: colors.primary,
	},
	animation: {
		width: 150,
	},
});
