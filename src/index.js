import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import * as serviceWorker from './serviceWorker';

import 'semantic-ui-css/semantic.min.css';

import { fireAuth, createUserDocument } from './firebase/firebase.util';

import ReduxProvider from './redux';
import { setCurrentUser } from './redux/actions/userActions';

import Spinner from './components/common/Spinner';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomePage from './components/App';
import Register from './components/Auth/Register';
import LogIn from './components/Auth/LogIn';

const App = ({ history, isLoading, setCurrentUser }) => {
  useEffect(() => {
    const unsubscribeFn = fireAuth.onAuthStateChanged(async user => {
      if (user) {
        const userRef = await createUserDocument(user);
        const userSnap = await userRef.get();

        setCurrentUser(userSnap.data());
        return history.push('/');
      }
      setCurrentUser(null);
    });

    return () => {
      unsubscribeFn();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLoading ? <Spinner /> : (
    <React.Fragment>
      <Switch>
        <ProtectedRoute exact path='/' component={HomePage} />
        <Route path='/register' component={Register} />
        <Route path='/logIn' component={LogIn} />
      </Switch>
    </React.Fragment>
  );
};

const mapStateToProps = ({ user }) => ({
  isLoading: user.isLoading,
});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user)),
});

const AppHOC = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

const Root = () => (
  <div className='root'>
    <ReduxProvider>
      <Router>
        <AppHOC />
      </Router>
    </ReduxProvider>
  </div>
);

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
