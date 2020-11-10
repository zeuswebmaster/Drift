import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MapIcon from '@material-ui/icons/Map';
import DomainIcon from '@material-ui/icons/Domain';
import KeyboardTabIcon from '@material-ui/icons/KeyboardTab';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

import * as actions from '../../../actions';
import { connect } from 'react-redux';
import MachineArea from '../../../d3/MachineArea';

const styles = theme => ({
    renderingview: {
        height: 'calc((100% - 64px) / 960 * 448)',
        // width: 'calc(100% * 600 /768)',
        overflow: 'auto',
        backgroundColor: '#FDFDFD',
    },
    buttonItem: {
        position: 'absolute',
        right: theme.spacing.unit * 1,
    },
    link: {
        textDecoration: 'none',
    }
});


class Renderingview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        const { classes } = this.props;
        var imagePath = this.props.image;

        return (
            <React.Fragment>
                <div className={classes.renderingview}>
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
                        image_width={300}
                        image_height={300}
                        showMachineConfirmBtn = {false}
                        showMachineTitle = {false}
                        showRenderConfirmBtn = {true}
                        showRenderTitle = {true}
                        showZoomBtn = {true}
                        showActionBtn = {false}
                        showSignalBtn = {false}
                    />   
                </div>
            </React.Fragment>
        );
    }
}

Renderingview.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return{
        mapButtonDisable : state.app.mapButtonDisable,
        machineButtonDisable : state.app.machineButtonDisable,
        inputButtonDisable : state.app.inputButtonDisable,

        image : state.app.image,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Renderingview));
