import { combineReducers } from 'redux';
// import counter from './counter';
// import ui from './ui';
import { types } from '../actions/index.js';





const initialState = {

    mapButtonDisable : true,  
    inputButtonDisable : true,
    machineButtonDisable : true, 
    positionButtonDisable : true,

    machineviewElementDisable : false,
    renderviewElementDisable : false,
    plantviewElementDisable : false,

    showMachineConfirmBtn : true,
    machineTransform: {x: 0, y: 0, k: 1},
    redrawMachine: true,
    
    locked : true, 

    machineDir : "",
    machine : {},
    image: "",
    imageNo: 0,
    data: [],

    mapBrightness: 0,
    mapContrast: 0,
    mapSepia: 0,
    mapSaturation: 0,
    mapCropImage: null,
    mapCropImageWidth: 0,
    mapCropImageHeight: 0,
    mapImage: null,
    mapImageData: {
        data: null,
        width: 0,
        height: 0
    },
    mapCropBox: null
};

const data_length = 100000;
for (let i = 0; i < data_length; i++) {
    initialState.data.push({ time: (+Date.now()-(data_length-i)*60000), value: Math.random()});
};

const app = (state = initialState, action)=> {

    switch (action.type) {
        case types.CLICK_LOCK_BTN:
            return (Object.assign({}, state, {
                mapButtonDisable : action.value,
                machineButtonDisable : action.value,
                inputButtonDisable : action.value,
                locked : action.value,
            }));
        
        case types.CLICK_MACHINECONFIRM_BTN:
            return (Object.assign({}, state, {
                showMachineConfirmBtn : false,
            }));

        case types.CLICK_RENDER_CANCEL_BTN:
            return (Object.assign({}, state, {
                showMachineConfirmBtn : true,
            }))

        case types.UPDATE_DATA:
            return Object.assign({}, state, {data: state.data.concat(action.payload)});
        
        case types.IMG_ROTATE_LEFT:
            {
                let conf = state.machine;
                let dir = state.machineDir;
    
                console.log("reducer rotate left ", conf, dir);
    
                let imgNo = state.imageNo;
                let imgCount = conf.machine.images.length;
                imgNo++;
                if (imgNo >= imgCount) {
                    imgNo = 0;
                }
    
                let image = conf.machine.images[imgNo].filename;
                let path = '../../' + dir + '/' + image;
                console.log("reducer update machine conf, image path is ", path);
    
                return Object.assign({}, state, {image: path, imageNo: imgNo});
            }
    
        case types.IMG_ROTATE_RIGHT:
            {
                let conf = state.machine;
                let dir = state.machineDir;
    
                console.log("reducer rotate right ", conf, dir);
                
                let imgNo = state.imageNo;
                let imgCount = conf.machine.images.length;
                imgNo--;
                if (imgNo < 0) {
                    imgNo = imgCount - 1;
                }
    
                let image = conf.machine.images[imgNo].filename;
                let path = '../../' + dir + '/' + image;
                console.log("reducer update machine conf, image path is ", path);
    
                return Object.assign({}, state, {image: path, imageNo: imgNo});
            }
    
        case types.UPDATE_MACHINE_CONF:
            {
                let conf = action.machine;
                let dir = action.dir;
                let image = conf.machine.images[0].filename;
                let path = '../../' + dir + '/' + image;
                console.log("reducer update machine conf, image path is ", path);
    
                return Object.assign({}, state, 
                    {machine: conf, machineDir: dir, image: path, imageNo: 0,  machineviewElementDisable : true});
            }

        case types.CLICK_RENDER_POSITION_BTN:
            return (Object.assign({}, state, {
                machineviewElementDisable : false,
                renderviewElementDisable : true,
            }));

        case types.CLICK_SETTING_SAVE_BTN:
            return (Object.assign({}, state, {
                machineviewElementDisable : false,
                renderviewElementDisable : false,
                plantviewElementDisable : true,
            }));

        case types.UPDATE_MAP_BRIGHTNESS:
            return (Object.assign({}, state, {mapBrightness: action.value}));

        case types.UPDATE_MAP_CONTRAST:
            return (Object.assign({}, state, {mapContrast: action.value}));

        case types.UPDATE_MAP_SEPIA:
            return (Object.assign({}, state, {mapSepia: action.value}));

        case types.UPDATE_MAP_SATURATION:
            return (Object.assign({}, state, {mapSaturation: action.value}));

        case types.SET_MAP_CROPIMAGE:
            return (Object.assign({}, state, {
                mapCropImage: action.image,
                mapCropImageWidth: action.width,
                mapCropImageHeight: action.height
            }));
            
        case types.SET_MAP_IMAGEDATA:
            return (Object.assign({}, state, {mapImageData: action.data}));

        case types.UPDATE_MAP_IMAGE:
            return (Object.assign({}, state, {mapImage: action.image}));

        case types.SET_MAP_CROPBOX:
            return (Object.assign({}, state, {mapCropBox: action.cropBox}));

        case types.RESET_MAP:
            return (Object.assign({}, state, {
                mapBrightness: 0,
                mapContrast: 0,
                mapSepia: 0,
                mapSaturation: 0,
                mapCropImage: null,
                mapCropImageWidth: 0,
                mapCropImageHeight: 0,
                mapImage: null,
                mapImageData: {
                    data: null,
                    width: 0,
                    height: 0
                }
            }));

        default:
            return state;
    }
}

const reducers = combineReducers({
    app, 
});

export default reducers;
