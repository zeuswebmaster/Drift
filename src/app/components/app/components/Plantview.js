import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MapIcon from '@material-ui/icons/Map';
import DomainIcon from '@material-ui/icons/Domain';
import KeyboardTabIcon from '@material-ui/icons/KeyboardTab';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
    plantview: {
        height: 'calc((100% - 64px) / 960 * 448)',
        overflow: 'auto',
        backgroundColor: '#FDFDFD',
    },
    buttonItem: {
        position: 'absolute',
        right: theme.spacing.unit * 1,
    },
});

class Plantview extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <div className={classes.plantview}>
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
                </div>
            </React.Fragment>
        );
    }
}

Plantview.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Plantview);