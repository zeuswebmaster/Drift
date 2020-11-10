import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';

import { connect } from 'react-redux';
import * as actions from '../../../actions';


import { withStyles } from '@material-ui/core/styles';
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



const styles = theme => ({
    mapoverview: {
        height: 'calc((100% - 64px) / 960 * 448)',
        overflow: 'auto',
        backgroundColor: '#FDFDFD',
    },
    buttonItem: {
        position: 'absolute',
        right: theme.spacing.unit * 1,
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
});

class Mapoverview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transform: {k: 1, x: 0, y: 0},
            redraw: true
        }
        this.changeTransform = this.changeTransform.bind(this);
    }

    componentDidMount() {
        this.createMapView();
    }

    componentDidUpdate(prevProps) {
        if (this.state.redraw) {
            this.createMapView();
        }
    }

    changeTransform(transform) {
        this.setState(Object.assign({}, this.state, {
            transform: transform,
            redraw: false
        }));
    }    

    createMapView() {

        const {
            scale_min,
            scale_max,
            image,
            image_width,
            image_height,
        } = this.props;
        var classname = "." + this.props.name;

        var changeTransform = this.changeTransform;
        var transform = this.state.transform;

        var parentNode = this.node.parentNode;

        if (image.length === 0) {
            console.log("There is no image!");
            return;
        }

        var margin = {top: 0, right: 0, bottom: 0, left: 0};
        var width = parentNode.clientWidth - margin.left - margin.right;
        var height = parentNode.clientHeight - margin.top - margin.bottom;

        var ratio_width = Math.floor(width / image_width);
        var ratio_height = Math.floor(height / image_height);
        var ratio = (ratio_width > ratio_height) ? ratio_height : ratio_width;
        ratio = (ratio > scale_max) ? scale_max : ratio;

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

        // var pos_x = (width - image_width) / 2;
        // var pos_y = (height - image_height) / 2;
        var pos_x = (width - image_width*ratio) / 2;
        var pos_y = (height - image_height*ratio) / 2;
        
        g.append("image")
            // .attr("id", "cropped-image")
            .attr("xlink:href", image)
            .attr("width", image_width*ratio)
            .attr("height", image_height*ratio)
            .attr("transform", "translate(" + pos_x + "," + pos_y + ")");

        d3.select('#zoom_out').on('click', zoomClick);
        d3.select('#zoom_in').on('click', zoomClick);

        d3.select(window).on('resize', resize);

        function resize() {
            width = parentNode.clientWidth - margin.left - margin.right;
            height = parentNode.clientHeight - margin.top - margin.bottom;

            var ratio_width = Math.floor(width / image_width);
            var ratio_height = Math.floor(height / image_height);
            var ratio = (ratio_width > ratio_height) ? ratio_height : ratio_width;
            ratio = (ratio > scale_max) ? scale_max : ratio;

            svg = d3.select(classname)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .call(zoom);
        
            g = svg.select("g");
    
            g.select("rect")
                .attr("width", width)
                .attr("height", height);

            pos_x = (width - image_width*ratio) / 2;
            pos_y = (height - image_height*ratio) / 2;
            g.select("image")
                .attr("width", image_width*ratio)
                .attr("height", image_height*ratio)
                .attr("transform", "translate(" + pos_x + "," + pos_y + ")");
        }

        function zoomed() {
            // console.log("machinearea zoomed ", d3.event.transform);
            g.attr("transform", d3.event.transform);
            changeTransform(d3.event.transform);
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
        const { classes } = this.props;
        return (
            <React.Fragment>
                <div className={classes.mapoverview}>
                    <div className={classes.buttonItem}>
                        <Link to={!this.props.mapButtonDisable ? "/map" : "#"} style={{color: "black"}}>
                            <IconButton 
                                className={classes.mapButton} 
                                color="inherit" 
                                aria-label="Map" 
                                disabled={this.props.mapButtonDisable} 
                                onClick={this.props._handleShowMap}
                            >
                                <MapIcon />
                            </IconButton>
                        </Link>

                        <Link to="/machine" style={{color: "black"}}>
                            <IconButton 
                                className={classes.machine_addButton} 
                                color="inherit" 
                                disabled={this.props.machineButtonDisable} 
                                onClick={this.props._handleShowMachine}
                            >
                                <DomainIcon />
                                <AddIcon style={{height: 10, width: 10, marginTop: -15, marginLeft: -5}}/>
                            </IconButton>
                        </Link>
                    
                        <Link to="/inputadd" style={{color: "black"}}>
                            <IconButton 
                                className={classes.input_addButton} 
                                color="inherit" 
                                disabled={this.props.inputButtonDisable} 
                                onClick={this.props._handleShowInputAdd}
                            >
                                <KeyboardTabIcon />
                                <AddIcon style={{height: 10, width: 10, marginTop: -15, marginLeft: -3}}/>
                            </IconButton>
                        </Link>
                    </div>
                    
                    <svg className={classname} ref={node => this.node=node} />

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
                   
                </div>
            </React.Fragment>
        );
    }
}

Mapoverview.defaultProps = {
    name:       "",
    width:      752,
    height:     420,
    margin:     {top: 0, right: 0, bottom: 0, left: 0},
    scale_min:  1.0,
    scale_max:  4.0,
    image:      "",
    image_width: 0,
    image_height: 0,
    redraw:     true
};


Mapoverview.propTypes = {
    name:       PropTypes.string,
    width:      PropTypes.number,
    height:     PropTypes.number,
    margin:     PropTypes.object,
    scale_min:  PropTypes.number,
    scale_max:  PropTypes.number,
    image:      PropTypes.string,
    image_width:    PropTypes.number,
    image_height:   PropTypes.number,
    redraw:     PropTypes.bool,
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        image: state.app.mapCropImage,
        image_width: state.app.mapCropImageWidth,
        image_height: state.app.mapCropImageHeight,
        brightness: state.app.mapBrightness,
        contrast: state.app.mapContrast,
        sepia: state.app.mapSepia,
        saturation: state.app.mapSaturation,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Mapoverview));