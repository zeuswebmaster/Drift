// require('node-jsx').install({ harmony: true, extension: '.jsx' });

const { webFrame } = require('electron');

// Prevent App-Zooming
webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(0, 0);


import './router_container/root';

// const store = require('./store');
// const { Observable } = require('rxjs');
// import * as actions from './actions';

// const data$ = Observable.interval(20).map((i)=>{

//     store.default.dispatch(actions.updateData({ time: +Date.now()+(i*60000), value: Math.random(), process_quality: (Math.random()*0.2+0.8) }))
//     return;
// }).subscribe();

console.log(process.pid);