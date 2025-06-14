
import React from 'react';
import { Navigate } from 'react-router-dom';

// Redirect old sign up route to new auth route
const SignUp = () => {
  return <Navigate to="/auth" replace />;
};

export default SignUp;
