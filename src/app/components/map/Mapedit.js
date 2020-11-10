import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';

import { withStyles } from '@material-ui/core/styles'; 
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/lab/Slider';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FolderIcon from '@material-ui/icons/Folder';
import Button from '@material-ui/core/Button';

import ReactCropper from '../../../../lib/react-cropper';
import ImageProc from '../../../../lib/ImageProc';
import * as actions from '../../actions';
import ActionSearch from 'material-ui/SvgIcon';

const fs = require("fs");
const path = require("path");
const { dialog } = require("electron").remote;
// const Caman = require('caman/dist/caman.full').Caman;

const CROP_WIDTH = 346;
const CROP_HEIGHT = 222;

const styles = theme => ({
    mapedit : {
        height: 'calc((100% - 64px) / 960 * 448)',
        overflow: 'auto',
        backgroundColor: "rgba(255, 255, 255, 0.75)",
    },
    text: {
        fontSize: '28px',
        position: 'absolute',
        left: theme.spacing.unit * 9,
    },
    formControl: {
        width: 214,
        left: theme.spacing.unit * 9,
        top: theme.spacing.unit * 9,
    },
    inputlabel: {
        color: '#00E7C0',
        fontSize: '12px',
    },
    textButton: {
        position: 'absolute',
        right: theme.spacing.unit * 5,
        top: 'calc((50% / 512 * 455))', 
    },
    button_cancel: {
        color: '#9B9B9B',
    },
    link: {
        textDecoration: 'none',
    },
    slideraction : {
        position: 'absolute',
        top: 'calc((50% / 512 * 220))',
        left: theme.spacing.unit * 9,
    },
    sliderarea : {
        padding: '18px 0px',
        width: '214px',
    },
    icon_left_a : {
        width: '15px',
        height: '15px',
        marginTop: '-7px',
        marginLeft: '-19px',
        float: 'left',
    },
    icon_right_a : {
        width: '15px',
        height: '15px',
        marginTop: '-8px',
        marginLeft: '219px',
        float: 'left',
    },
    icon_left_b : {
        width: '13px',
        height: '13px',
        marginTop: '-7px',
        marginLeft: '-19px',
        float: 'left',
    },
    icon_right_b: {
        width: '13px',
        height: '13px',
        marginTop: '-8px',
        marginLeft: '219px',
        float: 'left',
    },
    img: {
        position: 'absolute',
        top: 'calc(50% / 512 * 155)',
        right: 'calc(100% / 768 * 30)',
    },
});

class Mapedit extends Component {
    constructor(props){
        super(props);
        this.state = {
            filename: "",
            cropEnable: true,
        };

        this.onOpenFileDlg = this.onOpenFileDlg.bind(this);
        this.onClickSaveBtn = this.onClickSaveBtn.bind(this);
        this.onClickCancelBtn = this.onClickCancelBtn.bind(this);

        this.onUpdateImage = this.onUpdateImage.bind(this);
        this.onSetImageData = this.onSetImageData.bind(this);

        this.onChangeBrightness = this.onChangeBrightness.bind(this);
        this.onChangeContrast = this.onChangeContrast.bind(this);
        this.onChangeSepia = this.onChangeSepia.bind(this);
        this.onChangeSaturation = this.onChangeSaturation.bind(this);

        this.onDragEnd = this.onDragEnd.bind(this);
    }

    componentDidMount() {
        var filename = localStorage.getItem('crop-image');
        if (filename === null) {
            return;
        }

        var brightness = parseInt(localStorage.getItem('brightness'), 10);
        var contrast = parseInt(localStorage.getItem('contrast'), 10);
        var sepia = parseInt(localStorage.getItem('sepia'), 10);
        var saturation = parseInt(localStorage.getItem('saturation'), 10);
        console.log("brightness, contrast, sepia, saturation ", brightness, contrast, sepia, saturation);
            
        this.props._update_map_brightness(brightness);
        this.props._update_map_constrast(contrast);
        this.props._update_map_sepia(sepia);
        this.props._update_map_saturation(saturation);

        this.setState(Object.assign({}, this.state, {filename: filename, imgview: true}));
        this.renderImageOnCanvas(filename);
    }


    onDragEnd() {
        var imageProc = new ImageProc(this.props.imageData);
        imageProc.brightness(this.props.brightness)
            .contrast(this.props.contrast)
            .sepia(this.props.sepia)
            .saturation(this.props.saturation);
        
        this.renderCanvas(imageProc.imageData);

        this.setState(Object.assign({}, this.state, {cropEnable: true}));
    }

    onOpenFileDlg() {
        dialog.showOpenDialog({ filters: [{name: 'image', extensions: ['png','jpg']}]}, (filename) => {            
            if (filename === undefined) {
                console.log("No files were selected");
                return;
            }

            this.setState(Object.assign({}, this.state, {filename: filename, imgview: true}));
            this.renderImageOnCanvas(filename);
        })
    }

	renderImageOnCanvas(imgPath) {
        var canvas_buffer = document.getElementById('canvas-buffer');
        var ctx_buffer = canvas_buffer.getContext('2d');
        var canvas = document.getElementById('crop-canvas');
        var ctx = canvas.getContext('2d');

		var img = new Image();
        img.src = imgPath;
		// Save Image Object to State
		img.onload = () => {
            var width = img.width, height = img.height;
            if (width < CROP_WIDTH) {
                width = CROP_WIDTH;
            }
            if (height < CROP_HEIGHT) {
                height = CROP_HEIGHT;
            }
            height = width / CROP_WIDTH * CROP_HEIGHT;
			canvas_buffer.width = width;
			canvas_buffer.height = height;
            ctx_buffer.drawImage(img, 0, 0, width, height);

            var imageData = ctx_buffer.getImageData(0,0,width,height);
            this.onSetImageData(imageData);

            var imageProc = new ImageProc(imageData);
            imageProc.brightness(this.props.brightness)
                .contrast(this.props.contrast)
                .sepia(this.props.sepia)
                .saturation(this.props.saturation);

            imageData = new ImageData(imageProc.imageData.data, imageProc.imageData.width, imageProc.imageData.height);
            ctx_buffer.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);                

            var dataUrl = canvas_buffer.toDataURL('image/png');
            this.onUpdateImage(dataUrl);

			canvas.width = CROP_WIDTH;
			canvas.height = CROP_HEIGHT;
            ctx.drawImage(img, 0, 0, CROP_WIDTH, CROP_HEIGHT);
		}
	}    

    onUpdateImage(dataUrl) {
        this.props._update_map_image(dataUrl);
    }

    onSetImageData(data) {
        this.props._set_map_imagedata(data);
    }

    // onSetCropBox(box) {
    //     this.props._set_map_cropbox(box);
    // }
    
    renderCanvas(image) {
        var canvas_buffer = document.getElementById('canvas-buffer');
        var ctx_buffer = canvas_buffer.getContext('2d');
        var canvas = document.getElementById('crop-canvas');
        var ctx = canvas.getContext('2d');

        canvas_buffer.width = image.width;
        canvas_buffer.height = image.height;

        var imageData = new ImageData(image.data, image.width, image.height);
        ctx_buffer.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);

        var dataUrl = canvas_buffer.toDataURL('image/png');
        this.onUpdateImage(dataUrl);

        canvas.width = CROP_WIDTH;
        canvas.height = CROP_HEIGHT;
        ctx.putImageData(imageData, 0, 0, 0, 0, CROP_WIDTH, CROP_HEIGHT);
    }

    onChangeBrightness (event, value) {
        this.setState(Object.assign({}, this.state, {cropEnable : false}));
        this.props._update_map_brightness(value);

        var imageProc = new ImageProc(this.props.imageData);
        // imageProc.brightness(value);
        imageProc.brightness(value)
            .contrast(this.props.contrast)
            .sepia(this.props.sepia)
            .saturation(this.props.saturation);

        // console.log("imageproc data after proc ", imageProc.imageData.width, imageProc.imageData.height);
        
        this.renderCanvas(imageProc.imageData);
    };

    onChangeContrast (event, value) {
        this.setState(Object.assign({}, this.state, {cropEnable : false}));
        this.props._update_map_constrast(value);

        var imageProc = new ImageProc(this.props.imageData);
        // imageProc.contrast(value);
        imageProc.brightness(this.props.brightness)
            .contrast(value)
            .sepia(this.props.sepia)
            .saturation(this.props.saturation);
        
        this.renderCanvas(imageProc.imageData);
    };

    onChangeSepia (event, value) {
        this.setState(Object.assign({}, this.state, {cropEnable : false}));
        this.props._update_map_sepia(value);

        var imageProc = new ImageProc(this.props.imageData);
        // imageProc.sepia(value);
        imageProc.brightness(this.props.brightness)
            .contrast(this.props.contrast)
            .sepia(value)
            .saturation(this.props.saturation);
        
        this.renderCanvas(imageProc.imageData);
    };

    onChangeSaturation (event, value) {
        this.setState(Object.assign({}, this.state, {cropEnable : false}));
        this.props._update_map_saturation(value);

        var imageProc = new ImageProc(this.props.imageData);
        // imageProc.saturation(value);
        imageProc.brightness(this.props.brightness)
            .contrast(this.props.contrast)
            .sepia(this.props.sepia)
            .saturation(value);
        
        this.renderCanvas(imageProc.imageData);
    };

    onClickSaveBtn() {
        if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
            return;
        }
        let cropBox = this.cropper.getCropBoxData();
        this.props._set_map_cropimage(cropBox.width, cropBox.height,
                        this.cropper.getCroppedCanvas().toDataURL());

        localStorage.setItem('crop-image', this.state.filename);
        localStorage.setItem('brightness', this.props.brightness);
        localStorage.setItem('contrast', this.props.contrast);
        localStorage.setItem('sepia', this.props.sepia);
        localStorage.setItem('saturation', this.props.saturation);
    }

    onClickCancelBtn() {
        this.props._reset_map();
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.mapedit}>
                <div className="map">
                    <Typography gutterBottom className={classes.text}>
                        Übersichtskarte Bearbeiten
                    </Typography>

                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple" className={classes.inputlabel}>Hintergrund</InputLabel>
                        <Input id="name-simple"
                            placeholder={"Select a img file ..."}
                            value={this.state.filename}
                            onClick={this.onOpenFileDlg}
                            onChange={(e) => this.onPathChanged(e.target.value)}
                    />
                    </FormControl>

                    <div className={classes.slideraction}>
                        <div className={classes.sliderarea}>
                            <img 
                                className={classes.icon_left_a}
                                src = {"../../assets/images/brightness.png"}
                            />
                            <Slider
                                classes={{ container : classes.slider}}
                                min={-100}
                                max={100}
                                step={1}
                                value={this.props.brightness}
                                onChange={this.onChangeBrightness}   
                                onDragEnd={this.onDragEnd}
                            />
                            <img 
                                className={classes.icon_right_a}
                                src = {"../../assets/images/brightness.png"}
                            />
                        </div>
                        <div className={classes.sliderarea}>
                            <img 
                                className={classes.icon_left_b}
                                src = {"../../assets/images/contrast.png"}
                            />
                            <Slider
                                classes={{ container : classes.slider}}
                                min={-100}
                                max={100}
                                step={1}
                                value={this.props.contrast}
                                onChange={this.onChangeContrast}
                                onDragEnd={this.onDragEnd}
                            />
                            <img 
                                className={classes.icon_right_b}
                                src = {"../../assets/images/contrast.png"}
                            />
                        </div>
                        <div className={classes.sliderarea}>
                            <img 
                                className={classes.icon_left_b}
                                src = {"../../assets/images/contrast.png"}
                            />
                            <Slider
                                classes={{ container : classes.slider}}
                                min={0}
                                max={100}
                                step={1}
                                value={this.props.sepia}
                                onChange={this.onChangeSepia}
                                onDragEnd={this.onDragEnd}   
                            />
                            <img 
                                className={classes.icon_right_b}
                                src = {"../../assets/images/contrast.png"}
                            />
                        </div>
                        <div className={classes.sliderarea}>
                            <img 
                                className={classes.icon_left_b}
                                src = {"../../assets/images/contrast.png"}
                            />
                            <Slider
                                classes={{ container : classes.slider}}
                                min={-100}
                                max={100}
                                step={1}
                                value={this.props.saturation}
                                onChange={this.onChangeSaturation}
                                onDragEnd={this.onDragEnd}   
                            />
                            <img 
                                className={classes.icon_right_b}
                                src = {"../../assets/images/contrast.png"}
                            />
                        </div>
                    </div>

                    <canvas  id="canvas-buffer" ref="canvas-buffer" style={{display: 'none'}}></canvas>
                    {!this.state.cropEnable
                        ? (<canvas  className={classes.img} id="crop-canvas" ref="crop-canvas" ></canvas>)
                        : (<div>
                            <canvas  className={classes.img} id="crop-canvas" ref="crop-canvas" style={{display: 'none'}}></canvas>
                            {this.props.dataUrl &&
                                <div className={classes.img} id="map-crop">
                                    <ReactCropper
                                        // style={{ width: this.props.imageData.width, height: this.props.imageData.height}}
                                        style={{ width: CROP_WIDTH, height: CROP_HEIGHT}}
                                        // aspectRatio={16 / 9}
                                        // preview=".img-preview"
                                        autoCrop={true}
                                        zoomable={false}
                                        guides={false}
                                        background={false}
                                        src={this.props.dataUrl}
                                        ref={cropper => { this.cropper = cropper; }}
                                    />
                                </div>
                            }
                        </div>)
                    }

                    <div className={classes.textButton}>
                        <Link to="/" className={classes.link}>
                            <Button
                                className={classes.button_cancel}
                                style={{color: '#9B9B9B'}}
                                onClick = {this.onClickCancelBtn}
                            >Abbrechen</Button>
                        </Link>

                        {/*<Link to={(this.state.name === "") ? "#" : "/mapoverview"} className={classes.link} style={{color : "black"}}>*/}
                        <Link to="/mapview" className={classes.link} style={{color : "black"}}>
                            <Button
                                className={classes.button_save}
                                color="inherit"
                                onClick={this.onClickSaveBtn}
                            >Speichern</Button>
                        </Link>
                    </div>
                    
                </div>
            </div>
        );
    }
}

Mapedit.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        brightness: state.app.mapBrightness,
        contrast: state.app.mapContrast,
        sepia: state.app.mapSepia,
        saturation: state.app.mapSaturation,

        dataUrl: state.app.mapImage,
        imageData: state.app.mapImageData,
        // cropBox: state.app.mapCropBox
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        _update_map_brightness: (value) => {dispatch(actions.updateMapBrightness(value))},
        _update_map_constrast: (value) => {dispatch(actions.updateMapContrast(value))},
        _update_map_sepia: (value) => {dispatch(actions.updateMapSepia(value))},
        _update_map_saturation: (value) => {dispatch(actions.updateMapSaturation(value))},
        _set_map_cropimage: (width, height, image) => {dispatch(actions.setMapCropImage(width, height, image))},
        _set_map_imagedata: (data) => {dispatch(actions.setMapImageData(data))},
        _update_map_image: (image) => {dispatch(actions.updateMapImage(image))},
        // _set_map_cropbox: (box) => {dispatch(actions.setMapCropBox(box))},
        _reset_map: () => {dispatch(actions.resetMap())},
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Mapedit));