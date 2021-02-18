import { View } from "native-base";
import React from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

import useLocation from "../hooks/useLocation";

const height = 200;
const delta = 0.003;

export default function AppMapView({ style, coordinates, title, owner }) {
	const location = useLocation();
	zoomAt = coordinates ? coordinates : location;
	return (
		<View style={style}>
			{location ? (
				<MapView
					style={styles.image}
					showsUserLocation={true}
					region={{
						...zoomAt,
						latitudeDelta: delta,
						longitudeDelta: delta,
					}}
				>
					{coordinates && (
						<Marker
							key="1"
							coordinate={coordinates}
							title={title}
							description={owner}
						/>
					)}
				</MapView>
			) : (
				<MapView style={styles.image} loadingEnabled={true} />
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	image: {
		width: "100%",
		height,
	},
});
