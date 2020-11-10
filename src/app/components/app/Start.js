import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';

import Appbar from '../commons/Appbar';
import Plantview from './components/Plantview';
import Listwhite from '../commons/Listwhite';





const propTypes = {

};

const defaultProps = {

};


const styles = {
    start: {
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


class Start extends Component {

    constructor(props){
        super(props);
       
    }

    render(){
        return(
            <MuiThemeProvider theme={theme}>
                <div style={styles.start} className="start">
                    <Appbar />
                    <Plantview 
                        mapButtonDisable = {this.props.mapButtonDisable}
                        machineButtonDisable= {this.props.machineButtonDisable}
                        inputButtonDisable = {this.props.inputButtonDisable}
                    />
                    <Listwhite />
                </div>
            </MuiThemeProvider>
        );
    }

}
Start.propTypes = propTypes;
Start.defaultProps = defaultProps;


const mapStateToProps = (state) => {
    return{
        mapButtonDisable : state.app.mapButtonDisable,
        machineButtonDisable : state.app.machineButtonDisable,
        inputButtonDisable : state.app.inputButtonDisable,
        // imgNumber : state.app.imgNumber,
        // showMapoverview: state.app.showMapoverview,
        // showMachineview : state.app.showMachineview,
        // showInputAddview : state.app.showInputAddview,
        // showPositionImage : state.app.showPositionImage,
        // checkImgSituation : state.app.checkImgSituation,
        // mapButtonValue : state.app.mapButtonValue,
        // machineButtonValue : state.app.machineButtonValue, 
        // inputButtonValue : state.app.inputButtonValue,
        // saveSettingValue : state.app.saveSettingValue,
        // zoomButtonValue : state.app.zoomButtonValue,

        // showPlantView_Renderingview : state.app.showPlantView_Renderingview,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        // _handleShow_Map: () => {dispatch(actions.showMap())},
        // _handleShow_Machine: () => {dispatch(actions.showMachine())},
        // _handleShow_InputAdd: () => {dispatch(actions.showInputAdd())},

        // _handleClose_Img: () => {dispatch(actions.closeImg())},
        // _handleCheck_Img: () => {dispatch(actions.checkImg())},

        // check_Img: () => {dispatch(actions.checkRenderImg())},
        // close_Img: () => {dispatch(actions.closeRenderImg())},

        // click_btnLeft: () => {dispatch(actions.rotateLeftImg())},
        // click_btnRight: () => {dispatch(actions.rotateRightImg())},
        // click_btnMove: () => {dispatch(actions.moveImg())},
        // click_btnClose: () => {dispatch(actions.cleanImg())},
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Start);