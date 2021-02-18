import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";

import users from "../Data/users";
import settings from "../config/settings";
import ProfilePicture from "../components/ProfilePicture";
import ConfirmAlert from "./ConfirmAlert";
import texts from "../config/texts";

export default function ProfileImagePicker() {
	const [imageUri, setImageUri] = useState(null);
	const [showAlert, setShowAlert] = useState(false);
	const [editable, setEditable] = useState(false);

	const requestCameraPermission = async () => {
		const {
			granted,
		} = await ImagePicker.requestCameraRollPermissionsAsync();
		return granted;
	};
	useEffect(() => {
		users
			.getProfilePicture()
			.then((uri) => {
				setImageUri(uri);
				setEditable(true);
			})
			.catch((error) => {
				alert("נתקלנו בעיה בעת טעינת תמונת הפרופיל");
				console.log(error);
			});
	}, []);

	const pickImage = async () => {
		if (await requestCameraPermission()) {
			try {
				let result = await ImagePicker.launchImageLibraryAsync({
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					allowsEditing: true,
					aspect: [1, 1],
					quality: settings.IMAGE_QUALITY,
				});

				if (!result.cancelled) {
					setEditable(false);
					await users.updateProfilePicture(result.uri);
					setEditable(true);
					setImageUri(result.uri);
				}
			} catch (e) {
				console.log(e);
				alert("נתקלנו בבעיה בעת בחירת התמונה");
			}
		} else {
			alert("מצטערים, על מנת לבחור תמונת פרופיל נצטרך הרשאות לגלריה שלך");
		}
	};

	const handlePress = () => {
		console.log(imageUri);
		if (editable) {
			if (!imageUri) {
				pickImage();
			} else {
				setShowAlert(true);
			}
		}
	};

	return (
		<>
			<ConfirmAlert
				{...texts.ALERTS.DELETE_PROFILE_PICTURE}
				show={showAlert}
				hide={() => setShowAlert(false)}
				onConfirm={() => {
					setImageUri(null);
					setEditable(false);
					users.deleteProfilePicture().then(() => setEditable(true));
				}}
			/>
			<TouchableOpacity
				activeOpacity={0.8} //The opacity of the button when it is pressed
				style={styles.button}
				onPress={handlePress}
			>
				<ProfilePicture uri={imageUri} size={100} editable={editable} />
			</TouchableOpacity>
		</>
	);
}

const styles = StyleSheet.create({
	button: {
		justifyContent: "center",
		alignItems: "center",
	},
});
