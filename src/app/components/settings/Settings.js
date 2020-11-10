import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';

import Topbar from '../commons/Topbar';
import Settingview from './Settingview';
import Settinglist from './Settinglist';


const propTypes = {

};

const defaultProps = {

};


const styles = {
    settings: {
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


class Settings extends Component {

    constructor(props){
        super(props);
       
    }

    render(){
        return(
            <MuiThemeProvider theme={theme}>
                <div style={styles.settings} className="settings">
                    <Topbar />
                    <Settingview
                        data = {this.props.data}
                    />
                    <Settinglist />
    
                </div>
            </MuiThemeProvider>
        );
    }

}
Settings.propTypes = propTypes;
Settings.defaultProps = defaultProps;


const mapStateToProps = (state) => {
    return{
        data : state.app.data
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Settings);