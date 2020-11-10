import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import * as actions from '../../actions';

import { withStyles } from '@material-ui/core/styles';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import SettingsIcon from '@material-ui/icons/Settings';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        height: 64,
        paddingLeft: 24,
    },
    root: {
        flexGrow: 1,
    },

    menuButton: {
        width: 48,
        height: 48,
        position: 'absolute',
        right: theme.spacing.unit * 1,
    },
    setting1: {
        float: "right",
    }
});


class Appbar extends Component {


    constructor(props) {
        super(props);
        this.state = {
            menu: null,
            lock_state: true,

        };
        this._handleToggle = this._handleToggle.bind(this);
    }

    _handleToggle(key, value) {
        switch (key) {
            case 'menu':
                this.setState({ menu: this.state.menu ? null : value});
                break;

            case 'lock':
                
                if (this.props.locked){
                    console.log("true");
                    this.props.btn_click_Lock(false);
                } else {
                    this.props.btn_click_Lock(true);
                }
                // this.setState({lock_state: !this.state.lock_state, menu: null });
                
                this.setState({ menu: null });
                break;

            case 'instruction':
                showInstruction();
                this.setState({ menu: null });
                break;

            default:
                this.setState({ [key]: !this.state[key], menu: null });
                break;
        }
    }


    render() {
        const { classes } = this.props;
        const { menu } = this.state;
        return (
            <React.Fragment>
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar className={classes.toolbar}>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={e => this._handleToggle('menu', e.currentTarget)}>
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Menu
                    id="menu"
                    anchorEl={menu}
                    open={Boolean(menu)}
                    onClose={e => this._handleToggle('menu', e.currentTarget)}
                >
                {this.props.locked ?
                    (<MenuItem divider onClick={e => this._handleToggle('lock', e)}>
                        <IconButton color="inherit" style={{left : '-5px'}}>
                            <LockIcon />
                        </IconButton>
                        <p>Verriegeln</p>
                    </MenuItem>) :
                    (<MenuItem divider onClick={e => this._handleToggle('lock', e)}>
                        <IconButton color="inherit" style={{left : '-5px'}}>
                            <LockOpenIcon />
                        </IconButton>
                        <p>Entriegeln</p>
                    </MenuItem>)
                }
                <MenuItem onClick={e => this._handleToggle('settings', e)} className={this.props.locked ? classes.setting1 : classes.setting2}>
                    {!this.props.locked &&
                        <IconButton color="inherit" style={{left : '-5px'}}>
                            <SettingsIcon />
                        </IconButton>
                    }
                    <p>Einstellungen</p>
                </MenuItem>
                <MenuItem onClick={e => this._handleToggle('asd', e)}></MenuItem>
              </Menu>    
            </div>
            </React.Fragment>
        );
    }
    
}
Appbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        locked : state.app.locked
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        btn_click_Lock: (value) => {dispatch(actions.clickLockBtn(value))}
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Appbar));






