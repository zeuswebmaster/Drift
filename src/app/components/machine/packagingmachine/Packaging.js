import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../../actions';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';

import Appbar from '../../commons/Appbar';
import Machineview from './Machineview';
import Listwhite from '../../commons/Listwhite';

const propTypes = {

};

const defaultProps = {

};


const styles = {
    packaging: {
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


class Packaging extends Component {

    constructor(props){
        super(props);
       
    }

    render(){
        return(
            <MuiThemeProvider theme={theme}>
                <div style={styles.packaging} className="packaging">
                    <Appbar />
                    <Machineview 
                        mapButtonDisable = {this.props.mapButtonDisable}
                        machineButtonDisable = {this.props.machineButtonDisable}
                        inputButtonDisable = {this.props.inputButtonDisable}

                    />
                    <Listwhite />
                </div>
            </MuiThemeProvider>
        );
    }

}
Packaging.propTypes = propTypes;
Packaging.defaultProps = defaultProps;


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


export default connect(mapStateToProps, mapDispatchToProps)(Packaging);