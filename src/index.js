import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import * as serviceWorker from './serviceWorker';

import 'semantic-ui-css/semantic.min.css';

import HomePage from './components/App';
import Register from './components/Register';
import LogIn from './components/LogIn';

const Root = () => (
  <div className='root'>
    <Router>
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route path='/register' component={Register} />
        <Route path='/logIn' component={LogIn} />
      </Switch>
    </Router>
  </div>
);

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
