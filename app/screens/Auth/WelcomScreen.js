import React from "react";
import { View, StyleSheet, Image } from "react-native";

import Screen from "../../components/Screen";
import Heading from "../../components/Heading";
import route from "../../navigation/route";

const image = require("../../assets/images/team.png");

class WelcomScreen extends React.Component {
	constructor(props) {
		super(props);

		setTimeout(() => {
			props.navigation.replace(route.LOGIN_SCREEN);
		}, 500);
	}
	render() {
		return (
			<Screen mainColor style={styles.container}>
				<View style={styles.headerBox}>
					<Heading />
				</View>
				<Image source={image} style={styles.image}></Image>
			</Screen>
		);
	}
}

export default WelcomScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	headerBox: {
		bottom: "-9%",
	},
	image: {
		transform: [
			{
				scale: 0.5,
			},
		],
		bottom: "-1%",
	},
});
