import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const ProtectedRoute = ({ component: Component, currentUser, ...rest }) => (
  <Route
    render={props =>
      !currentUser ? <Redirect to="/logIn" /> : <Component {...props} />
    }
    {...rest}
  />
);

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
});

export default connect(mapStateToProps)(ProtectedRoute);
