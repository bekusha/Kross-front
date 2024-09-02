import React, { useState } from "react";
import Login from "@/components/LoginComponent";
import Registration from "@/components/RegistrationComponent";
import { Text, View } from "react-native";

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <View>
      <Text>
        თუ გინდათ ისარგებლოთ აპლიკაციის დამატებითი ფუნქციონალით, გთხოვთ შეხვიდეთ
        სისტემაში ან გაიარეთ რეგისტრაცია.
      </Text>
      {isLogin ? (
        <Login onSwitch={toggleAuthMode} />
      ) : (
        <Registration onSwitch={toggleAuthMode} />
      )}
    </View>
  );
};

export default AuthScreen;
