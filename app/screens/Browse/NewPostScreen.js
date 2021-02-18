import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import * as Yup from "yup";

import CategoryHeading from "../../navigation/CategoryHeading";
import { AppForm, AppFormField, SubmitButton } from "../../components/Form";
import Screen from "../../components/Screen";
import FormImagePicker from "../../components/Form/FormImagePicker";
import FormLocationPicker from "../../components/Form/FormLocationPicker";
import posts, {
	categories,
	categoriesYouCasAskForHelpIn,
} from "../../Data/posts";
import useAPI from "../../hooks/useAPI";
import defaultStyles from "../../config/defaultStyles";
import ButtonSwitch from "../../components/ButtonSwitch";
import CategoryPicker from "../../components/CategoryPicker";
import LoadingScreen from "../LoadingScreen";
import texts from "../../config/texts";
import ConfirmAlert from "../../components/ConfirmAlert";
import route from "../../navigation/route";

const paddingHorizontal = 10;

const offering = true;
const requiring = false;

const defaultCategory = categories.VOLUNTEERING;

export default function NewPostScreen({ navigation }) {
	const [locationTemp, setLocationTemp] = useState({
		description: null,
		coordinates: null,
	}); //Saving the values when fromHome
	const [fromHome, setFromHome] = useState(true);
	const [category, setCategory] = useState(defaultCategory);
	const [requireHelpPost, setRequireHelpPost] = useState(offering);
	const [animationVisable, setAnimationVisable] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	// useState() sets the state to the return value of the function
	const [onConfirm, setOnConfirm] = useState(() => () => {});

	function locationValid(msg) {
		return this.test({
			name: "locationValid",
			exclusive: false,
			message: msg || "יש לתאר מיקום או להוסיף מיקום נוכחי",
			params: {},
			test: (value) =>
				value === null ||
				(value.description && value.description != "") ||
				value.coordinates,
		});
	}

	Yup.addMethod(Yup.object, "locationValid", locationValid);

	const validationSchema = Yup.object().shape({
		title: Yup.string().required("יש לכתוב כותרת"),
		description: Yup.string().required("יש להוסיף הסבר"),
		location: Yup.object().nullable().locationValid(),
	});

	const initialValues = {
		title: "",
		description: "",
		location: fromHome ? null : { description: null, coordinates: null },
		image: null,
	};

	const storePostApi = useAPI(posts.storePost);

	const onSubmit = (values, { resetForm }) => {
		setOnConfirm(() => () => {
			setAnimationVisable(true);
			storePostApi
				.request(values, category, requireHelpPost)
				.then((response) => {
					if (!storePostApi.error) {
						resetForm();
						setFromHome(true);
						setLocationTemp({
							description: null,
							coordinates: null,
						});
						navigation.navigate(route.BROWSE, {
							screen: route.POST_DETAILS_SCREEN,
							params: {
								post: response.data,
							},
						});
					} else {
						setAnimationVisable(false);
						alert("נתקלנו בבעיה בעת העלאת הפוסט");
					}
				});
		});
		setShowAlert(true);
	};

	return (
		<Screen style={styles.container}>
			<ConfirmAlert
				{...texts.ALERTS.NEW_POST_ALERT}
				show={showAlert}
				hide={() => setShowAlert(false)}
				onConfirm={onConfirm}
			/>
			<CategoryHeading>יצירת פוסט חדש</CategoryHeading>
			<LoadingScreen
				visible={animationVisable}
				loading={storePostApi.loading}
				onDone={() => {
					setAnimationVisable(false);
				}}
			/>
			<ScrollView>
				<View style={styles.formContainer}>
					<AppForm
						onSubmit={onSubmit}
						initialValues={initialValues}
						validationSchema={validationSchema}
					>
						<CategoryPicker
							defaultCategory={defaultCategory}
							setCategory={setCategory}
						/>

						{categoriesYouCasAskForHelpIn.includes(category) && (
							<ButtonSwitch
								left={texts.POSTS_PROPERTIES.WANT_TO_HELP}
								right={texts.POSTS_PROPERTIES.SEAKING_HELP}
								onPressLeft={() => setRequireHelpPost(offering)}
								onPressRight={() =>
									setRequireHelpPost(requiring)
								}
								style={styles.buttonSwtich}
							/>
						)}
						<View style={styles.fieldContainer}>
							<AppFormField radius={10} name="title">
								כותרת
							</AppFormField>
						</View>
						<View style={styles.fieldContainer}>
							<AppFormField
								radius={10}
								name="description"
								multiline
								textAlignVertical="top"
								numberOfLines={2}
							>
								תאור התרומה
							</AppFormField>
						</View>
						<FormLocationPicker
							name="location"
							checkBoxText={"אני רוצה להוסיף מיקום"}
							fromHome={fromHome}
							setFromHome={setFromHome}
							locationTemp={locationTemp}
							setLocationTemp={setLocationTemp}
						/>
						<FormImagePicker name="image" />
						<SubmitButton>יצירת פוסט</SubmitButton>
					</AppForm>
				</View>
			</ScrollView>
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal,
	},
	formContainer: {
		paddingHorizontal: 5,
		paddingBottom: 70,
	},
	fieldContainer: {
		marginBottom: 10,
	},
	circle: {
		borderRadius: 150,
		height: 80,
		width: 80,
		backgroundColor: defaultStyles.colors.primary,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonSwtich: { marginTop: 10, marginBottom: 20 },
	catagoryText: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		marginTop: -7,
		marginBottom: 4,
		marginLeft: 3,
	},
});
