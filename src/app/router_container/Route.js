import React, { Component } from  'react';
import PropTypes from 'prop-types';
import {BrowserRouter as Router,
        HashRouter,
        Link,
        Route,
        Switch } from 'react-router-dom';
import App from '../components/app/App';
import Mapinit from '../components/map/Map';
import Mapview from '../components/map/mapview/Mapview'
import Machine from '../components/machine/Machine';
import Packaging from '../components/machine/packagingmachine/Packaging'; 
import Inputadd from '../components/inputadd/Inputadd';
import Rendering from '../components/inputadd/rendering/Rendering';
import Settings from '../components/settings/Settings';
import Plantview from '../components/plantview/Plantview';


const propTypes = {

};

const defaultProps ={

};
const styles = {
    route: {
        height: '100%',
    },
};

class Routering extends Component {
    constructor(props){
        super(props);
        
    }

    render(){
        return(
            <div className="route" style={styles.route}>
                <HashRouter>
                    <div style={{height : '100%'}}>
                        <Route path="/" exact component={App} />
                        <Route path="/map" component={Mapinit} />
                        <Route path="/mapview" component={Mapview} />
                        <Route path="/machine" component={Machine} />
                        <Route path="/packagingmachine" component={Packaging} />
                        <Route path="/inputadd" component={Inputadd} />
                        <Route path="/rendering" component={Rendering} />
                        <Route path="/settings" component={Settings} />
                        <Route path="/plantview" component={Plantview} />
                    </div>
                </HashRouter>
            </div>
        );
    }
}
Routering.propTypes = propTypes;
Routering.defaultProps = defaultProps;



export default Routering;