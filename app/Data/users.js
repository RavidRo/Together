import * as firebase from "firebase";

import firebaseConfig from "../config/firebaseConfig";
import storage from "./storage";

// Initialize Firebase
if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

export async function updateProfile(
	displayName,
	user = firebase.auth().currentUser
) {
	if (user) {
		// Update the user dispayName at firebase authentication.
		await setDisplayName(displayName);

		// Add the user to the real time database
		await firebase
			.database()
			.ref(`users/${user.uid}`)
			.update({ email: user.email });
	} else {
		// You dont suppose to get here, if you do this is a bug
		console.log(
			"This is an error, you can't update the current user profile withought loging in first"
		);
		throw new Error("You need to log in before updaing your information");
	}
}

const setDisplayName = async (
	displayName,
	user = firebase.auth().currentUser
) => {
	user.updateProfile({
		displayName: displayName,
	});
	await firebase
		.database()
		.ref(`users/${user.uid}`)
		.update({ displayName: displayName });
};

async function updateProfilePicture(uri) {
	const oldUri = await getProfilePictureId();
	if (oldUri) {
		storage.deleteImageAsync(oldUri).then(() => console.log("Deleted :)"));
	}
	user = firebase.auth().currentUser;
	await firebase
		.database()
		.ref(`users/${user.uid}`)
		.update({ profilePicture: await storage.uploadImageAsync(uri) });
}
async function updateNotificationToken(token) {
	user = firebase.auth().currentUser;
	await firebase
		.database()
		.ref(`users/${user.uid}`)
		.update({ notificationToken: token });
}

export function getCurrentUserId() {
	return firebase.auth().currentUser.uid;
}

async function getNotificationToken(uid = getCurrentUserId()) {
	console.log(`Retrivieng notification token of ${uid}...`);
	const snapshot = await firebase
		.database()
		.ref(`/users/${uid}/notificationToken`)
		.once("value");
	return snapshot.val();
}

async function getAcomplishmentsCount(uid = getCurrentUserId()) {
	console.log(`Retrivieng acomplishments counts of ${uid}...`);
	const snapshot = await firebase
		.database()
		.ref(`/users/${uid}/acomplishmentsCount`)
		.once("value");
	const count = await snapshot.val();
	return count ? count : 0;
}

async function acomplishmentsCountIncrement(uid = getCurrentUserId()) {
	const oldCount = await getAcomplishmentsCount(uid);
	firebase
		.database()
		.ref(`/users/${uid}/acomplishmentsCount`)
		.set(oldCount + 1);
}

async function getDisplayName(uid = getCurrentUserId()) {
	console.log(`Retrivieng dispaly name of ${uid}...`);
	const snapshot = await firebase
		.database()
		.ref(`/users/${uid}/displayName`)
		.once("value");
	return snapshot.val();
}
function getCurrentUserDisplayName() {
	console.log(`Retrivieng my dispaly name...`);
	return firebase.auth().currentUser.displayName;
}

export async function getProfilePicture(uid = getCurrentUserId()) {
	console.log(`Retrivieng profile picture of ${uid}...`);
	const snapshot = await firebase
		.database()
		.ref(`/users/${uid}/profilePicture/downloadURL`)
		.once("value");
	return await snapshot.val();
}

async function deleteProfilePicture(uid = getCurrentUserId()) {
	storage.deleteImageAsync(await getProfilePictureId());
	const update = {};
	update[`/users/${uid}/profilePicture`] = null;

	await firebase.database().ref().update(update);
}

async function getProfilePictureId(uid = getCurrentUserId()) {
	const snapshot = await firebase
		.database()
		.ref(`/users/${uid}/profilePicture/imageId`)
		.once("value");
	return await snapshot.val();
}

export default {
	updateProfile,
	getCurrentUserId,
	getDisplayName,
	getProfilePicture,
	updateProfilePicture,
	updateNotificationToken,
	getNotificationToken,
	setDisplayName,
	deleteProfilePicture,
	getAcomplishmentsCount,
	acomplishmentsCountIncrement,
	getCurrentUserDisplayName,
};
