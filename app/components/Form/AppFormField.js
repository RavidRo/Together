import { useFormikContext } from "formik";
import React from "react";

import AppTextInput from "../AppTextInput";
import ErrorMessage from "./ErrorMessage";

export default function AppFormField({ name, children, ...otherProps }) {
	const {
		setFieldTouched,
		setFieldValue,
		errors,
		touched,
		values,
	} = useFormikContext();

	return (
		<>
			<AppTextInput
				onChangeText={(text) => setFieldValue(name, text)}
				value={values[name]}
				onBlur={() => setFieldTouched(name)}
				{...otherProps}
			>
				{children}
			</AppTextInput>
			<ErrorMessage error={errors[name]} visible={touched[name]} />
		</>
	);
}
