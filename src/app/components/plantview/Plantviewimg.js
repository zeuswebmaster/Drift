import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Draggable from 'react-draggable';


import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MapIcon from '@material-ui/icons/Map';
import DomainIcon from '@material-ui/icons/Domain';
import KeyboardTabIcon from '@material-ui/icons/KeyboardTab';
import AddIcon from '@material-ui/icons/Add';
import MachineArea from '../../d3/MachineArea';

import * as actions from '../../actions';
import { connect } from 'react-redux';

const styles = theme => ({
    plantviewimg: {
        height: 'calc((100% - 64px) / 960 * 448)',
        overflow: 'auto',
        backgroundColor: '#FDFDFD',
    },
    buttonItem: {
        position: 'absolute',
        right: theme.spacing.unit * 1,
    },

});


class Plantviewimg extends Component {
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
        var imagePath = this.props.image;
        return (
            <React.Fragment>
                <div className={classes.plantviewimg}>
                    <div className={classes.buttonItem}>
                        <IconButton 
                            className={classes.mapButton} 
                            color="inherit" 
                            aria-label="Map" 
                            disabled={this.props.mapButtonDisable} 
                            onClick={this.props._handleShowMap}
                        >
                            <MapIcon />
                        </IconButton>

                        <Link to={!this.props.machineButtonDisable ? "/machine" : "#"} style={{color: "black"}}>
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
                        
                        <Link to={!this.props.inputButtonDisable ? "/inputadd" : "#"} style={{color: "black"}} >
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
                        name="machine_area"
                        scale_min={0.5}
                        scale_max={10.0}
                        image={imagePath}
                        showMachineConfirmBtn = {false}
                        showMachineTitle = {false}
                        showRenderConfirmBtn = {false}
                        showRenderTitle = {false}
                        showZoomBtn = {true}
                        showActionBtn = {true && !this.props.locked}
                        showSignalBtn = {true}
                        onClickLeftBtn = {this.props._click_btnLeft}
                        onClickRightBtn = {this.props._click_btnRight}
                    />   
                </div>
            </React.Fragment>
        );
    }
}

Plantviewimg.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return{
        mapButtonDisable : state.app.mapButtonDisable,
        machineButtonDisable : state.app.machineButtonDisable,
        inputButtonDisable : state.app.inputButtonDisable,

        image : state.app.image,
        locked : state.app.locked
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        _click_btnLeft: () => {dispatch(actions.rotateLeftImg())},
        _click_btnRight: () => {dispatch(actions.rotateRightImg())},
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Plantviewimg));
