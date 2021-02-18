import React, { useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	Image,
	ScrollView,
	TouchableWithoutFeedback,
} from "react-native";
import { FontAwesome, Entypo } from "@expo/vector-icons";

import AppText from "../../components/AppText";
import Screen from "../../components/Screen";
import defaultStyles from "../../config/defaultStyles";
import PostHeader from "../../components/Post/PostHeader";
import { categoriesYouCasAskForHelpIn } from "../../Data/posts";
import AppMapView from "../../components/AppMapView";
import usersPosts from "../../Data/usersPosts";
import colors from "../../config/colors";
import users from "../../Data/users";
import useAPI from "../../hooks/useAPI";
import ConfirmAlert from "../../components/ConfirmAlert";
import texts from "../../config/texts";
import firestore from "../../Data/firestore";
import route from "../../navigation/route";

const containerPaddingHorizontal = 14;
const containerPaddingTop = "2%";
const imageHeight = 200;

export default function PostDetailsScreen({
	route: {
		params: { post },
	},
	navigation,
}) {
	const [showAlert, setShowAlert] = useState(false);
	const getRegistrationsAPI = useAPI(usersPosts.getPostsRegistrations);
	const myPost = post.ownerId === users.getCurrentUserId();
	useEffect(() => {
		if (myPost) {
			getRegistrationsAPI
				.request(post.ownerId, post.id)
				.catch(console.error);
		}
	}, []);

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
		<Screen style={styles.container}>
			<ConfirmAlert
				{...texts.ALERTS.POST_REGISTRATION}
				show={showAlert}
				hide={() => setShowAlert(false)}
				onConfirm={onConfirm}
			/>
			<ScrollView>
				<View style={styles.postContainer}>
					<PostHeader
						title={post.title}
						getDisplayName={post.getOwnerDisplayName}
						getProfilePicture={post.getOwnerProfilePicture}
						time={post.time}
					/>
					{post.image && (
						<Image
							source={post.image && { uri: post.image }}
							style={styles.image}
						/>
					)}
					<View style={styles.postDetails}>
						<AppText style={styles.text}>
							{post.description}
						</AppText>
						<View style={styles.locationContainer}>
							{post.location ? (
								<>
									{post.location.coordinates && (
										<AppMapView
											style={styles.map}
											coordinates={
												post.location.coordinates
											}
											title={post.title}
											owner={post.ownerDisplayName}
										/>
									)}
									{post.location.description && (
										<AppText style={styles.text}>
											{post.location.description}
										</AppText>
									)}
								</>
							) : (
								<AppText
									style={{
										color: colors.primary,
										alignSelf: "center",
									}}
								>
									הפעילות היא מהבית
								</AppText>
							)}
						</View>
					</View>

					{myPost &&
					categoriesYouCasAskForHelpIn.includes(post.category) ? (
						<>
							<View style={styles.myRegisteresContainer}>
								<AppText
									weight="bold"
									style={{ color: "black" }}
								>
									רשומים לפוסט שלי
								</AppText>
							</View>
							<View
								style={{
									borderBottomColor: "black",
									borderBottomWidth: 1,
									marginTop: 13,
								}}
							/>
							{getRegistrationsAPI.loading ? (
								<AppText style={{ color: "black" }}>
									טוען...
								</AppText>
							) : getRegistrationsAPI.error ? (
								<AppText style={{ color: "black" }}>
									נתקלנו בבעיה בעת טעינת הרשומים
								</AppText>
							) : getRegistrationsAPI.data.length === 0 ? (
								<AppText style={{ color: "black" }}>
									אין כרגע רשומים
								</AppText>
							) : (
								getRegistrationsAPI.data.map((registration) => (
									<PostHeader
										key={registration.registrationKey}
										displayName={registration.displayName}
										profilePictureUri={
											registration.profilePicture
										}
										time={registration.time}
									/>
								))
							)}
						</>
					) : (
						!myPost && (
							<>
								<View
									style={{
										borderBottomColor: "black",
										borderBottomWidth: 1,
										marginTop: 13,
									}}
								/>
								<View style={styles.buttonsContainer}>
									{categoriesYouCasAskForHelpIn.includes(
										post.category
									) && (
										<TouchableWithoutFeedback
											onPress={() => setShowAlert(true)}
										>
											<View style={styles.sendMessage}>
												<FontAwesome
													name="hand-paper-o"
													size={33}
												/>
												<AppText color="black">
													{post.requireHelp
														? "בקש יד"
														: "שלח יד"}
												</AppText>
											</View>
										</TouchableWithoutFeedback>
									)}
									<TouchableWithoutFeedback
										onPress={sendMessage}
									>
										<View style={styles.sendMessage}>
											<Entypo
												name="message"
												size={35}
												color="black"
											/>
											<AppText color="black">
												שלח הודעה
											</AppText>
										</View>
									</TouchableWithoutFeedback>
								</View>
							</>
						)
					)}
				</View>
			</ScrollView>
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: containerPaddingHorizontal,
		paddingTop: containerPaddingTop,
	},
	postContainer: {
		backgroundColor: defaultStyles.colors.white,
		borderRadius: 10,
		paddingVertical: 10,
		paddingHorizontal: 16,
		paddingBottom: 30,
	},
	postDetails: {
		paddingTop: 6,
	},
	image: {
		width: "100%",
		height: imageHeight,
	},
	text: {
		fontSize: 20,
		color: colors.black,
	},
	locationContainer: {
		marginTop: 50,
	},
	buttonsContainer: {
		marginVertical: 5,
		flexDirection: "row",
		justifyContent: "space-around",
	},
	button: {
		width: "40%",
		height: 100,
	},
	map: {
		overflow: "hidden",
		borderRadius: 15,
	},
	sendMessage: {
		justifyContent: "center",
		alignItems: "center",
	},
	myRegisteresContainer: {
		marginTop: 40,
	},
});
