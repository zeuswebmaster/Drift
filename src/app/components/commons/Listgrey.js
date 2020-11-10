import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    list: {
        height: 'calc(( 100% - 64px ) / 960 * 512)',
        overflow: 'auto',
        backgroundColor: "rgba(0, 0, 0, 0.25)",
        // backgroundColor: "red",
    },
});


class Listgrey extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.list}>
            
            </div>
        );
    }
    
}
Listgrey.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Listgrey);

