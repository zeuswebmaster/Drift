import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';

import Appbar from '../commons/Appbar';
import Plantviewimg from './Plantviewimg';
import Plantviewlist from './Plantviewlist';


const propTypes = {

};

const defaultProps = {

};


const styles = {
    machine: {
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


class Plantview extends Component {

    constructor(props){
        super(props);
       
    }

    render(){
        return(
            <MuiThemeProvider theme={theme}>
                <div style={styles.machine} className="machine">
                    <Appbar />
                    <Plantviewimg 
                        mapButtonDisable = {this.props.mapButtonDisable}
                        machineButtonDisable = {this.props.machineButtonDisable}
                        inputButtonDisable = {this.props.inputButtonDisable}
                        imgButtonItemDisable = {this.props.imgButtonItemDisable}

                        imgNumber = {this.props.imgNumber}

                    />
                    <Plantviewlist />
                    
                </div>
            </MuiThemeProvider>
        );
    }

}
Plantview.propTypes = propTypes;
Plantview.defaultProps = defaultProps;


const mapStateToProps = (state) => {
    return{
        imgNumber : state.app.imgNumber
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Plantview);