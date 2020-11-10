import { func } from "prop-types";

//import { INCREMENT, DECREMENT, SET_COLOR} from "./ActionTypes";
// import * as types from './ActionTypes';

export const types = {

    CLICK_LOCK_BTN : "CLICK_LOCK_BTN",
    CLICK_MACHINECONFIRM_BTN : "CLICK_MACHINECONFIRM_BTN",

    CLICK_RENDER_POSITION_BTN : "CLICK_RENDER_POSITION_BTN",
    CLICK_RENDER_CANCEL_BTN : "CLICK_RENDER_CANCEL_BTN",
    CLICK_SETTING_SAVE_BTN : "CLICK_SETTING_SAVE_BTN",

    UPDATE_MACHINE_CONF: "UPDATE_MACHINE_CONF",

    IMG_ROTATE_LEFT : "IMG_ROTATE_LEFT",
    IMG_ROTATE_RIGHT : "IMG_ROTATE_RIGHT",    
    UPDATE_DATA : "UPDATE_DATA",

    UPDATE_MAP_BRIGHTNESS : "UPDATE_MAP_BRIGHTNESS",
    UPDATE_MAP_CONTRAST : "UPDATE_MAP_CONTRAST",
    UPDATE_MAP_SEPIA : "UPDATE_MAP_SEPIA",
    UPDATE_MAP_SATURATION : "UPDATE_MAP_SATURATION",
    SET_MAP_CROPIMAGE : "SET_MAP_CROPIMAGE",
    SET_MAP_IMAGEDATA : "SET_MAP_IMAGEDATA",
    UPDATE_MAP_IMAGE : "UPDATE_MAP_IMAGE",
    SET_MAP_CROPBOX: "SET_MAP_CROPBOX",
    RESET_MAP: "RESET_MAP"  
}
//----------------Appbar Button action--------------------//
export function clickLockBtn(value) {
    return {
        type: types.CLICK_LOCK_BTN,
        value
    };
}

export function clickRenderPosBtn() {
    return {
        type: types.CLICK_RENDER_POSITION_BTN,
    }
}

export function clickRenderAbbBtn() {
    return {
        type: types.CLICK_RENDER_CANCEL_BTN,
    }
}

export function clickSettingSaveBtn() {
    return {
        type: types.CLICK_SETTING_SAVE_BTN,
    }
}

export function clickMachineConfirm() {
    return {
        type: types.CLICK_MACHINECONFIRM_BTN,
    };
}

export function updateData(payload) {
    return {
        type: types.UPDATE_DATA,
        payload: payload
    }
}

export function rotateLeftImg() {
    return {
        type: types.IMG_ROTATE_LEFT
    };
}

export function rotateRightImg() {
    return {
        type: types.IMG_ROTATE_RIGHT
    };
}

export function updateMachine(machine, dir) {
    return {
        type: types.UPDATE_MACHINE_CONF,
        machine: machine,
        dir: dir
    };
}

export function updateMapBrightness(value) {
    return {
        type: types.UPDATE_MAP_BRIGHTNESS,
        value: value
    };
}

export function updateMapContrast(value) {
    return {
        type: types.UPDATE_MAP_CONTRAST,
        value: value
    };
}

export function updateMapSepia(value) {
    return {
        type: types.UPDATE_MAP_SEPIA,
        value: value
    };
}

export function updateMapSaturation(value) {
    return {
        type: types.UPDATE_MAP_SATURATION,
        value: value
    };
}

export function setMapCropImage(width, height, image) {
    return {
        type: types.SET_MAP_CROPIMAGE,
        width: width,
        height: height,
        image: image
    }
}

export function setMapImageData(data, width, height) {
    return {
        type: types.SET_MAP_IMAGEDATA,
        data: data
    }
}

export function updateMapImage(image) {
    return {
        type: types.UPDATE_MAP_IMAGE,
        image: image
    }
}

export function setMapCropBox(box) {
    return {
        type: types.SET_MAP_CROPBOX,
        cropBox: box
    }
}

export function resetMap() {
    return {
        type: types.RESET_MAP
    }
}