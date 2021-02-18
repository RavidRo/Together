import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "../../components/AppText";
import Screen from "../../components/Screen";
import Heading from "../../components/Heading";
import users from "../../Data/users";
import defaultStyles from "../../config/defaultStyles";
import ProfileImagePicker from "../../components/ProfileImagePicker";
import colors from "../../config/colors";
import texts from "../../config/texts";
import ConfirmAlert from "../../components/ConfirmAlert";
import { isRTL } from "expo-localization";

export default function ProfileScreen(props) {
	const [acomplishmentCount, setAcomplishmentCount] = useState(null);
	const [displayName, setDisplayName] = useState("טוען...");
	const [initDisplayName, setInitDisplayName] = useState(null);
	const [editable, setEditable] = useState(false);
	const [showAlert, setShowAlert] = useState(false);

	useEffect(() => {
		const name = users.getCurrentUserDisplayName();
		setDisplayName(name);
		setInitDisplayName(name);
		users.getAcomplishmentsCount().then(setAcomplishmentCount);
	}, []);

	return (
		<Screen>
			<ConfirmAlert
				{...texts.ALERTS.SAVE_DISPLAY_NAME}
				message={
					texts.ALERTS.SAVE_DISPLAY_NAME.message + displayName + "?"
				}
				show={showAlert}
				hide={() => setShowAlert(false)}
				onConfirm={() => {
					setEditable(false);
					users.setDisplayName(displayName);
					setInitDisplayName(displayName);
				}}
			/>
			<View style={styles.header}>
				<Heading small></Heading>
			</View>
			<View style={styles.container}>
				<View style={styles.details}>
					<ProfileImagePicker />
					<View style={styles.stats}>
						<View style={styles.displayNameContainer}>
							<TouchableOpacity
								activeOpacity={0.8} //The opacity of the button when it is pressed
								style={[
									styles.editButton,
									styles.editButtonRTL,
								]}
								onPress={() => {
									if (editable) {
										if (displayName === initDisplayName) {
											setEditable(false);
										} else if (displayName != "") {
											setShowAlert(true);
										}
									} else {
										setEditable(true);
									}
								}}
							>
								<MaterialCommunityIcons
									name={
										editable
											? "content-save-edit"
											: "lead-pencil"
									}
									size={25}
								></MaterialCommunityIcons>
							</TouchableOpacity>
							<TextInput
								style={[defaultStyles.text, styles.displayName]}
								editable={editable}
								autoCorrect={false}
								autoFocus={editable}
								onChangeText={setDisplayName}
								value={displayName}
							/>
						</View>
						{/* <AppText color="black">{`מרחק מירבי: ${user.MaxLocation} ק"מ`}</AppText>
						<AppText color="black">{`הדירוג שלי: ${user.rating}`}</AppText> */}
						<AppText color="black">
							{acomplishmentCount === null
								? "טוען..."
								: `מספר התרומות שלי: ${acomplishmentCount}`}
						</AppText>
					</View>
				</View>
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		marginTop: 40,
	},
	header: isRTL ? { right: 7, top: 4 } : { left: 7, top: 4 },

	stats: {
		position: "relative",
		alignItems: "center",
		marginRight: 0,
		marginTop: 14,
	},
	displayNameContainer: {
		flexDirection: isRTL ? "row" : "row-reverse",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 14,
	},
	displayName: {
		color: colors.black,
		fontSize: 25,
	},
	editButton: {
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 150,
		width: 25,
		height: 25,
	},
	editButtonRTL: isRTL
		? {
				marginRight: 15,
		  }
		: {
				marginLeft: 15,
		  },
});
