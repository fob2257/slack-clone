import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import * as serviceWorker from './serviceWorker';

import ReduxProvider from './redux';
import AppHOC from './App';

import 'semantic-ui-css/semantic.min.css';
import './index.style.css';

const Root = () => (
  <div className="root">
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
