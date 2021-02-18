import React, { useState } from "react";
import {
	View,
	StyleSheet,
	Image,
	TouchableWithoutFeedback,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";

import defaultStyles from "../config/defaultStyles";
import AppText from "./AppText";
import ProfilePicture from "./ProfilePicture";

import "firebase/firestore";
import users from "../Data/users";
import colors from "../config/colors";
import { useNavigation } from "@react-navigation/native";
import route from "../navigation/route";
import firestore from "../Data/firestore";
import ConfirmAlert from "./ConfirmAlert";
import texts from "../config/texts";
import usersPosts from "../Data/usersPosts";
import { categoriesYouCasAskForHelpIn } from "../Data/posts";
import { isRTL } from "expo-localization";

const cardPadding = 17;
const borderRadius = 10;
const marginBottom = 20;
const imageHeight = 200;
const imageRadius = 10;
const backgroundColor = defaultStyles.colors.white;
const textTimeSize = 14;
const textFontSize = 18;
const titleFontSize = 19;

export default function Card({ post, onPress }) {
	const [showAlert, setShowAlert] = useState(false);
	const navigation = useNavigation();

	const sendMessage = async () => {
		const ownerName = await post.getOwnerDisplayName();
		firestore.createChat(post.ownerId, (ref) =>
			navigation.navigate(route.CHAT, {
				screen: route.CHAT_SCREEN,
				params: {
					talkingToName: ownerName,
					thread: {
						_id: ref.id,
					},
				},
			})
		);
	};

	const onConfirm = () => {
		usersPosts
			.registerToNewPost(post.id, post.ownerId)
			.then((isRegistered) => {
				if (isRegistered) {
					alert("נשלחה התרעה לבעל הפוסט על הרשמתך");
					sendMessage();
				} else {
					alert("לצערנו ניתן להרשם לפוסט פעם אחת בלבד");
				}
			})
			.catch((error) => {
				console.error(error);
				alert("נתקלנו בבעיה כשניסינו לרשום אותך פוסט");
			});
	};

	return (
		<View style={styles.card}>
			<ConfirmAlert
				{...texts.ALERTS.POST_REGISTRATION}
				show={showAlert}
				hide={() => setShowAlert(false)}
				onConfirm={onConfirm}
			/>
			<TouchableWithoutFeedback onPress={onPress}>
				<View>
					<View style={styles.cradHeader}>
						<ProfilePicture
							getImage={post.getOwnerProfilePicture}
						/>
						<View style={styles.headerDetails}>
							<AppText
								style={styles.title}
								numberOfLines={2}
								weight="bold"
							>
								{post.title}
							</AppText>
							<AppText numberOfLines={1} style={styles.time}>
								{post.time}
							</AppText>
						</View>
						<View>
							<MaterialCommunityIcons
								name="chevron-left"
								color={defaultStyles.colors.light}
								size={40}
							/>
						</View>
					</View>

					<AppText
						color="black"
						style={styles.description}
						numberOfLines={4}
					>
						{post.description}
					</AppText>
					{post.image && (
						<View style={styles.imageContainer}>
							<Image
								style={styles.image}
								source={{ uri: post.image }}
							/>
						</View>
					)}

					{!post.location && (
						<View style={styles.fromHomeTextContainer}>
							<AppText style={styles.fromHomeText}>
								הפעילות היא מהבית
							</AppText>
						</View>
					)}
				</View>
			</TouchableWithoutFeedback>
			<View>
				{post.ownerId !== users.getCurrentUserId() &&
					categoriesYouCasAskForHelpIn.includes(post.category) && (
						<>
							<View
								style={{
									borderBottomColor: "black",
									borderBottomWidth: 1,
									marginTop: 6,
								}}
							/>
							<TouchableWithoutFeedback
								onPress={() => setShowAlert(true)}
							>
								<View style={styles.hand}>
									<FontAwesome
										name="hand-paper-o"
										size={40}
									/>
								</View>
							</TouchableWithoutFeedback>
						</>
					)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		borderRadius,
		marginBottom,
		overflow: "hidden",
		backgroundColor,
		elevation: 3,
		padding: cardPadding,
	},
	cradHeader: {
		flexDirection: isRTL ? "row" : "row-reverse",
		alignItems: "center",
		justifyContent: isRTL ? "flex-end" : "flex-start",
		marginBottom: 7,
		paddingVertical: 10,
		marginTop: -12,
	},
	headerDetails: isRTL
		? {
				flex: 1,
				marginLeft: 10,
		  }
		: {
				flex: 1,
				marginRight: 10,
		  },
	imageContainer: {
		marginBottom: 2,
		marginTop: 10,
	},
	image: {
		width: "100%",
		height: imageHeight,
		borderRadius: imageRadius,
	},
	description: {
		fontSize: textFontSize,
	},
	time: {
		fontSize: textTimeSize,
		color: defaultStyles.colors.dark,
		alignSelf: isRTL ? "flex-start" : "flex-end",
	},
	title: {
		fontSize: titleFontSize,
		color: defaultStyles.colors.black,
	},
	fromHomeTextContainer: {
		marginTop: 25,
	},
	fromHomeText: {
		color: colors.primary,
		alignSelf: "center",
	},
	hand: {
		marginTop: 9,
		alignItems: "center",
		justifyContent: "center",
	},
});
