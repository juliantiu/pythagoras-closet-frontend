import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import { AuthProvider } from './context_hooks/AuthState';
import Login from './components/Login';
import Home from './components/Console';

import PrivateRoute from './hocs/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <PrivateRoute exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
      </Router>
    </AuthProvider>
  );
}

export default App;
