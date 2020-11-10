import React, { Component } from 'react';
import { connect } from 'react-redux';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';

import Topbar from '../commons/Topbar';
import Mapedit from './Mapedit';
import Listgrey from '../commons/Listgrey';

const propTypes = {

};

const defaultProps = {

};


const styles = {
    map: {
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


class Mapinit extends Component {

    constructor(props){
        super(props);
       
    }

    render(){
        return(
            <MuiThemeProvider theme={theme}>
                <div style={styles.map} className="map">
                    <Topbar />
                    <Mapedit />
                    <Listgrey />
                </div>
            </MuiThemeProvider>
        );
    }

}
Mapinit.propTypes = propTypes;
Mapinit.defaultProps = defaultProps;


const mapStateToProps = (state) => {
    return{
        
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Mapinit);