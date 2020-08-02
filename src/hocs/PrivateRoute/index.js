import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuthState } from "../../context_hooks/AuthState";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { currentUser } = useAuthState();
  return (
    <Route
      {...rest}
      render={routeProps =>
        !!currentUser ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={"/login"} />
        )
      }
    />
  );
};


export default PrivateRoute