import React, { useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import AppText from "../components/AppText";

import MiniCard from "../components/MiniCard";
import Screen from "../components/Screen";
import colors from "../config/colors";
import { postsScreens } from "../config/enumes";
import texts from "../config/texts";
import posts from "../Data/posts";
import useAPI from "../hooks/useAPI";
import route from "../navigation/route";

const getPostFunction = (postsKind) =>
	postsKind === postsScreens.MY_POSTS
		? posts.getFilteredPostsByUid
		: postsKind === postsScreens.MY_REGISTRATIONS
		? posts.getUncompletedRegisteredPosts
		: posts.getCompletedRegisteredPosts;

export default function MyPostsScreen({
	route: {
		params: { postsKind },
	},
	navigation,
}) {
	const getMyPostsAPI = useAPI(getPostFunction(postsKind));
	const loadPosts = () => {
		getMyPostsAPI.request();
	};
	useEffect(() => {
		getMyPostsAPI.request();
	}, []);

	const emptyMessage =
		postsKind === postsScreens.MY_POSTS
			? texts.EMPTY_LISTS.MY_POSTS_SCREEN.MY_POSTS
			: postsKind === postsScreens.MY_REGISTRATIONS
			? texts.EMPTY_LISTS.MY_POSTS_SCREEN.MY_REGISTRATIONS
			: texts.EMPTY_LISTS.MY_POSTS_SCREEN.MY_ACOMPLISHMENTS;

	return (
		<Screen>
			<View style={styles.container}>
				<FlatList
					data={getMyPostsAPI.data}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<MiniCard
							post={item}
							postKind={postsKind}
							onPress={() =>
								navigation.navigate(route.POST_DETAILS_SCREEN, {
									post: item,
								})
							}
							reload={loadPosts}
						/>
					)}
					refreshing={getMyPostsAPI.loading}
					onRefresh={loadPosts}
					ListEmptyComponent={
						<AppText
							style={{
								color: colors.dark,
								textAlign: "center",
							}}
						>
							{emptyMessage}
						</AppText>
					}
				/>
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
		paddingHorizontal: 10,
	},
});
