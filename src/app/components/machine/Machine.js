import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';

import Topbar from '../commons/Topbar';
import Listgrey from '../commons/Listgrey';
import NewPlant from './NewPlant';

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


class Machine extends Component {

    constructor(props){
        super(props);
       
    }

    render(){
        return(
            <MuiThemeProvider theme={theme}>
                <div style={styles.machine} className="machine">
                    <Topbar />
                    <NewPlant />
                    <Listgrey />
                </div>
            </MuiThemeProvider>
        );
    }

}
Machine.propTypes = propTypes;
Machine.defaultProps = defaultProps;


const mapStateToProps = (state) => {
    return{
        
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Machine);