import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';



const styles = theme => ({
    partitionlayout: {
        height: 'calc((100% - 64px) / 960 * 448)',
        overflow: 'auto',
        backgroundColor: "rgba(255, 255, 255, 0.75)",
    },
    text: {
        fontSize: '28px',
        position: 'absolute',
        left: theme.spacing.unit * 9,
    },
    margin: {
        margin: theme.spacing.unit,
    },
    textField: {
        flexBasis: 200,
        width: 214,
        
    },
    textgroup: {
        position: 'absolute',
        left: theme.spacing.unit * 9,
        top: theme.spacing.unit * 15,
    },
    label: {
        color: '#00E7C0',
        fontSize: '12px',
        marginTop: '10px'
    },
    PartitionLayout: {
        width: '404px',
        height: '269px',
        position: 'absolute',
        right: theme.spacing.unit * 4,
        top: '135px',
        // backgroundColor: 'red',
    },
    paper: {
        textAlign: 'center',
        backgroundColor: 'blue',
        height: '269px',
        width: '100px',
        borderRadius: '0px',
    },
    paper1: {
        textAlign: 'left',
        backgroundColor: 'rgba(29, 38, 42, 0.5)',
        height: '269px',
        width: '100px',
        borderRadius: '0px',
    },
    paper1_1: {
        height: '95px',
        backgroundColor: 'rgba(29, 38, 42, 0.5)',
    },
    paper1_2: {
        height: '53px',
        backgroundColor: 'rgba(29, 38, 42, 0.5)',
    },
    typetext: {
        color: 'white',
        position: 'relative',
        fontSize: '10px',
        top: 'calc(50% - 10px / 2)',
    },
    grid: {
        padding: '0px 0px 1px 0px',
    },
    papermargin: {
        width: '100px',
        marginBottom: '1px',
        borderRadius: '0px',
    },
    textButton: {
        position: 'absolute',
        right: theme.spacing.unit * 5,
        top: 'calc((50% / 512 * 455))', 
    },
    button_abb: {
        color: '#9B9B9B',
    },
    link: {
        textDecoration: 'none',
    }
});

const data_source = [
    {
      value: 'OPC-UA',
      label: 'OPC-UA',
    },
    {
      value: '21-50',
      label: '21 to 50',
    },
    {
      value: '51-100',
      label: '51 to 100',
    },
];

const security_control = [
    {
        value: 'Sign & Encrypt',
        label: 'Sign & Encrypt',
    },
    {
        vlaue: '',
        label: '',
    }
];

const paper2_source = [
    {
        height: '95px',
        color: 'rgba(29, 38, 42, 0.5)',
        text: '1.1',
    },
    {
        height: '53px',
        color: 'rgba(29, 38, 42, 0.5)',
        text: '1.2',
    },
    {
        height: '29px',
        color: 'rgba(29, 38, 42, 0.5)',
        text: '1.3',
    },
    {
        height: '29px',
        color: 'rgba(29, 38, 42, 0.5)',
        text: '1.4',
    },
    {
        height: '17px',
        color: 'rgba(29, 38, 42, 0.5)',
        text: '1.5',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.5)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.5)',
        text: '',
    },
];

const paper3_source = [
    {
        height: '29px',
        color: 'rgba(29, 38, 42, 0.5)',
        text: '1.1.1',
    },
    {
        height: '29px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '1.1.2',
    },
    {
        height: '17px',
        color: 'rgba(29, 38, 42, 0.5)',
        text: '1.1.3',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '17px',
        color: 'rgba(29, 38, 42, 0.5)',
        text: '1.2.1',
    },
    {
        height: '17px',
        color: 'rgba(29, 38, 42, 0.5)',
        text: '1.2.2',
    },
    {
        height: '17px',
        color: 'rgba(29, 38, 42, 0.5)',
        text: '1.2.3',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.5)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '29px',
        color: 'white',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
];
const paper4_source = [
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '29px',
        color: 'white',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '17px',
        color: 'white',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
    {
        height: '41px',
        color: 'white',
        text: '',
    },
    {
        height: '5px',
        color: 'rgba(29, 38, 42, 0.25)',
        text: '',
    },
];

class Partitionlayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_source: 'OPC-UA',
            end_pointurl: 'HostnameOrIP:Port',
            security_control: 'Sign & Encrypt',
            user_name: 'Panda',
            password: '',
            node_id: 'Pfad/zum/Messwert',
        }
        this._handleChange = this._handleChange.bind(this);


    }

    _handleChange(name, value) {
        switch (name) {
        
            case 'data_source':
                this.setState({ data_source:  value });
                break;

            case 'end_pointurl':
                this.setState({ end_pointurl:  value });
                break;

            case 'security_control':
                this.setState({ security_control:  value });
                break;

            case 'user_name':
                this.setState({ user_name:  value });
                break;

            case 'password':
                this.setState({ password:  value });
                break;
            
            case 'node_id':
                this.setState({ node_id: value });
                break;
    
          default:
            this.setState({ name: value });
            break;
        }
    }
    
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.partitionlayout}>
                <Typography gutterBottom className={classes.text}>
                    Neuen Messwert hinzufügen
                </Typography>

                <div className={classes.textgroup}>
                    <TextField 
                        className={classNames(classes.DataSource, classes.textField)}    
                        select 
                        label="Datenquelle" 
                        InputLabelProps={{
                            shrink: true,    
                            className: classes.label
                        }} 
                        value={this.state.data_source}
                        onChange={ (e) => this._handleChange('data_source', e.target.value)}
                    >
                        {data_source.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <br />

                    <TextField
                        className={classNames(classes.EndpointUrl, classes.textField)}
                        label="EndpointUrl"   
                        InputLabelProps={{
                            shrink: true,
                            className: classes.label
                        }}
                        value={this.state.end_pointurl}   
                        onChange={ (e) => this._handleChange('end_pointurl', e.target.value)}
                    />
            
                    <br />

                    <TextField 
                        className={classNames(classes.SecurityControl, classes.textField)}    
                        select 
                        label="Sicherheitseinstellung" 
                        InputLabelProps={{
                            shrink: true,
                            className: classes.label
                        }} 
                        value={this.state.security_control}
                        onChange={ (e) => this._handleChange('security_control', e.target.value)}
                    >
                        {security_control.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    
                    <br />

                    <TextField
                        className={classNames(classes.Username, classes.textField)}
                        label="Benutzername"   
                        InputLabelProps={{
                            shrink: true,
                            className: classes.label
                        }}
                        value={this.state.user_name}   
                        onChange={ (e) => this._handleChange('user_name', e.target.value)}
                    />
            
                    <br />

                    <TextField
                        className={classNames(classes.Password, classes.textField)}
                        label="Passwort"   
                            InputLabelProps={{
                                shrink: true,
                                className: classes.label
                        }}
                        type="password"
                        value={this.state.password}   
                        onChange={ (e) => this._handleChange('password', e.target.value)}
                    />

                    <br />

                    <TextField
                        className={classNames(classes.NodeID, classes.textField)}
                        label="NodeID"   
                            InputLabelProps={{
                                shrink: true,
                                className: classes.label
                        }}
                        value={this.state.node_id}   
                        onChange={ (e) => this._handleChange('node_id', e.target.value)}
                    />
                </div>

                <div className={classes.PartitionLayout}>
                    <Grid container>
                        <Grid item xs={3} className={classes.grid}>
                            <Paper elevation={0} className={classes.paper1} >
                                <Typography className={classes.typetext}>1</Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={3} className={classes.grid}>
                            {paper2_source.map(option => (
                                <Paper elevation={0} className={classes.papermargin} style={{height: option.height, backgroundColor: option.color}}>
                                    <Typography className={classes.typetext}>{option.text}</Typography>
                                </Paper>
                            ))}
                        </Grid>

                        <Grid item xs={3} className={classes.grid}>
                            {paper3_source.map(option => (
                                <Paper elevation={0} className={classes.papermargin} style={{height: option.height, backgroundColor: option.color}}>
                                    <Typography className={classes.typetext}>{option.text}</Typography>
                                </Paper>
                            ))}
                        </Grid>

                        <Grid item xs={3} className={classes.grid}>
                        {paper4_source.map(option => (
                            <Paper elevation={0} className={classes.papermargin} style={{height: option.height, backgroundColor: option.color}}>
                                <Typography className={classes.typetext}>{option.text}</Typography>
                            </Paper>
                        ))}
                        </Grid>
                    </Grid>
                </div>
                
                <div className={classes.textButton}>
                    <Link to="/" className={classes.link}>
                        <Button 
                            className={classes.button_abb} 
                            style={{color: '#9B9B9B'}} 
                            onClick={this.props.btn_click_RenderAbb}
                        >Abbrechen</Button>
                    </Link>
                    
                    <Link to="/rendering" className={classes.link} style={{color: 'black'}}>
                        <Button 
                            className={classes.button_Pos} 
                            color="inherit" 
                            onClick={this.props.btn_click_RenderPos}
                        >Positionieren</Button>
                    </Link>
                </div>

            </div>
        );
    }
}
Partitionlayout.prpTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return{
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        btn_click_RenderPos: () => {dispatch(actions.clickRenderPosBtn())},
        btn_click_RenderAbb: () => {dispatch(actions.clickRenderAbbBtn())},
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Partitionlayout));    