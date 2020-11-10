import React, { Component } from  'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';


import Loading from './Loading';

const propTypes = {

};

const defaultProps = {

};

const style = {
    start: {
        height: '100%',
    },
};

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
        }
    }

    componentDidMount() {
        let time = this.state.time;
        for (time = 1; time <= 10; time ++)
        {
            setTimeout(() => {
                
            }, 1000 * time);
        }
        setTimeout(() => {
            this.setState({loading: false})
          }, 5000)
        // this.setState({loading: false})
    }

    render(){
        return(
            <div style={styles.start} className="start">
                {this.state.loading 
                    ? <Loading /> 
                    : <Start />
                }
            </div>
        );
    }
}
Start.propTypes = propTypes;
Start.defaultProps = defaultProps;


const mapStateToProps = (state) => {
    return{
        
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
