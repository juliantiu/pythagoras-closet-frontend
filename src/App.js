import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { AuthProvider } from './context_hooks/AuthState';
import Login from './components/Login';
import Console from './components/Console';

import PrivateRoute from './hocs/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/closet" component={Console}/>
          <PrivateRoute exact path="/dirtylaundry" component={Console}/>
          <PrivateRoute exact path="/washer" component={Console}/>
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
