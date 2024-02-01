import LoginForm from "@/components/auth/login-form";
import React from "react";

const AuthLogin = () => {
  return (
    <div className="space-y-10">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Login with your credentials</h1>
        <p className="text-sm text-muted-foreground">Enter your email below to access worksheets</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default AuthLogin;
