
import React from 'react';
import { Navigate } from 'react-router-dom';

// Redirect old sign in route to new auth route
const SignIn = () => {
  return <Navigate to="/auth" replace />;
};

export default SignIn;
