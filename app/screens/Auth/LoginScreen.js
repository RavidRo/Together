import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import * as Yup from "yup";
import LottieView from "lottie-react-native";

import AppText from "../../components/AppText";
import { AppForm, AppFormField, SubmitButton } from "../../components/Form";
import Heading from "../../components/Heading";
import Screen from "../../components/Screen";
import defaultStyles from "../../config/defaultStyles";
import { login, isLoggedIn } from "../../Data/authentication";
import route from "../../navigation/route";
import { isRTL } from "expo-localization";

const loadingAnimation = require("../../assets/animations/loading.json");

const validationSchema = Yup.object().shape({});
const initialValues = {
	email: "",
	password: "",
};

export default function LoginScreen({ navigation }) {
	const [loading, setLoading] = useState(false);
	const onSubmit = (values) => {
		setLoading(true);
		login(values.email, values.password)
			.then(() => navigation.replace(route.APP))
			.catch(function (error) {
				setLoading(false);
				// Handle Errors here.
				console.log(error.code, error.message);
				alert(error.message);
			});
	};
	const continueIfLoggedIn = async () => {
		if (await isLoggedIn()) {
			navigation.replace(route.APP);
		}
	};
	useEffect(() => {
		continueIfLoggedIn();
	}, []);

	return (
		<Screen mainColor style={styles.container}>
			<Heading style={styles.heading} />
			{loading ? (
				<View style={styles.loadingAnimation}>
					<LottieView source={loadingAnimation} autoPlay loop />
				</View>
			) : (
				<>
					<View style={styles.loginForm}>
						<View style={{ marginTop: 20 }}>
							<AppForm
								validationSchema={validationSchema}
								initialValues={initialValues}
								onSubmit={(values) => onSubmit(values)}
							>
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
								<View style={{ marginTop: 30 }}>
									<SubmitButton>התחבר</SubmitButton>
								</View>
							</AppForm>
						</View>
					</View>
					<View style={styles.registerLinkContainer}>
						<AppText>לא רשום? </AppText>
						<TouchableWithoutFeedback
							onPress={() =>
								navigation.replace(route.REGISTER_SCREEN)
							}
						>
							<AppText weight="bold">הירשם כאן.</AppText>
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
	loadingAnimation: {
		flex: 1,
		width: "100%",
		top: -100,
	},
	heading: {
		marginTop: "15%",
		marginBottom: "8%",
	},
	loginForm: {
		width: "80%",
	},
	inputContainer: {
		marginBottom: 15,
	},
	loginBtn: {
		marginTop: 10,
		width: "100%",
		alignItems: "center",
		backgroundColor: defaultStyles.colors.white,
		padding: 10,
		justifyContent: "center",
		borderWidth: 1.5,
		borderColor: defaultStyles.colors.white,
	},
	registerLinkContainer: {
		marginTop: 10,
		flexDirection: isRTL ? "row" : "row-reverse",
	},
});
