import React, { useCallback, useState } from 'react';
import { withRouter, Redirect } from "react-router";
import { useAuthState } from '../../context_hooks/AuthState'
import app from "../../firebase";

const Login = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const { currentUser } = useAuthState();

  const handleLogin = useCallback(
    async () => {
      try {
        await app
          .auth()
          .signInWithEmailAndPassword(email, password);
        setInvalid(false);
        history.push('/');
      } catch (error) {
        setInvalid(true);
        throw error;
      }
    },
    [history, email, password, setInvalid]
  );

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <h1>Hello World</h1>
  )
}

export default withRouter(Login);
