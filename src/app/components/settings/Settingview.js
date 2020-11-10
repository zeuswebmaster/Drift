import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const MultiChart = require("../../d3/multiChart")




const styles = theme => ({
    settingview: {
        height: 'calc((100% - 64px) / 960 * 448)',
        overflow: 'auto',
        backgroundColor: "rgba(255, 255, 255, 0.75)",
    },
    text: {
        fontSize: '28px',
        position: 'absolute',
        left: theme.spacing.unit * 9,
    },
    textButton: {
        position: 'absolute',
        right: theme.spacing.unit * 5,
        top: 'calc((50% / 512 * 455))', 
    },
    settingchart: {
        position: 'relative',
        top: '65px',
    },
    link: {
        textDecoration: 'none',
    }
});



class Settingview extends Component {
    constructor(props){
        super(props);
        this.state = {
            lernsets: []
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.lernsets !== nextState.lernsets) {
            return false;
        }
        return true; 
    }

    changeLernset(key, value) {
        console.log('update', value);
        if (value.type === 'update') {
            this.setState({ lernsets: value.sets });
        } else if (value.type === 'delete') {
            this.setState({ lernsets: this.state.lernsets.filter(s => s.id !== value.set.id) });
        }
    }

    render() {
        const { data } = this.props;
        const { lernsets } = this.state;

        console.log("settingview data", data);

        let latest = {};
        if (data.length > 0) {
            latest = data[data.length - 1];
        }

        const { classes } = this.props;
        return (
            <div className={classes.settingview}>
               
                <Typography gutterBottom className={classes.text}>
                    Einstellungen
                </Typography>
                
                <div className={classes.settingchart}>
                    <MultiChart
                        data={data}
                        lernsets={lernsets}
                        mode="alternative"
                        changeLernset={this.changeLernset.bind(this)}
                    />
                </div>
                
                <div className={classes.textButton}>
                    <Link to="/" className={classes.link}>
                        <Button 
                            className={classes.button_cancel} 
                            style={{color: '#9B9B9B'}} 
                            onClick={this.props._closeSetting}
                        >Abbrechen</Button>
                    </Link>

                    <Link to="/plantview" style={{color: "black"}} className={classes.link}>
                        <Button 
                            className={classes.button_save} 
                            color="inherit" 
                            onClick={this.props.btn_click_SettingSave}
                        >Speichern</Button>
                    </Link>
                </div>
            </div>
        )
    }
}

Settingview.propTypes = {
    classes:  PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return{
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        btn_click_SettingSave: () => {dispatch(actions.clickSettingSaveBtn())},
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Settingview));    
