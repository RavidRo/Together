const openSansBold = require("../assets/fonts/OpenSansHebrew/OpenSansHebrew-Bold.ttf");
const openSansExtraBold = require("../assets/fonts/OpenSansHebrew/OpenSansHebrew-ExtraBold.ttf");
const openSansLight = require("../assets/fonts/OpenSansHebrew/OpenSansHebrew-Light.ttf");
const openSansRegular = require("../assets/fonts/OpenSansHebrew/OpenSansHebrew-Regular.ttf");

const arimoBold = require("../assets/fonts/Arimo/Arimo-Bold.ttf");
const arimoRegular = require("../assets/fonts/Arimo/Arimo-Regular.ttf");

export default {
	openSansBold: openSansBold,
	openSansExtraBold: openSansExtraBold,
	openSansLight: openSansLight,
	openSansRegular: openSansRegular,

	getOpenSansFamily: (weight) =>
		weight === "bold" || weight === "700"
			? "OpenSansHebrew-Bold"
			: weight === "extraBold " || weight === "900"
			? "OpenSansHebrew-ExtraBold"
			: weight === "light " || weight === "200"
			? "OpenSansHebrew-Light"
			: "OpenSansHebrew-Regular",

	arimoBold: arimoBold,
	arimoRegular: arimoRegular,

	getArimoFamily: (weight) =>
		weight === "bold" || weight === "700" ? "Arimo-Bold" : "Arimo-Regular",

	fontsDict: {
		"OpenSansHebrew-Bold": openSansBold,
		"OpenSansHebrew-ExtraBold": openSansExtraBold,
		"OpenSansHebrew-Light": openSansLight,
		"OpenSansHebrew-Regular": openSansRegular,

		"Arimo-Bold": arimoBold,
		"Arimo-Regular": arimoRegular,
	},
};
