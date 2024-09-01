import React, { useState } from "react";
import Login from "@/components/LoginComponent";
import Registration from "@/components/RegistrationComponent";

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-container">
      {isLogin ? (
        <Login onSwitch={toggleAuthMode} />
      ) : (
        <Registration onSwitch={toggleAuthMode} />
      )}
    </div>
  );
};

export default AuthScreen;
