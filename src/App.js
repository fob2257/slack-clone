import React, { useEffect } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { fireAuth, getUser } from './firebase/firebase.util';
import { setCurrentUser } from './redux/actions/userActions';

import Spinner from './components/common/Spinner';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './components/Home';
import Register from './components/Auth/Register';
import LogIn from './components/Auth/LogIn';

const App = ({ history, isLoading, setCurrentUser }) => {
  useEffect(() => {
    const unsubscribeFn = fireAuth.onAuthStateChanged(async user => {
      if (user) {
        const userData = await getUser(user);

        setCurrentUser(userData);
        return history.push('/');
      }

      setCurrentUser(null);
    });

    return () => {
      unsubscribeFn();
    };
  }, [history, setCurrentUser]);

  return isLoading ? (
    <Spinner />
  ) : (
    <React.Fragment>
      <Switch>
        <ProtectedRoute exact path="/" component={Home} />
        <Route path="/register" component={Register} />
        <Route path="/logIn" component={LogIn} />
      </Switch>
    </React.Fragment>
  );
};

const mapStateToProps = ({ user }) => ({
  isLoading: user.isLoading
});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
