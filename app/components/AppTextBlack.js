import { useFonts } from "expo-font";
import React from "react";
import { Text } from "react-native";

import defaultStyles from "../config/defultBlack";
import fonts from "../config/fonts";

export default function AppTextBlack({
  children,
  style,
  weight = "regular",
  ...otherProps
}) {
  const [fontsLoaded] = useFonts(fonts.fontsDict);

  return (
    <Text
      style={[
        defaultStyles.text,
        {
          fontFamily: fontsLoaded ? fonts.getOpenSansFamily(weight) : null
        },
        style
      ]}
      {...otherProps}
    >
      {children}
    </Text>
  );
}
