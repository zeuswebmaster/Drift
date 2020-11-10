import React, { Component } from 'react';
import PropTypes from 'prop-types';


import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';




const styles = theme => ({
    Loading: {
        position: 'absolute',
        width: 'calc(100% / 768 * 250)',
        height: 'calc(100% / 1024 * 183)',
        top: 'calc((100% - 183px) / 2 - 10px)',
        left: 'calc((100% - 250px) / 2)',
        textAlign: 'center',
    },
    panda: {
        fontSize: '67px',
    },
    drift: {
        fontSize: '86px',
    },
    
});

class Loading extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        
        const {classes } = this.props;
        return (
            <div className={classes.Loading}>
                <Typography variant="title" className={classes.panda}>
                    PANDA
                </Typography>
                <Typography variant="title" className={classes.drift}>
                    DRIFT
                </Typography>
            </div>
        );
    }
}

Loading.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Loading);