import React, { useState, useEffect } from "react";
import * as firebase from "firebase";
import { StyleSheet, View } from "react-native";
import { GiftedChat, Send } from "react-native-gifted-chat";
import { IconButton } from "react-native-paper";
import Screen from "../../components/Screen";
import "firebase/firestore";
import users from "../../Data/users";
export default function ChatScreen({ navigation, route: { params } }) {
	const db = firebase.firestore();
	const { thread } = params;
	const [messages, setMessages] = useState([]);
	useEffect(() => {
		const messagesListener = db
			.collection("THREADS")
			.doc(thread._id)
			.collection("MESSAGES")
			.orderBy("createdAt", "desc")
			.onSnapshot((querySnapshot) => {
				const messages = querySnapshot.docs.map((doc) => {
					const firebaseData = doc.data();

					const data = {
						_id: doc.id,
						text: "",
						createdAt: new Date().getTime(),
						...firebaseData,
					};

					if (!firebaseData.system) {
						data.user = {
							...firebaseData.user,
							name: firebaseData.user.name,
						};
					}

					return data;
				});
				setMessages(messages);
			});
		return () => messagesListener();
	}, []);

	function renderSend(props) {
		return (
			<Send {...props}>
				<View style={styles.sendingContainer}>
					<IconButton
						icon="send-circle"
						size={37}
						color="#69d5ba"
						style={styles.sendBtn}
					/>
				</View>
			</Send>
		);
	}

	function scrollToBottomComponent() {
		return (
			<View style={styles.bottomComponentContainer}>
				<IconButton
					icon="chevron-double-down"
					size={36}
					color="#69d5ba"
				/>
			</View>
		);
	}

	async function handleSend(messages) {
		const text = messages[0].text;

		db.collection("THREADS")
			.doc(thread._id)
			.collection("MESSAGES")
			.add({
				text,
				createdAt: new Date().getTime(),
				user: {
					_id: users.getCurrentUserId(),
					name: await users.getDisplayName(),
				},
			});

		await db
			.collection("THREADS")
			.doc(thread._id)
			.set(
				{
					latestMessage: {
						text,
						createdAt: new Date().getTime(),
					},
				},
				{ merge: true }
			);

		db.collection("THREADS")
			.doc(thread._id)
			.collection("MESSAGES")
			.orderBy("createdAt", "desc")
			.onSnapshot((querySnapshot) => {
				messages = querySnapshot.docs.map((doc) => {
					const firebaseData = doc.data();

					const data = {
						_id: doc.id,
						text: "",
						createdAt: new Date().getTime(),
						...firebaseData,
					};

					if (!firebaseData.system) {
						data.user = {
							...firebaseData.user,
							name: firebaseData.user.name,
						};
					}

					return data;
				});
				setMessages(messages);
			});
	}

	return (
		<Screen>
			<GiftedChat
				messages={messages}
				onSend={handleSend}
				user={{ _id: users.getCurrentUserId() }}
				placeholder="הקלד הודעה.."
				showUserAvatar
				alwaysShowSend
				renderSend={renderSend}
				scrollToBottomComponent={scrollToBottomComponent}
				//renderSystemMessage={renderSystemMessage}
			/>
		</Screen>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	sendBtn: {
		marginBottom: -5,
		transform: [{ rotateY: "180deg" }],
	},
	bottomComponentContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	systemMessageText: {
		fontSize: 14,
		color: "#fff",
		fontWeight: "bold",
	},
});
