// import { createStore, applyMiddleware, compose } from 'redux';
// import reducers from './reducers/index.js';
// const { remote } = require('electron');
// const settings = require('electron-settings');
// import {createLogger} from 'redux-logger';

// const currentWindow = remote.getCurrentWindow();
// const logger = createLogger();
// const store = createStore(
//     reducers,
//     compose(
//         applyMiddleware(logger),
//         window.devToolsExtension ? window.devToolsExtension() : f => f,
//     ),
// );


// currentWindow.on('close', () => {
//     const parser = Object.assign({}, store.getState().parser);
//     parser.allParsers.forEach((id) => { parser.byID[id].watcher = {}; });

//     const input = Object.assign({}, store.getState().input);
//     input.allInputs.forEach((id) => {
//         input.byID[id].data = [];
    
//     });

//     const app = Object.assign({}, { settings: store.getState().app.settings });
//     settings.setAll({app, input, parser});
// });
// export default store;

import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers/index.js';
const { remote } = require('electron');
const settings = require('electron-settings');
import {createLogger} from 'redux-logger';

const currentWindow = remote.getCurrentWindow();
const logger = createLogger();
const store = createStore(
    reducers,
    compose(
        applyMiddleware(logger),
        window.devToolsExtension ? window.devToolsExtension() : f => f,
    ),
);


currentWindow.on('close', () => {
    const parser = Object.assign({}, store.getState().parser);
    parser.allParsers.forEach((id) => { parser.byID[id].watcher = {}; });

    const input = Object.assign({}, store.getState().input);
    input.allInputs.forEach((id) => {
        input.byID[id].data = [];
    
    });

    const app = Object.assign({}, { settings: store.getState().app.settings });
    settings.setAll({app, input, parser});
});
export default store;