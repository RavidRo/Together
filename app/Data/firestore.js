import "firebase/firestore";
import * as firebase from "firebase";
import users from "./users";

const db = firebase.firestore();

// Created a chat if it doesnt exists already and returns the chat document refrence
const createChat = async (otherId, onComplete = (ref) => {}) => {
	let chatExists = false;
	db.collection("THREADS").onSnapshot((querySnapshot) => {
		// Check if the chat exists
		querySnapshot.docs.forEach((documentSnapshot) => {
			if (
				(documentSnapshot.data().user1 === users.getCurrentUserId() &&
					documentSnapshot.data().user2 === otherId) ||
				(documentSnapshot.data().user2 === users.getCurrentUserId() &&
					documentSnapshot.data().user1 === otherId)
			) {
				chatExists = true;
				onComplete(documentSnapshot.ref);
			}
		});

		// Creates the chat if it doesnt exists
		if (!chatExists) {
			db.collection("THREADS")
				.add({
					user1: users.getCurrentUserId(),
					user2: otherId,
					latestMessage: {
						text: "",
					},
				})
				.then(onComplete);
		}
	});
};

export default {
	createChat,
};
