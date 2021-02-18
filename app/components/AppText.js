import { useFonts } from "expo-font";
import React from "react";
import { Text } from "react-native";

import defaultStyles from "../config/defaultStyles";
import fonts from "../config/fonts";

export default function AppText({
	children,
	style,
	weight = "regular",
	color = defaultStyles.text.color,
	...otherProps
}) {
	const [fontsLoaded] = useFonts(fonts.fontsDict);

	return (
		<Text
			style={[
				defaultStyles.text,
				{
					fontFamily: fontsLoaded
						? fonts.getArimoFamily(weight)
						: null,
				},
				{ color: color },
				style,
			]}
			{...otherProps}
		>
			{children}
		</Text>
	);
}
