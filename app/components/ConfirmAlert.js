import React from "react";
import { StyleSheet } from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";

import colors from "../config/colors";

export default function ConfirmAlert({
	title,
	message,
	cancelText,
	confirmText,
	show,
	hide,
	onConfirm,
}) {
	return (
		<AwesomeAlert
			show={show}
			showProgress={false}
			title={title}
			message={message}
			closeOnTouchOutside={true}
			closeOnHardwareBackPress={false}
			showCancelButton={true}
			showConfirmButton={true}
			cancelText={cancelText}
			confirmText={confirmText}
			confirmButtonColor={colors.primary}
			onCancelPressed={hide}
			onConfirmPressed={() => {
				hide();
				onConfirm();
			}}
			messageStyle={styles.message}
		/>
	);
}

const styles = StyleSheet.create({
	message: {
		fontSize: 16,
	},
});
