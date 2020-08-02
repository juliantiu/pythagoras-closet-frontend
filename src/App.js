import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import { AuthProvider } from './context_hooks/AuthState';
import Login from './components/Login';

import PrivateRoute from './hocs/PrivateRoute';

function Test() {
  return (
    <h1>Hello There</h1>
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
