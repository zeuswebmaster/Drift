import React from 'react';
import ReactDOM from 'react-dom';
import Routering from './Route';
import store from '../store.js';

// const App = require('./App.js');

import { Provider } from 'react-redux';

// ReactDOM.render(
//     <Provider store={store}>
//     <App />
//     </Provider>
//     , document.getElementById('panda')
// );


ReactDOM.render(
    <Provider store={store}>
    <Routering />
    </Provider>
    , document.getElementById('panda')
);

