import * as firebase from "firebase";

import firebaseConfig from "../config/firebaseConfig";
import { updateProfile } from "./users";

// Initialize Firebase
if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

export async function register(email, password, fullName) {
	try {
		const user = await firebase
			.auth()
			.createUserWithEmailAndPassword(email, password);
		await updateProfile(fullName, user.user);
		console.log("Register - Success");
	} catch (error) {
		console.log(error.code, error.message);
		alert(error.message);
		throw error;
	}
}

export async function login(email, password) {
	await firebase.auth().signInWithEmailAndPassword(email, password);
	console.log(`You are now logged in as with the email ${email}`);
}

export async function isLoggedIn() {
	return await firebase.auth().currentUser;
}
