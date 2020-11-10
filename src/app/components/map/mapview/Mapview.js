import React, { Component } from 'react';
import { connect } from 'react-redux';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';

import Appbar from '../../commons/Appbar';
import Mapoverview from './Mapoverview';
import Listwhite from '../../commons/Listwhite';


const propTypes = {

};

const defaultProps = {

};

const styles = {
    mapview: {
        height: '100%',
    },
};


const theme = createMuiTheme({
    typography: {
        fontfamily: 'Lucida Grande',
        useNextVariants: true
    },
    palette: {
        primary: { main: blueGrey[900] },
        secondary: { main: '#FFF' },
        text: { primary: blueGrey[900]},
    },
});

class Mapview extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <div style={styles.mapview} className="mapview">
                    <Appbar />
                    <Mapoverview
                        name="overview"
                        scale_min={0.25}
                        scale_max={4.0}
                        mapButtonDisable = {this.props.mapButtonDisable}
                        machineButtonDisable = {this.props.machineButtonDisable}
                        inputButtonDisable = {this.props.inputButtonDisable}
                        showZoomBtn = {true}
                    />
                    <Listwhite />
                </div>
            </MuiThemeProvider>
        );
    }
}

Mapview.propTypes = propTypes;
Mapview.defaultProps = defaultProps;

const mapStateToProps = (state) => {
    return{
        mapButtonDisable : state.app.mapButtonDisable,
        machineButtonDisable : state.app.machineButtonDisable,
        inputButtonDisable : state.app.inputButtonDisable,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Mapview);