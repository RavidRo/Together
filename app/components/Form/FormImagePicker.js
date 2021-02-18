import React from "react";
import { useFormikContext } from "formik";

import ErrorMessage from "./ErrorMessage";
import ImageInput from "../ImageInput";

function FormImagePicker({ name }) {
	const { errors, setFieldValue, touched, values } = useFormikContext();
	const imageUri = values[name];

	return (
		<>
			<ImageInput
				imageUri={imageUri}
				onChangeImage={(uri) => setFieldValue(name, uri)}
			/>
			<ErrorMessage error={errors[name]} visible={touched[name]} />
		</>
	);
}

export default FormImagePicker;
