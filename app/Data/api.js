export default function createResponseObject(data, ok = true) {
	return {
		data,
		ok,
	};
}
