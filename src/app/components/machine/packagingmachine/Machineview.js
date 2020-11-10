import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Draggable from 'react-draggable';
import {connect} from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import MapIcon from '@material-ui/icons/Map';
import DomainIcon from '@material-ui/icons/Domain';
import KeyboardTabIcon from '@material-ui/icons/KeyboardTab';
import AddIcon from '@material-ui/icons/Add';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import ClearIcon from '@material-ui/icons/Clear';

import * as actions from '../../../actions';

import MachineArea from '../../../d3/MachineArea';



const styles = theme => ({
    machineview: {
        height: 'calc((100% - 64px) / 960 * 448)',
        overflow: 'auto',
        backgroundColor: '#FDFDFD',
    },
    buttonItem: {
        position: 'absolute',
        right: theme.spacing.unit * 1,
    },
    img: {
        position: 'relative',
        height: '100%',
        width: '100%'
    },
    img1: {
        zIndex: '-1'
    },
    title: {
        fontSize: '18px',
    },
    buttons: {
        marginTop: '-32px',
        float: 'right',
     
    },
    button: {
        margin: theme.spacing.unit,
        width: '16px',
        height: '16px',
    },
    
    actionbutton: {
        position: 'absolute',
        width: '142px',
        height: '32px',
        top : 'calc(100% / 316 * 134)',
        left : 'calc(100% / 300 * 84)'
    },
    actions: {
        marginRight: '-13px',   
    },
    Icon: {
        height: '35px',
        width: '35px',
    },
    link: {
        textDecoration: 'none',
    }
});


class Machineview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rendering_img_width: 0,
            rendering_img_height: 0,
            setting_img_width: 0,
            setting_img_height: 0,
        }
    }

    render() {
        const { classes } = this.props;
        let imagePath = this.props.image;

        return (
            <React.Fragment>
                <div className={classes.machineview}>
                    <div className={classes.buttonItem}>
                        <Link to={!this.props.mapButtonDisable ? "/map" : "#"} style={{color: "black"}}>
                            <IconButton 
                                className={classes.mapButton} 
                                color="inherit" 
                                aria-label="Map" 
                                disabled={this.props.mapButtonDisable} 
                                onClick={this.props._handleShowMap}
                            >
                                <MapIcon />
                            </IconButton>
                        </Link>
                        <Link to="/machine" style={{color: "black"}}>
                            <IconButton 
                                className={classes.machine_addButton} 
                                color="inherit" 
                                disabled={this.props.machineButtonDisable} 
                                onClick={this.props._handleShowMachine}
                            >
                                <DomainIcon />
                                <AddIcon style={{height: 10, width: 10, marginTop: -15, marginLeft: -5}}/>
                            </IconButton>
                        </Link>
                        
                        <Link to="/inputadd" style={{color: "black"}}>
                            <IconButton 
                                className={classes.input_addButton} 
                                color="inherit" 
                                disabled={this.props.inputButtonDisable} 
                                onClick={this.props._handleShowInputAdd}
                            >
                                <KeyboardTabIcon />
                                <AddIcon style={{height: 10, width: 10, marginTop: -15, marginLeft: -3}}/>
                            </IconButton>
                        </Link>
                    </div>
                    <MachineArea
                        name={"machine_area"}
                        scale_min={0.5}
                        scale_max={10.0}
                        image={imagePath}
                        showMachineConfirmBtn = {this.props.showMachineConfirmBtn}
                        showMachineTitle = {true}
                        showRenderConfirmBtn = {false}
                        showRenderTitle = {false}
                        showZoomBtn = {false}
                        showActionBtn = {true && !this.props.locked}
                        showSignalBtn = {false}
                        onClickMachineConfirmBtn = {this.props._click_btnMachineConfirm}
                        onClickLeftBtn = {this.props._click_btnLeft}
                        onClickRightBtn = {this.props._click_btnRight}
                    />                            
                </div>
            </React.Fragment>
        );
    }
}

Machineview.propTypes = {
    classes: PropTypes.object.isRequired,
};


const mapStateToProps = (state) => {
    return{
        image : state.app.image,
        showMachineConfirmBtn : state.app.showMachineConfirmBtn,
        locked : state.app.locked
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        _click_btnLeft: () => {dispatch(actions.rotateLeftImg())},
        _click_btnRight: () => {dispatch(actions.rotateRightImg())},
        _click_btnMachineConfirm: () => {dispatch(actions.clickMachineConfirm())},
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Machineview));
