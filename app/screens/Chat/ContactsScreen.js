import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Divider } from "react-native-paper";
import * as firebase from "firebase";
import "firebase/firestore";
import users from "../../Data/users";
import ChatBox from "../../components/ChatBox";
import AppText from "../../components/AppText";
import texts from "../../config/texts";
import colors from "../../config/colors";

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

export default function ContactScreen({ navigation }) {
	const [threads, setThreads] = useState([]);
	const [loading, setLoading] = useState(true);

	const id = users.getCurrentUserId();

	useEffect(() => {
		const unsubscribe = db
			.collection("THREADS")
			.onSnapshot((querySnapshot) => {
				const threads = querySnapshot.docs
					.filter(
						(thread) =>
							id === thread.data().user1 ||
							id === thread.data().user2
					)
					.map((documentSnapshot) => {
						return {
							_id: documentSnapshot.id,
							nameId:
								documentSnapshot.data().user1 === id
									? documentSnapshot.data().user2
									: documentSnapshot.data().user1,
							latestMessage: {
								text: "",
							},
							...documentSnapshot.data(),
						};
					});

				setThreads(threads);

				if (loading) {
					setLoading(false);
				}
			});

		/**
		 * unsubscribe listener
		 */
		return () => unsubscribe();
	}, []);

	/*if (loading) {
    return <Loading />;
  }*/

	return (
		<View style={styles.container}>
			<FlatList
				data={threads}
				keyExtractor={(item) => item._id}
				ItemSeparatorComponent={() => <Divider />}
				renderItem={({ item }) => (
					<ChatBox
						nameId={item.nameId}
						navigation={navigation}
						item={item}
					/>
				)}
				ListEmptyComponent={
					<AppText
						style={{
							color: colors.dark,
							textAlign: "center",
							marginTop: 90,
						}}
					>
						{texts.EMPTY_LISTS.CONTACTS_SCREEN}
					</AppText>
				}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#f5f5f5",
		flex: 1,
	},
	listTitle: {
		fontSize: 22,
	},
	listDescription: {
		fontSize: 16,
	},
});
