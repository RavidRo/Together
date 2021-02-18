import { View } from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { List } from "react-native-paper";
import users from "../Data/users";
import route from "../navigation/route";
import ProfilePicture from "./ProfilePicture";

export default function ChatBox({ nameId, navigation, item }) {
	const [name, setName] = useState(false);
	const [profilePicture, setProfilePicture] = useState(null);

	useEffect(() => {
		const getName = async () => {
			users.getDisplayName(nameId).then(setName);
		};
		getName();
		users.getProfilePicture(nameId).then(setProfilePicture);
	}, []);

	return (
		<View>
			{name && (
				<TouchableOpacity
					onPress={() =>
						navigation.replace(route.CHAT_SCREEN, {
							thread: item,
							talkingToName: name,
						})
					}
				>
					<List.Item
						title={name}
						description={item.latestMessage.text}
						titleNumberOfLines={1}
						titleStyle={styles.listTitle}
						descriptionStyle={styles.listDescription}
						descriptionNumberOfLines={1}
						left={(props) => (
							<ProfilePicture
								size={50}
								uri={profilePicture}
								style={{ alignSelf: "center" }}
							></ProfilePicture>
						)}
					/>
				</TouchableOpacity>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
});
