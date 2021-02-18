import { useFormikContext } from "formik";
import React from "react";
import { View, StyleSheet } from "react-native";
import { CheckBox } from "react-native-elements";

import useLocation from "../../hooks/useLocation";
import LocationPicker from "../LocationPicker";
import ErrorMessage from "./ErrorMessage";

export default function FormLocationPicker({
	name,
	checkBoxText,
	fromHome,
	setFromHome,
	locationTemp,
	setLocationTemp,
}) {
	const {
		setFieldValue,
		setFieldTouched,
		errors,
		touched,
		values,
	} = useFormikContext();
	const currLocation = useLocation(); //Calculating my current locatiob beforhand because you can only use hooks here

	return (
		<>
			<View style={styles.fieldContainer}>
				<CheckBox
					title="הפעילות לא דורשת יציאה מהבית"
					checked={fromHome}
					onPress={() => {
						setFieldValue(name, fromHome ? locationTemp : null);
						setFromHome(!fromHome);
					}}
					containerStyle={styles.checkBoxContainer}
				/>
			</View>

			<View style={styles.fieldContainer}>
				<CheckBox
					title={checkBoxText}
					checked={!fromHome}
					onPress={() => {
						setFieldValue(name, fromHome ? locationTemp : null);
						setFromHome(!fromHome);
					}}
					containerStyle={styles.checkBoxContainer}
				/>
			</View>

			{!fromHome && (
				<>
					<LocationPicker
						onChangeText={(text) => {
							const newValue = {
								coordinates: values[name].coordinates,
								description: text === "" ? null : text,
							};
							setFieldValue(name, newValue);
							setLocationTemp(newValue);
						}}
						value={
							values[name]?.description
								? values[name].description
								: ""
						}
						defaultValue={
							values[name]?.description
								? values[name].description
								: ""
						}
						checked={values[name]?.coordinates ? true : false}
						onPress={() => {
							const newValue = {
								description: values[name]?.description,
								coordinates: !values[name]?.coordinates
									? currLocation
									: null,
							};
							setFieldValue(name, newValue);
							setLocationTemp(newValue);
						}}
						onBlur={() => setFieldTouched(name)}
					/>
					<ErrorMessage
						error={errors[name]}
						visible={touched[name]}
					/>
				</>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	fieldContainer: {
		marginBottom: 10,
	},
	checkBoxContainer: {
		backgroundColor: "transparent",
		borderWidth: 0,
		padding: 0,
	},
});
