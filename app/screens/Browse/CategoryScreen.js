import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";

import Card from "../../components/Card";
import PostsSearch from "../../components/Post/PostsSearch";
import posts from "../../Data/posts";
import useAPI from "../../hooks/useAPI";
import defaultStyles from "../../config/defaultStyles";
import texts from "../../config/texts";
import AppText from "../../components/AppText";
import colors from "../../config/colors";

const paddingHorizontal = 10;

const offering = true;
const requiring = false;

export default function CategoryScreen({
	navigation,
	route: {
		params: { category },
	},
}) {
	const helpPostsAPI = useAPI(posts.searchPosts);
	const offerPostsAPI = useAPI(posts.searchPosts);
	const [offerRequire, setOfferRequire] = useState(requiring);
	const [refreshing, setRefreshing] = useState(true);

	const loadPosts = (text = "") => {
		if (offerRequire === offering) {
			helpPostsAPI.request(category, requiring, text);
		} else {
			offerPostsAPI.request(category, offering, text);
		}
	};

	useEffect(() => {
		helpPostsAPI
			.request(category, requiring)
			.then(() => setRefreshing(false));
		offerPostsAPI
			.request(category, offering)
			.then(() => setRefreshing(false));
	}, []);

	return (
		<>
			<View style={styles.container}>
				<PostsSearch
					onPressRequiring={() => setOfferRequire(requiring)}
					onPressOffering={() => setOfferRequire(offering)}
					onChangeText={loadPosts}
					category={category}
				/>

				<View style={styles.postsContainer}>
					<FlatList
						keyExtractor={(item) => item.id}
						data={
							offerRequire === offering
								? helpPostsAPI.data
								: offerPostsAPI.data
						}
						renderItem={({ item }) => (
							<Card
								post={item}
								onPress={() =>
									navigation.navigate("PostDetailsScreen", {
										post: item,
									})
								}
							/>
						)}
						refreshing={refreshing}
						onRefresh={loadPosts}
						ListEmptyComponent={
							<AppText
								style={{
									color: colors.dark,
									textAlign: "center",
								}}
							>
								{texts.EMPTY_LISTS.CATEGORY_SCREEN}
							</AppText>
						}
					/>
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal,
		flex: 1,
		backgroundColor: defaultStyles.colors.grey,
	},
	postsContainer: {
		paddingTop: 10,
		flex: 1,
		padding: 5,
	},
});
