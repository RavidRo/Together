import React from "react";
import {
	Alert,
	Image,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import colors from "../config/colors";
import settings from "../config/settings";

const size = 100;
const borderRadius = 20;

function ImageInput({ imageUri, onChangeImage }) {
	const requestCameraRollPermission = async () => {
		const result = await ImagePicker.requestCameraRollPermissionsAsync();
		if (!result.granted) {
			alert("You need to enable camera permission to access the library");
		}
		return result.granted;
	};

	const pickImage = async () => {
		if (await requestCameraRollPermission()) {
			try {
				const result = await ImagePicker.launchImageLibraryAsync({
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					allowsEditing: true,
					aspect: [2, 1],
					quality: settings.IMAGE_QUALITY,
				});
				if (!result.cancelled) {
					onChangeImage(result.uri);
				}
			} catch (error) {
				console.log(
					"Something went wrong when choosing an image",
					error
				);
			}
		}
	};

	const deleteImage = () => {
		Alert.alert("Deleting", "Are you sure you want to delete this image?", [
			{
				onPress: () => onChangeImage(null),
				text: "Yes",
			},
			{
				text: "No",
			},
		]);
	};

	const handlePress = () => {
		if (!imageUri) {
			pickImage();
		} else {
			deleteImage();
		}
	};

	return (
		<TouchableWithoutFeedback onPress={handlePress}>
			<View style={styles.container}>
				{imageUri ? (
					<Image
						style={styles.image}
						source={{
							uri: imageUri,
						}}
					/>
				) : (
					<MaterialCommunityIcons
						name="camera"
						size={size / 2}
						color={colors.medium}
					/>
				)}
			</View>
		</TouchableWithoutFeedback>
	);
}

export default ImageInput;

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		backgroundColor: colors.light,
		borderRadius: borderRadius,
		height: size,
		justifyContent: "center",
		overflow: "hidden",
		width: size,
	},

	image: {
		flex: 1,
		height: size,
		resizeMode: "cover",
		width: size,
	},
});
