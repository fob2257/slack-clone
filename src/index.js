import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';

import * as serviceWorker from './serviceWorker';

import 'semantic-ui-css/semantic.min.css';

import { getCurrentUser } from './firebase/firebase.util';

import HomePage from './components/App';
import Register from './components/Register';
import LogIn from './components/LogIn';

const App = ({ history }) => {
  useEffect(() => {
    getCurrentUser()
      .then(user => (user) ? history.push('/') : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route path='/register' component={Register} />
        <Route path='/logIn' component={LogIn} />
      </Switch>
    </React.Fragment>
  );
};

const AppHOC = withRouter(App);

const Root = () => (
  <div className='root'>
    <Router>
      <AppHOC />
    </Router>
  </div>
);

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
