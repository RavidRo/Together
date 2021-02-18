import * as firebase from "firebase";

import firebaseConfig from "../config/firebaseConfig";
import createResponseObject from "./api";
import { jsonDateToString } from "./date";
import storage from "./storage";
import users from "./users";
import usersPosts from "./usersPosts";

// Initialize Firebase
if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

// Enumerations
export const categories = {
	VOLUNTEERING: "volunteer",
	TEACHING: "teaching",
	THROWN_ITEMS: "thrown_items",
	FOOD: "food",

	volunteer: "עזרה לחבר",
	teaching: "ללמוד ביחד",
	thrown_items: "להשאיר בחוץ",
	food: "אוכל",
};
export const categoriesYouCasAskForHelpIn = [
	categories.TEACHING,
	categories.VOLUNTEERING,
	categories.FOOD,
];

const createPost = (id, apiPost) => ({
	id: id,
	category: apiPost.category,
	requireHelp: apiPost.requireHelp,
	completed: apiPost.completed ? apiPost.completed : false,
	title: apiPost.title,
	description: apiPost.description,
	image: apiPost.image?.downloadURL,
	time: jsonDateToString(apiPost.time),
	location: apiPost.location,
	ownerId: apiPost.uid,
	getOwnerDisplayName: async () => await users.getDisplayName(apiPost.uid),
	getOwnerProfilePicture: async () =>
		await users.getProfilePicture(apiPost.uid),
});

async function storePost(data, category, requireHelp) {
	// Setting the object to save
	uid = users.getCurrentUserId();
	const defaultAttributes = {
		uid: uid,
		category,
		requireHelp,
		time: new Date(),
		...data,
	};

	// Uploading the image to firebase storage if there is an image
	try {
		const postData = data.image
			? {
					...defaultAttributes,
					image: await storage.uploadImageAsync(data.image),
			  }
			: defaultAttributes;

		// Get a key for a new Post.
		const newPostKey = firebase
			.database()
			.ref(`posts/${category}/${requireHelp}`)
			.push().key;

		// Write the new post's data simultaneously in the posts list and the user's post list.
		let updates = {};
		updates[`/posts/${category}/${requireHelp}/${newPostKey}`] = postData;
		updates[`/user-posts/${uid}/${newPostKey}`] = postData;

		return firebase
			.database()
			.ref()
			.update(updates)
			.then(() => createResponseObject(createPost(newPostKey, postData)))
			.catch((error) => {
				console.log(
					`ERROR-posts/storePost()-error in storing the post:\n${error}`
				);
				return createResponseObject(null, false);
			});
	} catch (error) {
		console.log(
			`ERROR-posts/storePost()-error while uploading image:\n${error}`
		);
		return createResponseObject(null, false);
	}
}

async function getPosts(category, requireHelpPosts, filter = null) {
	console.log("Retrivieng posts...");
	return firebase
		.database()
		.ref(`/posts/${category}/${requireHelpPosts}`)
		.orderByChild("time")
		.once("value")
		.then(async (snapshot) => {
			const dataPosts = await snapshot.val();
			const postsKeys = dataPosts ? Object.keys(dataPosts).reverse() : [];
			const posts = postsKeys.map((postKey) =>
				createPost(postKey, dataPosts[postKey])
			);
			return createResponseObject(posts.filter(filter || (() => true)));
		})
		.catch((error) => {
			console.log(
				`ERROR-posts/getPosts()-error while loading posts:\n${error}`
			);
			return createResponseObject([], false);
		});
}

async function getPost(category, requireHelpPosts, postID) {
	console.log(`Retrivieng post ${postID}...`);
	return firebase
		.database()
		.ref(`/posts/${category}/${requireHelpPosts}/${postID}`)
		.once("value")
		.then(async (snapshot) => {
			const post = await snapshot.val();
			return createResponseObject(createPost(postID, post));
		})
		.catch((error) => {
			console.log(
				`ERROR-posts/getPost()-error while loading post ${postID}:\n${error}`
			);
			return createResponseObject({}, false);
		});
}

async function getPostByOwner(ownerID, postID) {
	console.log(`Retrivieng post ${postID}...`);
	return firebase
		.database()
		.ref(`/user-posts/${ownerID}/${postID}`)
		.once("value")
		.then(async (snapshot) => {
			const post = await snapshot.val();
			return createResponseObject(createPost(postID, post));
		})
		.catch((error) => {
			console.log(
				`ERROR-posts/getPostByOwner()-error while loading post ${postID}:\n${error}`
			);
			return createResponseObject({}, false);
		});
}

async function searchPostsBy(
	category,
	requireHelpPosts,
	searchStr,
	searchBy,
	filter = null
) {
	return firebase
		.database()
		.ref(`/posts/${category}/${requireHelpPosts}`)
		.orderByChild(searchBy)
		.startAt(searchStr)
		.endAt(searchStr + "\uf8ff")
		.once("value")
		.then(async (snapshot) => {
			const dataPosts = await snapshot.val();
			const postsKeys = dataPosts ? Object.keys(dataPosts).reverse() : [];
			const posts = postsKeys.map((postKey) =>
				createPost(postKey, dataPosts[postKey])
			);
			return createResponseObject(posts.filter(filter || (() => true)));
		})
		.catch((error) => {
			console.log(
				`ERROR-posts/searchPostsBy()-error while loading posts:\n${error}`
			);
			return createResponseObject([], false);
		});
}

// Gets posts which their title or description starts with searchStr
// For full text text search you should use Elastic Search or Firebase Store with Algolia implementation
// https://firebase.google.com/docs/firestore/solutions/search
async function searchPosts(category, requireHelpPosts, searchStr = "") {
	console.log(`Retrivieng posts with keyword ${searchStr}...`);
	// get only posts wich were not completed
	const filter = (post) => !post.completed;
	return !searchStr
		? getPosts(category, requireHelpPosts, filter)
		: // searching by title
		  searchPostsBy(
				category,
				requireHelpPosts,
				searchStr,
				"title",
				filter
		  ).then((response) =>
				response.ok
					? // searching by description
					  searchPostsBy(
							category,
							requireHelpPosts,
							searchStr,
							"description",
							filter
					  ).then((secondResponse) => {
							//   Combining
							const data = [
								...response.data,
								...secondResponse.data,
							];
							// Removing duplicates
							const nonDupliacatesData = data.filter(
								(item, index) =>
									index ==
									data.findIndex(
										(found) => found.id === item.id
									)
							);
							return response.ok
								? createResponseObject(nonDupliacatesData)
								: secondResponse;
					  })
					: response
		  );
}

async function getFilteredPostsByUid(
	uid = users.getCurrentUserId(),
	predicate = (_) => (_) => true
) {
	console.log(`Retrivieng ${uid}'s posts...`);
	return firebase
		.database()
		.ref(`/user-posts/${uid}`)
		.orderByChild("time")
		.once("value")
		.then(async (snapshot) => {
			const dataPosts = await snapshot.val();
			const postsKeys = dataPosts ? Object.keys(dataPosts).reverse() : [];

			const filteredPostKeys = postsKeys.filter(predicate(dataPosts));
			const posts = filteredPostKeys.map((postKey) =>
				createPost(postKey, dataPosts[postKey])
			);

			return createResponseObject(posts);
		})
		.catch((error) => {
			console.log(
				`ERROR-posts/getFilteredPostsByUid()-error while loading posts:\n${error}`
			);
			return createResponseObject([], false);
		});
}

async function getUncompletedPostsByUid(uid = users.getCurrentUserId()) {
	return getFilteredPostsByUid(uid, (dataPosts) => (postKey) =>
		dataPosts[postKey].completed !== true
	);
}

async function getCompletedPostsByUid(uid = users.getCurrentUserId()) {
	return getFilteredPostsByUid(uid, (dataPosts) => (postKey) =>
		dataPosts[postKey].completed === true
	);
}

async function getFilteredRegisteredPosts(
	uid = users.getCurrentUserId(),
	predicate = (_) => true
) {
	console.log(`Retrivieng ${uid}'s filtered registration posts...`);
	const registrationsByTime = await usersPosts.getRegistrations(uid);
	const postsIds = registrationsByTime
		? Object.keys(registrationsByTime).reverse()
		: [];

	const posts = [];
	const ownersPromises = [];
	postsIds.forEach((postId) => {
		ownersPromises.push(
			getPostByOwner(registrationsByTime[postId].postOwner, postId).then(
				(response) => {
					if (response.ok) {
						if (predicate(response.data)) {
							posts.push(response.data);
						}
					} else {
						console.log(
							"ERROR posts/getFilteredRegisteredPosts() - Got a failed response object"
						);
					}
				}
			)
		);
	});
	await Promise.all(ownersPromises);
	return createResponseObject(posts);
}

async function getUncompletedRegisteredPosts(uid = users.getCurrentUserId()) {
	return getFilteredRegisteredPosts(uid, (post) => post.completed !== true);
}
async function getCompletedRegisteredPosts(uid = users.getCurrentUserId()) {
	return getFilteredRegisteredPosts(uid, (post) => post.completed === true);
}

async function setPostAsCompleted(category, requireHelpPosts, postId, ownerID) {
	// Incrementing registeres acomplishment
	usersPosts.incrementPostRegisteresAcomplishment(ownerID, postId);
	let updates = {};
	updates[
		`/posts/${category}/${requireHelpPosts}/${postId}/completed`
	] = true;
	updates[`/user-posts/${ownerID}/${postId}/completed`] = true;
	await firebase.database().ref().update(updates);
}

async function getPostImageId(category, requireHelpPosts, postId) {
	return await firebase
		.database()
		.ref(`/posts/${category}/${requireHelpPosts}/${postId}/image/imageId`)
		.once("value")
		.then((snapshot) => snapshot.val());
}

async function deletePost(category, requireHelpPosts, postId, ownerID) {
	const postImageId = await getPostImageId(
		category,
		requireHelpPosts,
		postId
	);
	if (postImageId) {
		storage.deleteImageAsync(postImageId);
	}
	usersPosts.removeAllRegistrations(ownerID, postId);
	let updates = {};
	updates[`/posts/${category}/${requireHelpPosts}/${postId}`] = null;
	updates[`/user-posts/${ownerID}/${postId}`] = null;
	await firebase.database().ref().update(updates);
}

export default {
	getPost,
	getPosts,
	storePost,
	searchPosts,
	getUncompletedPostsByUid,
	getUncompletedRegisteredPosts,
	getCompletedRegisteredPosts,
	setPostAsCompleted,
	getCompletedPostsByUid,
	getFilteredPostsByUid,
	deletePost,
};
