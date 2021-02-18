import React, { useState } from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import * as Yup from "yup";
import LottieView from "lottie-react-native";

import { AppForm, AppFormField, SubmitButton } from "../../components/Form";
import AppText from "../../components/AppText";
import Heading from "../../components/Heading";
import Screen from "../../components/Screen";
import { login, register } from "../../Data/authentication";
import route from "../../navigation/route";
import { isRTL } from "expo-localization";

function equalTo(ref, msg) {
	return this.test({
		name: "equalTo",
		exclusive: false,
		message: msg || "${path} must be the same as ${reference}",
		params: {
			reference: ref.path,
		},
		test: function (value) {
			return value === this.resolve(ref);
		},
	});
}

Yup.addMethod(Yup.string, "equalTo", equalTo);

const validationSchema = Yup.object().shape({
	fullName: Yup.string().required("יש לרשום שם ושם משפחה"),
	email: Yup.string().required("יש לרשום אימייל").email("אימייל לא תקין"),
	password: Yup.string()
		.required("יש לרשום סיסמה")
		.min(4, "סיסמה צריכה להכיל לפחות 4 תווים"),
	passwordVerify: Yup.string().equalTo(
		Yup.ref("password"),
		"הסיסמאות לא תואמות"
	),
});
const initialValues = {
	fullName: "",
	email: "",
	password: "",
	passwordVerify: "",
};

export default function RegisterScreen({ navigation }) {
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	const onSubmit = (values) => {
		setLoading(true);
		register(values.email, values.password, values.fullName).then(() => {
			login(values.email, values.password)
				.then(() => {
					setSuccess(true);
					setLoading(false);
					// Waiting for the success animation to end before proceding
					setTimeout(() => navigation.replace(route.APP), 2500);
				})
				.catch((error) => {
					alert(error);
					console.log(error);
				});
		});
	};

	return (
		<Screen mainColor style={styles.container}>
			<Heading style={styles.heading} />

			{/* The success animation when registered succesfully */}
			{success ? (
				<LottieView
					source={require("../../assets/animations/done.json")}
					autoPlay
					loop={false}
				/>
			) : loading ? (
				<LottieView
					source={require("../../assets/animations/loading.json")}
					autoPlay
					loop
				/>
			) : (
				<>
					<View style={styles.loginForm}>
						<AppForm
							validationSchema={validationSchema}
							initialValues={initialValues}
							onSubmit={(values) => onSubmit(values)}
						>
							<View style={styles.inputContainer}>
								<AppFormField
									autoCorrect={false}
									name="fullName"
									icon="account"
								>
									שם מלא
								</AppFormField>
							</View>
							<View style={styles.inputContainer}>
								<AppFormField
									autoCorrect={false}
									name="email"
									icon="email"
									keyboardType="email-address"
									textContentType="emailAddress"
								>
									אימייל
								</AppFormField>
							</View>
							<View style={styles.inputContainer}>
								<AppFormField
									autoCorrect={false}
									name="password"
									icon="lock"
									secureTextEntry
									textContentType="password"
								>
									סיסמה
								</AppFormField>
							</View>
							<View style={styles.inputContainer}>
								<AppFormField
									autoCorrect={false}
									name="passwordVerify"
									icon="check"
									secureTextEntry
									textContentType="password"
								>
									אישור סיסמה
								</AppFormField>
							</View>
							<SubmitButton>הרשם</SubmitButton>
						</AppForm>
					</View>
					<View style={styles.registerLinkContainer}>
						<AppText>כבר רשום? </AppText>
						<TouchableWithoutFeedback
							onPress={() =>
								navigation.replace(route.LOGIN_SCREEN)
							}
						>
							<AppText weight="bold">התחבר כאן.</AppText>
						</TouchableWithoutFeedback>
					</View>
				</>
			)}
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
	},
	heading: {
		marginTop: "15%",
		marginBottom: "8%",
	},
	loginForm: {
		width: "80%",
	},
	inputContainer: {
		marginBottom: 13,
	},
	registerLinkContainer: {
		marginTop: 25,
		flexDirection: isRTL ? "row" : "row-reverse",
	},
});
