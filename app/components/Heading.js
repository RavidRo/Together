import React from "react";
import { useFonts } from "expo-font";

import AppText from "../components/AppText";
import texts from "../config/texts";
import defaultStyles from "../config/defaultStyles";

const pacifico = require("../assets/fonts/Pacifico/Pacifico-Regular.ttf");
const fontSize = 60;
const smallFontSize = 24;

export default function Heading({ children, style, small, ...otherProps }) {
	let [fontsLoaded] = useFonts({
		"Pacifico-Regular": pacifico,
	});

	return (
		<AppText
			{...otherProps}
			style={[
				{
					fontFamily: fontsLoaded ? "Pacifico-Regular" : null,
					fontSize: small ? smallFontSize : fontSize,
					color: small
						? defaultStyles.colors.primary
						: defaultStyles.colors.white,
				},
				style,
			]}
		>
			{children ? children : texts.APP_NAME}
		</AppText>
	);
}
