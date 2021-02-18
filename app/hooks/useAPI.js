import { useState } from "react";
import createResponseObject from "../Data/api";

export default useApi = (apiFunc) => {
	const [data, setData] = useState([]);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	const request = async (...args) => {
		setLoading(true);
		const response = await apiFunc(...args).catch((error) => {
			console.log(error);
			return createResponseObject(null, false);
		});
		setData(response.data);
		setError(!response.ok);
		setLoading(false);
		return response;
	};

	return { data, error, loading, request };
};
