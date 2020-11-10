import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import SettingsIcon from '@material-ui/icons/Settings';
import ClearIcon from '@material-ui/icons/Clear';




const styles = theme => ({
    plantviewlist: {
        height: 'calc((100% - 64px) / 960 * 512)',
        overflow: 'auto',
        backgroundColor: "#F2F2F2",
    },
    grid: {
        padding: '0px 0px 1px 0px'
    },
    papermargin: {
        position: 'relative',
        width: '100%',
        height: '185px',
        borderRadius: '0px',
        backgroundColor: '#FAFAFA',
    },
    Texttitle: {
        position: 'absolute',
        width: '180px',
        top: '21px',
        left: '20px',
    },
    packaging: {
        fontSize: '14px',
        fontFamily: 'Helvetica Neue',
        marginBottom: '5px'
    },
    wegnehmer: {
        fontSize: '28px',
        fontFamily: 'Helvetica Neue',
        marginBottom: '67px'
    },
    current: {
        fontSize: '14px',
        fontFamily: 'Helvetica Neue'
    },
    buttonItem: {
        position: 'absolute',
        right: theme.spacing.unit * 1,
        top: theme.spacing.unit * 1,
    },
    Textbottom: {
        position: 'absolute',
        width: '170px',
        bottom: theme.spacing.unit * 1,
        right: theme.spacing.unit * 3,
        textAlign: 'right',
    },
});


class Plantviewlist extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.plantviewlist}>
                <Grid container spacing={0}>
                    <Grid item xs={12} className={classes.grid}>
                        <Paper elevation={0} className={classes.papermargin}>
                            <div className={classes.Texttitle}>
                                <Typography className={classes.packaging}>Verpackungsmaschine</Typography>
                                <Typography className={classes.wegnehmer}>Wegnehmer 1</Typography>
                                <Typography className={classes.current}>Aktueller Wert: 21,53</Typography>
                            </div>

                            <div className={classes.buttonItem}>
                                <IconButton className={classes.group} color="inherit">
                                    <TrendingDownIcon />
                                </IconButton>
                                <IconButton className={classes.settings} color="inherit">
                                    <SettingsIcon />
                                </IconButton>
                                <IconButton className={classes.close} color="inherit">
                                    <ClearIcon />
                                </IconButton>
                            </div>

                            <div className={classes.Textbottom}>
                                <Typography>Abweichung: 3,11 %</Typography>
                                <Typography>OOC: 5,34 %</Typography>
                                <Typography>Streuung: 2,49 %</Typography>
                                <Typography>Drift: 31,56 %</Typography>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

Plantviewlist.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Plantviewlist);