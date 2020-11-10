import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FolderIcon from '@material-ui/icons/Folder';
import Button from '@material-ui/core/Button';

import * as actions from '../../actions';
import { NONAME } from 'dns';

const fs = require("fs");
const path = require('path');
const { dialog } = require("electron").remote;


const styles = theme => ({
    newplant: {
        height: 'calc((100% - 64px) / 960 * 448)',
        overflow: 'auto',
        backgroundColor: "rgba(255, 255, 255, 0.75)",
    },
    text: {
        fontSize: '28px',
        position: 'absolute',
        left: theme.spacing.unit * 9,
    },

    formControl: {
        width: 214,
        left: theme.spacing.unit * 9,
        top: theme.spacing.unit * 9,
    },

    inputlabel: {
        color: '#00E7C0',
        fontSize: '12px',
    },

    folderButton: {
        left: theme.spacing.unit * 11,
        top: theme.spacing.unit * 9,
    },
    input: {
        display: 'none',
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


function rmdirSync(dir) {
    var list = fs.readdirSync(dir);
 
    for (var i = 0; i < list.length; i++) {
        var filename = path.join(dir, list[i]);
        var stat = fs.statSync(filename);
 
        if (filename == "." || filename == "..") {
        } else if(stat.isDirectory()) {
            rmdirSync(filename);
        } else {
            try { fs.unlinkSync(filename); } catch (e) {}
        }
    }
 
    try { fs.rmdirSync(dir); } catch (e) {}
};


class Plant extends Component {
    constructor(props){
        super(props);
        this.state = {
            name: ""
        }
        this.onPathChanged = this.onPathChanged.bind(this);
        this.onOpenFileDlg = this.onOpenFileDlg.bind(this);
        this.onClickPositionBtn = this.onClickPositionBtn.bind(this);
    }

    onPathChanged(value) {
        this.setState ({ name: value });
    };
    
    
    onOpenFileDlg() {

        //------------------ file read -------------//
        dialog.showOpenDialog((filename) => {
            if (filename ===  undefined) {
                console.log("No files were selected");
                return;
            }

            this.setState ({ name: filename });
        });
    }

    onClickPositionBtn() {
        const filepath = this.state.name;
        if (filepath.length <= 0) {
            console.log("Invalid file");
            return;
        }
        this.props.btn_click_position;
        this.openMachine(filepath);
    }

    openMachine(filepath) {
        const StreamZip = require('node-stream-zip');
        const zip = new StreamZip({
            file: `${filepath}`,
            storeEntries: true
        });

        const update_machine = this.props._update_machine;

        zip.on('error', err => {
            console.log("error on zip: ", err);
        });

        zip.on('ready', () => {

            // remove temp dir and create it
            let tempDir = 'extracted';
            if (fs.existsSync(tempDir)) {
                rmdirSync(tempDir);
            }
            fs.mkdirSync(tempDir);

            // Take a look at the files and write it to the temp folder
            let filepath, content;
            console.log('Entries read:' + zip.entriesCount);
            for (const entry of Object.values(zip.entries())) {
                const desc = entry.isDirectory ? 'directory' : `${entry.size} bytes`;
                console.log(`Entry ${entry.name}: ${desc}`);

                filepath = './' + tempDir + '/' + entry.name;
                let content = zip.entryDataSync(entry.name);

                fs.writeFileSync(filepath, content);            
            }

            // Read a file in memory
            let jsonContents = zip.entryDataSync('machine.json');
            console.log("The content of machine.json is: " + jsonContents);

            // Close the file
            zip.close();

            let confMachine = JSON.parse(jsonContents);
            update_machine(confMachine, tempDir);
        });

        zip.on('extract', (entry, file) => {
            console.log(`Extracted ${entry.name} to ${file}`);
        });
    }
    

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.newplant}>
                <div className="plant">
                    <Typography gutterBottom className={classes.text}>
                        Neuen Anlage hinzufügen
                    </Typography>

                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple" className={classes.inputlabel}>Datenquelle</InputLabel>
                        <Input id="name-simple" 
                            placeholder={"Select a machine zip file..."}
                            value={this.state.name}
                            onChange={ (e) => this.onPathChanged(e.target.value)} />
                    </FormControl>

                    <IconButton className={classes.folderButton} color="inherit" 
                            onClick={this.onOpenFileDlg} component="span">
                        <FolderIcon />
                    </IconButton>
                </div>
                <div className={classes.textButton}>
                    <Link to="/" className={classes.link}>
                        <Button 
                            className={classes.button_abb} 
                            style={{color: '#9B9B9B'}} 
                            onClick={this.props._btnclickAbb_Plan}
                        >Abbrechen</Button>
                    </Link>
                    
                    <Link to={(this.state.name === "") ? "#" : "/packagingmachine"} className={classes.link} style={{color: 'black'}}>
                        <Button 
                            className={classes.button_Pos} 
                            color="inherit" 
                            onClick={this.onClickPositionBtn}
                        >Positionieren</Button>
                    </Link>
                </div>
            </div>
        );
    }
}

Plant.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return{
        machine: state.app.machine,
        // image: state.app.image
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        _update_machine: (machine, dir) => {
            dispatch(actions.updateMachine(machine, dir))
        },
        btn_click_position: () => {dispatch(actions.clickPositionBtn())}
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Plant));
