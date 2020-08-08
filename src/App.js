import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import { AuthProvider } from './context_hooks/AuthState';
import Login from './components/Login';
import { useAuthState } from './context_hooks/AuthState';

import PrivateRoute from './hocs/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Button } from 'react-bootstrap'


function Test() {
  const { logout } = useAuthState();

  useEffect(
    () => {
      fetch('http://localhost:5000/api/clothes/1234', {
        method: 'GET', 
        mode: 'cors',
        cache: 'no-cache',
        credentials:'same-origin'
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch(error => {
        alert('Failed to get transaction history:', error);
      });
    },
    []
  );

  return (
    <>
      <h1>Hello There</h1>
      <Button onClick={logout}></Button>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <PrivateRoute exact path="/" component={Test} />
        <Route exact path="/login" component={Login} />
      </Router>
    </AuthProvider>
  );
}

export default App;
