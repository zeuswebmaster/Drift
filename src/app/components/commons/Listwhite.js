import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    list: {
        height: 'calc(( 100% - 64px ) / 960 * 512)',
        overflow: 'auto',
        backgroundColor: "#F2F2F2",
    },
});


class Listwhite extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.list}>
            
            </div>
        );
    }
    
}
Listwhite.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Listwhite);






