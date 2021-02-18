import React from "react";

export const navigationRef = React.createRef();

const navigate = (name, params) =>
	navigationRef.current?.navigation(name, params);

export default {
	navigate,
};
