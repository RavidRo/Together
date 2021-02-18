import * as firebase from "firebase";
import createResponseObject from "./api";
import { jsonDateToString } from "./date";

import users from "./users";

// Returns true in the user as registered succesfully and falsd if he is already registered
const registerToNewPost = async (
	postId,
	ownerId,
	uid = users.getCurrentUserId()
) => {
	if (await isRegistered(uid, postId)) {
		return false;
	}
	// Get a key for a registration.
	const newPostKey = firebase
		.database()
		.ref(`/user-posts/${ownerId}/${postId}/registrations`)
		.push().key;

	const data = {
		time: new Date(),
		postOwner: ownerId,
		registrationKey: newPostKey,
	};

	let updates = {};
	updates[
		`/user-posts/${ownerId}/${postId}/registrations/${newPostKey}`
	] = uid;
	updates[`/users/${uid}/registrations/${postId}`] = data;

	return firebase
		.database()
		.ref()
		.update(updates)
		.catch((error) => {
			console.log(
				`ERROR-userPosts/registerToNewPost()-error in registering to a post:\n${error}`
			);
			throw error;
		})
		.then(() => true);
};

const isRegistered = async (uid, postId) => {
	return (
		(
			await firebase
				.database()
				.ref(`/users/${uid}/registrations/${postId}`)
				.once("value")
		).val() != null
	);
};

async function getRegistrations(uid) {
	return firebase
		.database()
		.ref(`/users/${uid}/registrations`)
		.orderByChild("time")
		.once("value")
		.then(async (snapshot) => {
			const registraionsByTime = await snapshot.val();
			return registraionsByTime;
		})
		.catch((error) => {
			console.log(
				`ERROR-usersPosts/getRegistrations()-error while loading registrations:\n${error}`
			);
			throw error;
		});
}

async function getRegistration(uid, postId) {
	return firebase
		.database()
		.ref(`/users/${uid}`)
		.once("value")
		.then(async (snapshot) => {
			const user = await snapshot.val();
			return user?.registrations && user?.registrations[postId]
				? {
						displayName: user.displayName,
						postOwner: user.registrations[postId].postOwner,
						time: jsonDateToString(user.registrations[postId].time),
						profilePicture: user.profilePicture?.downloadURL,
						registrationKey:
							user.registrations[postId].registrationKey,
				  }
				: null;
		})
		.catch((error) => {
			console.log(
				`ERROR-usersPosts/getRegistration()-error while loading a registration:\n${error}`
			);
			throw error;
		});
}

async function getPostsRegistrations(ownerId, postId) {
	const snapshot = await firebase
		.database()
		.ref(`/user-posts/${ownerId}/${postId}/registrations`)
		.once("value")
		.catch((error) => {
			console.log(
				`ERROR-usersPosts/getPostsRegistrations()-error while loading posts's registrations:\n${error}`
			);
			throw error;
		});

	const postsRegistrations = await snapshot.val();
	if (!postsRegistrations) return createResponseObject([]);
	const registrations = await Promise.all(
		Object.values(postsRegistrations).map(async (userId) => {
			const registration = await getRegistration(userId, postId);
			if (!registration)
				throw Error(
					"ERROR-usersPosts/getPostsRegistrations()\n" +
						"Mismatch between post at user-post and users. " +
						postId +
						" registration was found at user-posts but not at users"
				);
			return registration;
		})
	);
	return createResponseObject(registrations);
}

async function incrementPostRegisteresAcomplishment(ownerId, postId) {
	const snapshot = await firebase
		.database()
		.ref(`/user-posts/${ownerId}/${postId}/registrations`)
		.once("value")
		.catch((error) => {
			console.log(
				`ERROR-usersPosts/incrementPostRegisteresAcomplishment()-error while loading posts's registrations:\n${error}`
			);
			throw error;
		});
	const postsRegistrations = await snapshot.val();
	Object.values(postsRegistrations).forEach((userId) => {
		users.acomplishmentsCountIncrement(userId);
	});
}

async function cancelRegistration(
	postId,
	ownerId,
	uid = users.getCurrentUserId()
) {
	const registrationKey = await firebase
		.database()
		.ref(`/users/${uid}/registrations/${postId}/registrationKey`)
		.once("value")
		.then((snapshot) => snapshot.val());
	const updates = {};
	updates[
		`/user-posts/${ownerId}/${postId}/registrations/${registrationKey}`
	] = null;
	updates[`/users/${uid}/registrations/${postId}`] = null;

	return firebase.database().ref().update(updates);
}

async function removeAllRegistrations(ownerID, postId) {
	const registrations = await firebase
		.database()
		.ref(`/user-posts/${ownerID}/${postId}/registrations`)
		.once("value")
		.then((snapshot) => snapshot.val());
	if (registrations) {
		const keys = Object.keys(registrations);
		keys.forEach((registrationKey) =>
			cancelRegistration(postId, ownerID, registrations[registrationKey])
		);
	}
}

export default {
	registerToNewPost,
	getRegistrations,
	cancelRegistration,
	removeAllRegistrations,
	getPostsRegistrations,
	incrementPostRegisteresAcomplishment,
};
