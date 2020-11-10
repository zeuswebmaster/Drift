import React, { Component } from 'react';
import * as d3 from 'd3';
import { Link } from 'react-router-dom';
import Draggable from 'react-draggable';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { withStyles } from '@material-ui/core';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import MapIcon from '@material-ui/icons/Map';
import DomainIcon from '@material-ui/icons/Domain';
import KeyboardTabIcon from '@material-ui/icons/KeyboardTab';
import AddIcon from '@material-ui/icons/Add';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import ClearIcon from '@material-ui/icons/Clear';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    machinearea: {
        width: '100%',
        height: '100%',
        zIndex: '-1'
    },
    button: {
        padding: '10px 20px'
    },
    title: {
        fontSize: '18px',
    },
    titlebutton: {
        position: 'relative',
        width: '280px',
        top: '0px',
        left: '0px',
    },
    buttons: {
        marginTop: '-32px',
        float: 'right',
    },
    button: {
        margin: theme.spacing.unit,
        width: '16px',
        height: '16px',
    },
    actionbutton: {
        position: 'relative',
        width: '142px',
        height: '32px',
        top : '0px',
        left : '0px',
    },
    actions: {
        marginRight: '-13px',   
    },
    Icon: {
        height: '35px',
        width: '35px',
    },
    link: {
        textDecoration: 'none',
    },  
    rendertitle: {
        position: 'absolute',
        fontSize: '14px',
        width: '160px',
        left: 'calc((100% - 160px) / 2)',
        top: theme.spacing.unit * 10,
    },
    renderbuttons: {
        position: 'relative',
        top: '0px',
        left: '0px',
        textAlign: 'center', 
        width: '203px',
        height: '30px',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    renderbuttontitle: {
        fontSize: '18px',
        float: 'left',
        marginTop: '5px',
        marginLeft: '10px',
    },
    rendermark: {
        transform: 'rotate(90deg)',
        position: 'relative',
        top: '9px',
        left: '-124px',
        fontSize: 'small',
    },
    renderbutton: {
        margin: '5px',
        width: '14px',
        height: '14px',
        marginButtom: '3px',
    },
    zoombuttons: {
        position: 'absolute',
        right: '0px',
        top: 'calc((50% / 512 * 430))', 
    },
    zoomIcon: {
        backgroundColor: '#9B9B9B', 
        color: 'white',
        borderRadius: '5px',
        marginTop: '-3px',
    },
    zoomin: {
        padding: '0px',
    },
    zoomout: {
        position: 'relative',
        top: '21px',
        left: '-24px',
        padding: '0px',
    },
    percent_mark: {
        position: 'relative',
        width: '38px',
        height: '55px'
    },
    plantviewpaper_mark: {
        position: 'relative',
        width: '38px',
        height: '55px',
        top: '0px',
        left: '0px',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        cursor: 'pointer',
    },
    plantviewmark: {
        position: 'relative',
        transform: 'rotate(270deg)',
        float: 'right',
        width: 'calc(100% / 38 * 10)',
        marginRight: '4px',
        marginTop: '-8px',
    },
    plantviewpercentage: {
        position: 'relative',
        width: 'calc(100% / 38 * 20)',
        height: 'calc(100% / 55 * 12)',
        top: 'calc(100% / 55 * 8)',
        left: 'calc((100% - 24px) / 2)',
    },
});


class MachineArea extends Component {

    constructor(props) {
        super(props);
        this.changeTransform = this.changeTransform.bind(this);
        this.changeImgCenterPos = this.changeImgCenterPos.bind(this);
        this.clickLeftBtn = this.clickLeftBtn.bind(this);
        this.clickRightBtn = this.clickRightBtn.bind(this);

        this.state = {
            transform: {k: 1, x: 0, y: 0},
            img_center: [this.props.width/2, this.props.height/2],
            redraw: true
        }
    }
    
    componentDidMount() {
        this.createMachineView();
    }

    componentDidUpdate(prevProps) {
        if (this.state.redraw) {
            this.createMachineView();
        }
    }

    changeTransform(transform) {
        // console.log("transform changed ", transform);
        // this.props._update_machine_transform(transform, false);
        this.setState(Object.assign({}, this.state, {
            transform: transform,
            redraw: false
        }));
    }

    changeImgCenterPos(pos, redraw) {
        this.setState(Object.assign({}, this.state, {
            img_center: pos,
            redraw: redraw
        }));        
    }

    clickLeftBtn() {
        this.setState(Object.assign({}, this.state, {redraw: true}));
        this.props.onClickLeftBtn();
    }

    clickRightBtn() {
        this.setState(Object.assign({}, this.state, {redraw: true}));
        this.props.onClickRightBtn();
    }

    createMachineView() {

        const {
            scale_min,
            scale_max,
            image,
            image_width,
            image_height,
            angle,
            showZoomBtn
        } = this.props;
        var classname = "." + this.props.name;

        var changeTransform = this.changeTransform;
        var changeImgCenterPos = this.changeImgCenterPos;
        var transform = this.state.transform;

        var parentNode = this.node.parentNode;
        
        var margin = {top: 0, right: 0, bottom: 0, left: 0};
        var width = parentNode.clientWidth - margin.left - margin.right;
        var height = parentNode.clientHeight - margin.top - margin.bottom;
        var center = [width/2, height/2];

        var zoom = d3.zoom().scaleExtent([scale_min, scale_max]).on("zoom", zoomed);

        var svg;
        svg = d3.select(classname)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .call(zoom);
            // .on("wheel.zoom", null);

        var g = svg.select("g");
        if (g) {
            g.remove();
        }        
        g = svg.append("g")
            .attr("transform", "translate("+transform.x+","+transform.y+")scale("+transform.k+")");

        g.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")

        var pos_x = (width - image_width) / 2;
        var pos_y = (height - image_height) / 2;
        
        g.append("image")
            .attr("xlink:href", image)
            .attr("width", image_width)
            .attr("height", image_height)
            .attr("transform", "translate(" + pos_x + "," + pos_y + ")");

        d3.select('#zoom_out').on('click', zoomClick);
        d3.select('#zoom_in').on('click', zoomClick);

        d3.select(window).on('resize', resize);

        function resize() {
            width = parentNode.clientWidth - margin.left - margin.right;
            height = parentNode.clientHeight - margin.top - margin.bottom;
    
            svg = d3.select(classname)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .call(zoom);
        
            g = svg.select("g");
    
            g.select("rect")
                .attr("width", width)
                .attr("height", height);

            pos_x = (width - image_width) / 2;
            pos_y = (height - image_height) / 2;
            g.select("image")
                .attr("width", image_width)
                .attr("height", image_height)
                .attr("transform", "translate(" + pos_x + "," + pos_y + ")");

            imgCenterPos(transform, true);
        }

        function zoomed() {
            // console.log("machinearea zoomed ", d3.event.transform);
            g.attr("transform", d3.event.transform);
            changeTransform(d3.event.transform);

            imgCenterPos(d3.event.transform, false);
        }

        function imgCenterPos(transform, redraw) {
            let center = [width / 2, height / 2];
            let img_center = [center[0] * transform.k + transform.x,
                            center[1] * transform.k + transform.y];
            // console.log("New position after transform is ", transform, width, height, img_center);
            changeImgCenterPos(img_center, redraw);
        }

        function interpolateZoom (newview) {
            let view = d3.zoomTransform(svg.node());
            // console.log("interpolateZoom ", view, newview);
            
            d3.transition().duration(750).tween("zoom", function () {
                var iX = d3.interpolate(view.x, newview.x),
                iY = d3.interpolate(view.y, newview.y),
                iK = d3.interpolate(view.k, newview.k);
                // console.log("interpolateZoom ", iX, iY, iK);
                return function (t) {
                    svg.attr("transform",
                        "translate(" + iX(t) + "," + iY(t) + ")" +
                        "scale(" + iK(t) + ")"
                    );
                };
            });
        }

        function zoomClick() {
            let clicked = d3.event.target,
                direction = 1,
                factor = 0.2,
                target_zoom = 1,
                center = [width / 2, height / 2],
                extent = zoom.scaleExtent(),
                translate0 = [],
                l = [];
            let view = d3.zoomTransform(svg.node());
            // console.log("zoomClick extent ", extent);
            let newview = {k: view.k, x: view.x, y: view.y};

            d3.event.preventDefault();
            direction = (this.id === 'zoom_in') ? 1 : -1;
            target_zoom = view.k * (1 + factor * direction);

            if (target_zoom < extent[0]) {
                target_zoom = extent[0];
            }
            if (target_zoom > extent[1]) {
                target_zoom = extent[1];    
            }

            // console.log("zoomClick running ", view);

            translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
            newview.k = target_zoom;
            l = [translate0[0] * newview.k + view.x, translate0[1] * newview.k + view.y];

            newview.x += center[0] - l[0];
            newview.y += center[1] - l[1];

            // interpolateZoom(newview);
            // zoom.transform(svg, newview);
            svg.transition()
               .duration(750)
               .call(zoom.transform, d3.zoomIdentity.translate(newview.x, newview.y).scale(newview.k) );
        }        
    }

    render() {
        var classname = this.props.name;
        const { classes, image_width, image_height, width, height } = this.props;
        const { transform, img_center } = this.state;

        // var actionBtnPos = [img_center[0] - 71, img_center[1] + 32];
        // var titleBtnPos = [img_center[0] - 140, img_center[1] - (image_height / 2 - 64) * transform.k];
        var actionBtnPos = [img_center[0] - 71, img_center[1] - 32 - height];
        var titleBtnPos = [img_center[0] - 140, img_center[1] - (image_height / 2) * transform.k - height];

        var renderPoint=[0.2708, 0.6224];   // render point on image(1,1)
        // console.log("image center", img_center);
        var renderBtnPos = [img_center[0] + (renderPoint[0] - 0.5) * image_width * transform.k,
                            img_center[1] + (renderPoint[1] - 0.5) * image_height * transform.k - 42 - height];

        var signalBtnPos = [img_center[0] + (renderPoint[0] - 0.5) * image_width * transform.k - 38,
                            img_center[1] + (renderPoint[1] - 0.5) * image_height * transform.k - height - 55];

        return (
            <div className={classes.machinearea}>
                <svg className={classname} ref={node => this.node=node} />
                {this.props.showMachineTitle && 
                    <div className={classes.titlebutton}
                        style={{left: titleBtnPos[0], top: titleBtnPos[1]}}
                    >
                        <Typography variant="title" className={classes.title}>
                            Verpackungsmaschine
                        </Typography>
                        {this.props.showMachineConfirmBtn &&
                            <div className={classes.buttons}>
                                <Link to="/" className={classes.link}>
                                <Button
                                    className={classes.button} 
                                    variant="contained" 
                                    size="small" 
                                    color="primary" 
                                    style={{minWidth: '23px', 
                                            minHeight: '23px', 
                                            backgroundColor: '#FF4081'}} 
                                    onClick={this.props._handleCloseImg} 
                                >
                                    <Icon style={{marginTop: -5}}>close</Icon>
                                </Button>
                                </Link>

                                <Button
                                    className={classes.button}  
                                    variant="contained" 
                                    size="small" 
                                    color="primary" 
                                    style={{minWidth: '23px', minHeight: '23px', backgroundColor: '#50E3C2'}} 
                                    aria-label="Check" 
                                    onClick={this.props.onClickMachineConfirmBtn}
                                >
                                    <Icon style={{marginTop: -5}}>check</Icon>
                                </Button>
                            </div>
                        }
                    </div>
                }

                {this.props.showActionBtn &&
                    <div className={classes.actionbutton}
                        style={{left: actionBtnPos[0], top: actionBtnPos[1]}}
                    >
                    {/* <div className={classes.actionbutton}> */}
                        <IconButton 
                            className={classNames(classes.rotate_left, classes.actions)} 
                            color="inherit" 
                            onClick={this.clickLeftBtn}
                        >
                            <RotateLeftIcon className={classes.Icon}/>
                        </IconButton>

                        <IconButton 
                            className={classNames(classes.rotate_right, classes.actions)} 
                            color="inherit" 
                            onClick={this.clickRightBtn}
                        >
                            <RotateRightIcon className={classes.Icon}/>
                        </IconButton>

                        {/*<strong className={classes.cursor}>*/}
                            <IconButton 
                                className={classNames(classes.img_move, classes.actions)} 
                                color="inherit"  
                                onMouseDown={this.click_btnMove}
                            >
                                <OpenWithIcon className={classes.Icon}/>
                            </IconButton>
                        {/*</strong>*/}

                        <IconButton 
                            className={classNames(classes.img_close, classes.actions)} 
                            color="inherit" 
                            onClick={this.props._click_btnClose}
                        >
                            <ClearIcon className={classes.Icon}/>
                        </IconButton>
                    </div>
                }
                
                
                {this.props.showRenderTitle &&
                    <div className="renderview">
                        <Typography variant="title" className={classes.rendertitle}>
                            Verpackungsmaschine
                        </Typography>

                        <div className={classes.renderbuttons}
                             style={{left: renderBtnPos[0], top: renderBtnPos[1]}}
                        >
                            <Icon className={classes.rendermark}>
                                signal_cellular_4_bar
                            </Icon>

                            <Typography 
                                variant="title" 
                                className={classes.renderbuttontitle}
                            >
                                Wegnehmer 1
                            </Typography>
                            
                            <Button 
                                variant="contained" 
                                size="small" 
                                color="primary" 
                                style={{minWidth: '23px', 
                                        minHeight: '23px', 
                                        backgroundColor: '#FF4081', 
                                        marginLeft : '-4px', 
                                        top: '-3px'}} 
                                className={classes.renderbutton} 
                                onClick={this.props._close_Img}
                            >
                                <Icon style={{marginTop: -6}}>close</Icon>
                            </Button>

                            <Link to="/settings" className={classes.link}>
                                <Button 
                                    variant="contained" 
                                    size="small" 
                                    color="primary" 
                                    style={{minWidth: '23px', 
                                            minHeight: '23px', 
                                            backgroundColor: '#50E3C2', 
                                            top: '-3px'}} 
                                    aria-label="Check" 
                                    className={classes.renderbutton} 
                                    onClick={this.props._check_Img}
                                >
                                    <Icon style={{marginTop: -6}}>check</Icon>
                                </Button>
                            </Link>
                        </div>
                    </div>
                }
                {this.props.showZoomBtn &&
                    <div className={classes.zoombuttons}>
                        <Button 
                            className={classes.zoomin}
                            id="zoom_in"
                            varint="contained" 
                            size="small" 
                            color="primary" 
                            style={{minWidth: '20px', minHeight: '20px'}} 
                            // onClick={this._zoomoutImg}
                        >
                            <Icon 
                                className={classes.zoomIcon} 
                            >add_box</Icon>
                        </Button>

                        <Button 
                            className={classes.zoomout}
                            id="zoom_out"
                            varint="contained" 
                            size="small" 
                            color="primary" 
                            style={{minWidth: '20px', minHeight: '20px'}} 
                            // onClick={this._zoominImg}
                        >
                            <Icon 
                                className={classes.zoomIcon} 
                            >indeterminate_check_box</Icon>
                        </Button>
                    </div>
                }
                {this.props.showSignalBtn && 
                    <div className="plantview">
                        <Paper elevation={0} className={classes.plantviewpaper_mark} onClick={console.log("asdf")}
                               style={{left: signalBtnPos[0], top: signalBtnPos[1]}}
                        >
                        <Icon className={classes.plantviewmark}>
                            signal_cellular_4_bar
                        </Icon>
                        
                        <Typography className={classes.plantviewpercentage}>95%</Typography>
                        
                        </Paper>
                    </div>
                }
            </div>
        );
    }
}

MachineArea.defaultProps = {
    name:       "",
    width:      752,
    height:     420,
    margin:     {top: 0, right: 0, bottom: 0, left: 0},
    scale_min:  0.1,
    scale_max:  10.0,
    image:      "",
    image_width: 300,
    image_height: 300,
    angle:      0.0,
    redraw:     true
};

MachineArea.propsType = {
    name:       PropTypes.string.isrequired,
    width:      PropTypes.number,
    height:     PropTypes.number,
    margin:     PropTypes.object,
    scale_min:  PropTypes.number,
    scale_max:  PropTypes.number,
    image:      PropTypes.string,
    image_width:    PropTypes.number,
    image_height:   PropTypes.number,
    angle:      PropTypes.number,
    redraw:     PropTypes.bool,
    classes:    PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {

    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MachineArea));
