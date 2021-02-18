import * as firebase from "firebase";
import uuid from "uuid";
import "firebase/firestore";

import firebaseConfig from "../config/firebaseConfig";

const imagePath = "images";

// Initialize Firebase
if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

async function uploadImageAsync(uri) {
	console.log("Uploading image", uri);
	// Why are we using XMLHttpRequest? See:
	// https://github.com/expo/expo/issues/2402#issuecomment-443726662
	const blob = await new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.onload = function () {
			resolve(xhr.response);
		};
		xhr.onerror = function (e) {
			console.log(e);
			reject(new TypeError("Network request failed"));
		};
		xhr.responseType = "blob";
		xhr.open("GET", uri, true);
		xhr.send(null);
	});
	const imageId = uuid.v4();
	const ref = firebase.storage().ref().child(`${imagePath}/${imageId}`);
	const snapshot = await ref.put(blob);

	// We're done with the blob, close and release it
	blob.close();

	return { downloadURL: await snapshot.ref.getDownloadURL(), imageId };
}

async function deleteImageAsync(uri) {
	// Create a reference to the file to delete
	const ref = firebase.storage().ref().child(`${imagePath}/${uri}`);

	// Delete the file
	ref.delete().catch(function (error) {
		console.log("ERROR-storage/deleteImageAsync()", error);
		throw error;
	});
}

export default {
	deleteImageAsync,
	uploadImageAsync,
};
