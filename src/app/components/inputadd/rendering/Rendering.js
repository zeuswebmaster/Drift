import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../../actions';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';

import Appbar from '../../commons/Appbar';
import Listwhite from '../../commons/Listwhite';
import Renderingview from './Renderingview';


const propTypes = {

};

const defaultProps = {

};


const styles = {
    rendering: {
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


class Rendering extends Component {

    constructor(props){
        super(props);
       
    }

    render(){
        return(
            <MuiThemeProvider theme={theme}>
                <div style={styles.rendering} className="rendering">
                    <Appbar />
                    <Renderingview 
                        mapButtonDisable = {this.props.mapButtonDisable}
                        machineButtonDisable = {this.props.machineButtonDisable}
                        inputButtonDisable = {this.props.inputButtonDisable}
                        imgNumber = {this.props.imgNumber}
                    />
                    <Listwhite />
                </div>
            </MuiThemeProvider>
        );
    }

}
Rendering.propTypes = propTypes;
Rendering.defaultProps = defaultProps;


const mapStateToProps = (state) => {
    return{
        imgNumber : state.app.imgNumber,
        mapButtonDisable : state.app.mapButtonDisable,
        machineButtonDisable : state.app.machineButtonDisable,
        inputButtonDisable : state.app.inputButtonDisable,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Rendering);
