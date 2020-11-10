import React, { Component } from 'react';
import PropTypes from 'prop-types';


import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    topbar: {
        height: '64px',
        backgroundImage: "linear-gradient(to bottom, #A2A7AA, #FFFFFF)",
    },
});

class Topbar extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.topbar}>
            </div>
        );
    }
}

Topbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Topbar);
