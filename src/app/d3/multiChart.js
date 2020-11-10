/* eslint-disable */
// --> EsLint OFF
const React = require("react");
const d3 = require("d3");
const crossfilter = require("crossfilter");
const assert = require('assert');
const PropTypes = require('prop-types');

const styles = {
  chart: {
    width: "600",
    // height: "540",
    height: "300",
  },
  navChart: {
    stroke: "rgba(0,0,0,.2)",
    strokeWidth: 1
  },
  controls: {
    width: 80,
    height: 15,
    top: 5,
    fontSize: 10,
    stroke: "#1E3239",
    strokeWidth: 1
  },
  liveButton: {
    width: 70,
    height: 15,
    fontSize: 10,
    top: 5,
    x: 0,
    buttonFill: ["#00C4FF", "white"],
    text: ["Live View"],
    textFill: ["white", "#00C4FF"],
    stroke: ["none", "#00C4FF"],
    strokeWidth: 1
  },
  arrow: {
    width: 5,
    stroke: "#1E3239",
    strokeWidth: 2.5,
    offset: 40
  },
  axisY1: {
    stroke: "#00C4FF",
    strokeWidth: 1
  },
  axisY2: {
    stroke: "#1E3239",
    strokeWidth: 1
  },
  axisText: {
    fontFamily: "Roboto",
    fontSize: '10px',
    fill: "#1E3239"
  },
  grid: {
    visible: "rgba(0,0,0,.1)",
    visibleWidth: 1,
    switching: "rgba(0,150,150,.2)",
    switchingWidth: 0.5
  },
  line: {
    stroke: "#979797",
    strokeWidth: 2
  },
  pin: {
    r: 3,
    stroke: "#00C4FF",
    strokeWidth: 1
  },
  pinToLine: {
    r: 3,
    stroke: "#1E3239",
    strokeDashArray: 1,
    strokeWidth: 0.5
  },
  brushes: {
    color: "#00E8C2"
  }
};


// COMPONENT
class PreProcessor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      dataReduced: [],
      dataReduced2: [],
      cfdata: {},
      cfdata_values: {},
      cfdata_times: {},
      cfdata_red: {},
      cfdata_times_red: {},
      cfdata_red2: {},
      cfdata_times_red2: {}
    };

    this.rDataCounter = 0;
    this.rDataCounter2 = 0;
    this.processData(props);
  }
  shouldComponentUpdate(nextProps,nextState) {
  //  if(this.props.lernsets !== nextProps.lernsets) {
  //   return false
  //  }
    return true
  }

  changeLernset(key, value) {
    this.props.changeLernset(key, value);
  }

  componentWillReceiveProps(nextProps) {
    this.processData(nextProps);
  }

  processData(object) {
    var max_counter = 4;
    var max_counter2 = 40;

    if (!this.min) {
      this.rDataCounter = 0;
      this.rDataCounter2 = 0;
      this.min = object.data.slice(0, 1);
      this.max = object.data.slice(0, 1);
      this.min2 = object.data.slice(0, 1);
      this.max2 = object.data.slice(0, 1);
      //this.state.dataReduced = [];
      //this.state.dataReduced2 = [];
      this.first = true;
    }
    else { this.first = false }

    // initializing
    if ((this.state.data == undefined || object.data.length === this.state.data.length) && this.first == true) {

      this.state.data = object.data.slice();
      this.state.dataReduced.push(this.state.data.slice(0, 1)[0]);
      this.state.dataReduced2.push(this.state.data.slice(0, 1)[0]);

      for (let i = 0; i < this.state.data.length; ++i) {
        this.rDataCounter += 1;
        this.rDataCounter2 += 1;
        if (this.state.data[i].value > this.max[0].value) {
          this.max = this.state.data.slice(i, i + 1);
          if (this.max[0].value > this.max2[0].value) {
            this.max2 = this.state.data.slice(i, i + 1);
          }
        }
        if (this.state.data[i].value < this.min[0].value) {
          this.min = this.state.data.slice(i, i + 1);
          if (this.min[0].value < this.min2[0].value) {
            this.min2 = this.state.data.slice(i, i + 1);
          }
        }
        if (this.rDataCounter == max_counter) {
          this.rDataCounter = 0;


          if (this.min[0].time < this.max[0].time) {
            this.state.dataReduced.push(this.min[0])
            this.state.dataReduced.push(this.max[0])
          }
          else {
            this.state.dataReduced.push(this.max[0])
            this.state.dataReduced.push(this.min[0])
          }
          let tmp = this.min;
          this.min = this.max;
          this.max = tmp;
        }


        if (this.rDataCounter2 == max_counter2) {
          this.rDataCounter2 = 0;

          if (this.min2[0].time < this.max2[0].time) {
            this.state.dataReduced2.push(this.min2[0])
            this.state.dataReduced2.push(this.max2[0])
          }
          else {
            this.state.dataReduced2.push(this.max2[0])
            this.state.dataReduced2.push(this.min2[0])
          }
          let tmp2 = this.min2;
          this.min2 = this.max2;
          this.max2 = tmp2;
        }
      }

      this.state.cfdata = crossfilter(this.state.data);

      this.state.cfdata_times = this.state.cfdata.dimension(function (d) {
        return d.time;
      });
      this.state.cfdata_values = this.state.cfdata.dimension(function (d) {
        return d.value;
      });

      this.state.cfdata_red = crossfilter(this.state.dataReduced);
      this.state.cfdata_times_red = this.state.cfdata_red.dimension(function (d) {
        return d.time;
      });


      this.state.cfdata_red2 = crossfilter(this.state.dataReduced2);
      this.state.cfdata_times_red2 = this.state.cfdata_red2.dimension(function (d) {
        return d.time;
      });



    }
    //updating
    else {
      let diffLength = object.data.length - this.state.data.length;
      if (diffLength !== 0) {
        var diffObjectData = object.data.slice(-diffLength);
        Array.prototype.push.apply(this.state.data, diffObjectData);

        for (let i = 0; i < diffObjectData.length; ++i) {
          this.rDataCounter += 1;
          this.rDataCounter2 += 1;
          if (diffObjectData[i].value > this.max[0].value) {
            this.max = diffObjectData.slice(i, i + 1);
            if (this.max[0].value > this.max2[0].value) {
              this.max2 = this.max.slice(-1);
            }
          }
          if (diffObjectData[i].value < this.min[0].value) {
            this.min = diffObjectData.slice(i, i + 1);
            if (this.min[0].value < this.min2[0].value) {
              this.min2 = this.min.slice(-1);
            }
          }
          if (this.rDataCounter == max_counter) {
            this.rDataCounter = 0;


            if (this.min[0].time < this.max[0].time) {
              this.state.dataReduced.push(this.min[0])
              this.state.dataReduced.push(this.max[0])
            }
            else {
              this.state.dataReduced.push(this.max[0])
              this.state.dataReduced.push(this.min[0])
            }

            this.state.cfdata_red.add([this.min[0],this.max[0]]);
            let tmp = this.min;
            this.min = this.max;
            this.max = tmp;
          }

          if (this.rDataCounter2 == max_counter2) {
            this.rDataCounter2 = 0;

            if (this.min2[0].time < this.max2[0].time) {
              this.state.dataReduced2.push(this.min2[0])
              this.state.dataReduced2.push(this.max2[0])
            }
            else {
              this.state.dataReduced2.push(this.max2[0])
              this.state.dataReduced2.push(this.min2[0])
            }

            this.state.cfdata_red2.add([this.min2[0],this.max2[0]]);

            let tmp2 = this.min2;
            this.min2 = this.max2;
            this.max2 = tmp2;
          }

        }
        for (let i = this.state.data.length - diffLength - 1; i < this.state.data.length; ++i) {
          this.state.cfdata.add([this.state.data[i]]);
        }
      }

    }

  }

	render() {
    const { lernsets, mode } = this.props;
    const { data, dataReduced, dataReduced2, cfdata, cfdata_times,
      cfdata_values, cfdata_red, cfdata_red2, cfdata_times_red, cfdata_times_red2 } = this.state;

		return (
      <div>
        {mode === 'normal' &&
          <div>
            <MultiChart
              data={data}
              dataReduced={dataReduced}
              dataReduced2={dataReduced2}
              cfdata={cfdata}
              cfdata_times={cfdata_times}
              cfdata_values={cfdata_values}
              cfdata_red={cfdata_red}
              cfdata_red2={cfdata_red2}
              cfdata_times_red={cfdata_times_red}
              cfdata_times_red2={cfdata_times_red2}
              mode="normal"
              />
          </div>}
        {mode === 'alternative' &&
          <MultiChart
            data={data}
            dataReduced={dataReduced}
            dataReduced2={dataReduced2}
            cfdata={cfdata}
            cfdata_times={cfdata_times}
            cfdata_values={cfdata_values}
            cfdata_red={cfdata_red}
            cfdata_red2={cfdata_red2}
            cfdata_times_red={cfdata_times_red}
            cfdata_times_red2={cfdata_times_red2}
            sets={lernsets}
            mode="alternative"
            changeLernset={this.changeLernset.bind(this)}
            />
        }
      </div>
		);
	}
}

if (process.env.NODE_ENV === 'developement') {
  PreProcessor.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    mode: PropTypes.string.isRequired,
    lernsets: PropTypes.arrayOf(PropTypes.object),
    changeLernset: PropTypes.func
  };

  PreProcessor.defaultProps = {
    lernsets: [],
    changeLernset: () => {},
  }
}

// EXPORT
module.exports = PreProcessor;

// data reducing function
// reduce an array by distance measure
function reduceData(points, sqTolerance = 500 * 500, highestQuality = false) {
  // check parameters
  if (points.length <= 2) return points;

  // functions
  // square distance between 2 points
  function distance(p1, p2) {
    var dtime = p1.time / 1000 - p2.time / 1000,
      dvalue = p1.value - p2.value;

    return dtime * dtime + dvalue * dvalue;
  }

  // square distance from a point to a segment
  function point2segmentDistance(p, p1, p2) {
    var time = p1.time / 1000,
      value = p1.value,
      dtime = p2.time / 1000 - time,
      dvalue = p2.value - value;

    if (dtime !== 0 || dvalue !== 0) {
      var t =
        ((p.time - time) * dtime + (p.value - value) * dvalue) /
        (dtime * dtime + dvalue * dvalue);

      if (t > 1) {
        time = p2.time / 1000;
        value = p2.value;
      } else if (t > 0) {
        time += dtime * t;
        value += dvalue * t;
      }
    }

    dtime = p.time / 1000 - time;
    dvalue = p.value - value;

    return dtime * dtime + dvalue * dvalue;
  }

  // distance-based reduction
  function RadialDist(points, sqTolerance) {
    var prevPoint = points[0],
      newPoints = [prevPoint],
      point;

    for (var i = 1, len = points.length; i < len; i++) {
      point = points[i];

      if (distance(point, prevPoint) > sqTolerance) {
        newPoints.push(point);
        prevPoint = point;
      }
    }

    if (prevPoint !== point) newPoints.push(point);

    return newPoints;
  }

  function DPStep(points, first, last, sqTolerance, simplified) {
    var maxSqDist = sqTolerance,
      index;

    for (var i = first + 1; i < last; i++) {
      var sqDist = point2segmentDistance(
        points[i],
        points[first],
        points[last]
      );

      if (sqDist > maxSqDist) {
        index = i;
        maxSqDist = sqDist;
      }
    }

    if (maxSqDist > sqTolerance) {
      if (index - first > 1)
        DPStep(points, first, index, sqTolerance, simplified);
      simplified.push(points[index]);
      if (last - index > 1)
        DPStep(points, index, last, sqTolerance, simplified);
    }
  }

  // Ramer-Douglas-Peucker reduction
  function DouglasPeucker(points, sqTolerance) {
    var last = points.length - 1;

    var simplified = [points[0]];
    DPStep(points, 0, last, sqTolerance, simplified);
    simplified.push(points[last]);

    return simplified;
  }

  // points reduction
  points = highestQuality ? points : RadialDist(points, sqTolerance);
  points = DouglasPeucker(points, sqTolerance);

  return points;
}

// reduce an array by distance measure
function reduceData_old(
  points,
  sqTolerance = 500 * 500,
  highestQuality = false
) {
  // check parameters
  if (points.length <= 2) return points;

  // functions
  // square distance between 2 points
  function distance(p1, p2) {
    var dtime = p1.time / 1000 - p2.time / 1000,
      dvalue = p1.value - p2.value;

    return dtime * dtime + dvalue * dvalue;
  }

  // square distance from a point to a segment
  function point2segmentDistance(p, p1, p2) {
    var time = p1.time / 1000,
      value = p1.value,
      dtime = p2.time / 1000 - time,
      dvalue = p2.value - value;

    if (dtime !== 0 || dvalue !== 0) {
      var t =
        ((p.time - time) * dtime + (p.value - value) * dvalue) /
        (dtime * dtime + dvalue * dvalue);

      if (t > 1) {
        time = p2.time / 1000;
        value = p2.value;
      } else if (t > 0) {
        time += dtime * t;
        value += dvalue * t;
      }
    }

    dtime = p.time / 1000 - time;
    dvalue = p.value - value;

    return dtime * dtime + dvalue * dvalue;
  }

  // distance-based reduction
  function RadialDist(points, sqTolerance) {
    var prevPoint = points[0],
      newPoints = [prevPoint],
      point;

    for (var i = 1, len = points.length; i < len; i++) {
      point = points[i];

      if (distance(point, prevPoint) > sqTolerance) {
        newPoints.push(point);
        prevPoint = point;
      }
    }

    if (prevPoint !== point) newPoints.push(point);

    return newPoints;
  }

  function DPStep(points, first, last, sqTolerance, simplified) {
    var maxSqDist = sqTolerance,
      index;

    for (var i = first + 1; i < last; i++) {
      var sqDist = point2segmentDistance(
        points[i],
        points[first],
        points[last]
      );

      if (sqDist > maxSqDist) {
        index = i;
        maxSqDist = sqDist;
      }
    }

    if (maxSqDist > sqTolerance) {
      if (index - first > 1)
        DPStep(points, first, index, sqTolerance, simplified);
      simplified.push(points[index]);
      if (last - index > 1)
        DPStep(points, index, last, sqTolerance, simplified);
    }
  }

  // Ramer-Douglas-Peucker reduction
  function DouglasPeucker(points, sqTolerance) {
    var last = points.length - 1;

    var simplified = [points[0]];
    DPStep(points, 0, last, sqTolerance, simplified);
    simplified.push(points[last]);

    return simplified;
  }

  // points reduction
  points = highestQuality ? points : RadialDist(points, sqTolerance);
  points = DouglasPeucker(points, sqTolerance);

  return points;
}

class MultiChart extends React.Component {
  componentDidMount() {
    this.parent = d3.select(this.chart);
    this.svg = new chart(this.parent);
    this.svg.init(this.props);
   // this.svg.plot(this.props); // TBD Workaround has to be fixed


   this.chart.addEventListener("set:update", event => {
     this.props.changeLernset("lernsets", { type: "update", sets: event.sets });
  });

 //   this.chart.addEventListener("set:delete", event => {
 //     this.props.changeLernset("lernsets", { type: "delete", set: event.set });
 //   });
  }

  componentWillReceiveProps(nextProps) {
    this.svg.plot(nextProps);
  }

  render() {
    return (
      <div
        ref={ref => {
          this.chart = ref;
        }}
      />
    );
  }
}

function chart(parent) {
  this.margin = { top: 25, right: 80, bottom: 105, left: 90 };
  this.margin2 = { top: 220, right: 80, bottom: 20, left: 90 };
  this.width = parent.node().clientWidth - this.margin.left - this.margin.right;
  this.width2 = parent.node().clientWidth - this.margin2.left - this.margin2.right;

  this.height = styles.chart.height - this.margin.top - this.margin.bottom;
  this.height2 = styles.chart.height - this.margin2.top - this.margin2.bottom;

  this.parent = parent;

  this.parent.style("position", "relative");

  this.svg =
    d3
    .select(parent.node())
    .append("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
    .style('position', 'relative')
    .style('top', 0)
    .style('left', 0);



  this.svg
    .append("g")
    .attr(
    "transform",
    "translate(" + this.margin.left + "," + this.margin.top + ")"
    );

  this.axes = this.svg
    .append("g")
    .attr(
      "transform",
      `translate(${this.margin.left},${this.margin.top})`
    );

  this.infoWindow = d3
    .select(parent.node())
    .append("div")
    .classed("info-window", true)
    .style("position", "absolute")
    .style("opacity", 0)
    .style("z-index", "-1");

  // set the ranges
  this.xF = d3.scaleUtc().range([0, this.width]);
  this.xC = d3.scaleUtc().range([0, this.width2]);

  this.yF = d3.scaleLinear().range([this.height, 0]);
  this.yF2 = d3
    .scaleLinear()
    .range([this.height, 0])
    .domain([0, 105]);
  this.yC = d3.scaleLinear().range([this.height2, 0]);

  // define the lines
  // view chart
  this.line = d3
    .line()
    .x(d => this.xF(d.time))
    .y(d => this.yF2(d.process_quality ? d.process_quality * 100 : 100));

  this.line1 = d3
    .line()
    .x(d => this.xF(d.time))
    .y(d => this.yF(d.value));

  // nav chart
  this.line2 = d3
    .line()
    .x(d => this.xC(d.time))
    .y(d => this.yC(d.value));

  this.id = Math.round(Math.random() * 10000);

  // /////////Create DEFS elements//////////

  this.defs = this.svg.append("defs");

  // Window for Zoom
  this.defs
    .append("clipPath")
    .attr("id", "clip" + this.id)
    .append("rect")
    .attr("width", this.width)
    .attr("height", this.height);

  // window for nav chart
  this.defs
    .append("clipPath")
    .attr("id", "clipNav" + this.id)
    .append("rect")
    .attr("width", this.width2)
    .attr("height", this.height2);

  // window for brush
  this.defs
    .append("clipPath")
    .attr("id", "brush-rect" + this.id)
    .append("rect")
    .attr("x", 0)
    .attr("width", this.width2)
    .attr("height", this.height2);

  // shadow filter for brush
  this.defs
    .append("filter")
    .attr("id", "shadow" + this.id)
    .append("feDropShadow")
    .attr("dy", 2)
    .attr("dx", 0)
    .attr("stdDeviation", "2");

  // motion filter
  this.defs
    .append("filter")
    .attr("id", "motionBlur" + this.id)
    .attr("width", "300%")
    .attr("x", "-100%")
    .attr("color-interpolation-filters", "sRGB")
    .append("feGaussianBlur")
    .attr("class", "blurValues")
    .attr("in", "SourceGraphic")
    .attr("stdDeviation", "0 0");

  // arrow
  let w = styles.arrow.width;

  this.defs
    .append("g")
    .attr("id", "arrow" + this.id)
    .append("path")
    .attr("d", `M ${w} ${-w} L 0 0 L${w} ${w}`)
    .style("cursor", "pointer")
    .style("fill", "transparent")
    .style("stroke", styles.arrow.stroke)
    .style("stroke-width", styles.arrow.strokeWidth);

  this.defs
    .append("clipPath")
    .attr("id", "clip-axes" + this.id)
    .append("rect")
    .attr('x', -20)
    .attr('y', -this.height)
    .attr("width", this.width + 40)
    .attr("height", this.height + 60);


  this.svg
    .append("rect")
    .attr("class", "zoom")
    .attr("width", this.width)
    .attr("height", this.height)
    .attr(
    "transform",
    "translate(" + this.margin.left + "," + this.margin.top + ")"
    )
    .attr("fill", "none")
    .attr("pointer-events", "all");

  this.focus = this.svg
    .append("g")
    .attr("class", "focus")
    .attr('clip-path', `url(#clip${this.id})`)
    .attr("filter",`url(#motionBlur${this.id})`)
    .attr(
    "transform",
    "translate(" + this.margin.left + "," + this.margin.top + ")"
    );

  this.context = this.svg
    .append("g")
    .attr("class", "context")
    .attr(
    "transform",
    "translate(" + this.margin2.left + "," + this.margin2.top + ")"
    );

  this.zoomLevel = 1;

  // parametres of w/d/h/m zoom levels
  this.zoomLevels = [
    {
      mode: "w",
      interval: d3.timeWeek,
      offset: 1,
      grid: d3.timeDay,
      gridOffset: 7,
      format: d3.timeFormat("%d.%m"),
      tickInterval: d3.timeDay
    },
    {
      mode: "d",
      interval: d3.timeDay,
      offset: 1,
      grid: d3.timeInterval(
        function (date) {
          let period = 36e5 * 3;
          var offset = (date.getTimezoneOffset() * 6e4) % period;
          if (offset < 0) offset += period;
          date.setTime(Math.floor((+date - offset) / period) * period + offset);
        },
        function (date, step) {
          date.setTime(+date + step * 3 * 36e5);
        },
        function (start, end) {
          return (end - start) / (36e5 * 3);
        }
      ),
      gridOffset: 8,
      format: d3.timeFormat("%H:%M"),
      tickInterval: d3.timeHour.every(3)
    },
    {
      mode: "h",
      interval: d3.timeHour,
      offset: 1,
      grid: d3.timeInterval(
        function (date) {
          date.setTime(Math.floor(+date / (6e4 * 10)) * 6e4 * 10); // interval 10min
        },
        function (date, step) {
          date.setTime(+date + step * 10 * 6e4);
        },
        function (start, end) {
          return (end - start) / (6e4 * 10);
        }
      ),
      gridOffset: 6,
      format: d3.timeFormat("%H:%M"),
      tickInterval: d3.timeMinute.every(10)
    },
    {
      mode: "m",
      interval: d3.timeInterval(
        function (date) {
          date.setTime(Math.floor(+date / (6e4 * 8)) * 6e4 * 8); //interval 8min
        },
        function (date, step) {
          date.setTime(+date + step * 8 * 6e4);
        }
      ),
      gridOffset: 8,
      offset: 1,
      grid: d3.timeMinute,
      format: d3.timeFormat("%M:%S"),
      tickInterval: d3.timeMinute
    }
  ];

  this.zoomed = function (start, end) {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush

    this.zoomActive = true;
    d3.timeout(() => (this.zoomActive = false), 250);
    this.update("zoom", [start, end]);
  };

  this.zoomActive = false;
  this.xCache = false;
  this.dateCache = false;

  this.zoom = d3
    .zoom()
    .filter(() => d3.event.type === "wheel" && !this.zoomActive)
    .on("zoom", () => {
      d3.event.sourceEvent.preventDefault();
      let inc = Math.sign(-d3.event.sourceEvent.deltaY);
      if (
        this.zoomLevel + inc < this.zoomLevels.length &&
        this.zoomLevel + inc >= 0
      ) {
        let x = d3.mouse(this.svg.select(".zoom").node())[0];
        let date, start, end;

        this.setZoomLevel((this.zoomLevel += inc));

        if (this.xCache === Math.round(x)) {
          date = this.dateCache;
        } else {
          date = this.xF.invert(x);
          if (this.prevDimension) {
            let closest = this.prevDimension.filterRange([
              this.zoomLevels[this.zoomLevel].grid(date).getTime(),
              this.zoomLevels[this.zoomLevel].grid.ceil(date).getTime()
            ]).bottom(Infinity)
              .sort( (d1,d2) => Math.abs(d1.time - date) - Math.abs(d2.time - date)  );
            if(closest[0])
              date = closest[0].time;
          }

        }
        start = this.zoomLevels[this.zoomLevel].grid.ceil(
          this.zoomLevels[this.zoomLevel].grid.offset(
            date,
            -x / this.width * this.zoomLevels[this.zoomLevel].gridOffset
          ));
        end = this.zoomLevels[this.zoomLevel].interval.offset(start, 1);


        this.xCache = Math.round(x);
        this.dateCache = date;

        this.zoomed(start, end);
      }
    });

  this.svg
    .select(".zoom")
    .call(this.zoom);

  this.focus
    .call(this.zoom);

  this.infoWindow
    .call(this.zoom);

  let dX = 0;
  this.dragOn = false;
  this.drag = d3
    .drag()
    .on("start", () => {
      dX = 0;
      this.dragOn = true;
    })
    .on("drag", () => {
      let delta = d3.event.dx;
      let start = this.xF.invert(-delta);
      let end = this.zoomLevels[this.zoomLevel].interval.offset(
        start,
        this.zoomLevels[this.zoomLevel].offset
      );

      dX += Math.abs(delta);

      if ( this.xF.domain()[0] !== start ) {
        this.update("drag", [start, end]);
      }

    })
    .on("end", () => {
      if (dX < 2) this.onMouseDown();
      else {
        let start = this.zoomLevels[this.zoomLevel].grid.round(
          this.xF.domain()[0]
        );
        let end = this.zoomLevels[this.zoomLevel].interval.offset(start, 1);

        this.update("dragend", [start, end]);
        this.dragOn = false;
      }
    });

  this.brushmove = function() {
      if (d3.event.sourceEvent === null) return;
  if (d3.event.sourceEvent && d3.event.sourceEvent.type !== "mousemove")
    return; // ignore brush-by-zoom
  let s = d3.event.selection;

  this.update('brush', s.map(d => this.xC.invert(d)));
};

  this.brushed = function () {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    if (d3.event.sourceEvent && d3.event.sourceEvent.type !== "mouseup") return; // ignore brush-by-zoom
    if (!d3.event.sourceEvent) return; // Only transition after input.
    if (!d3.event.selection) return; // Ignore empty selections.

    this.s = d3.event.selection || this.xC.range();

    let d0 = d3.event.selection.map(this.xC.invert);
    let d1 = d0.map(this.zoomLevels[this.zoomLevel].interval.round);
    let c = this.xC.invert(this.s[0] + (this.s[1] - this.s[0]) / 2);

    d1[0] = this.zoomLevels[this.zoomLevel].interval.round(d0[0]);
    d1[1] = this.zoomLevels[this.zoomLevel].interval.offset(
      d1[0],
      this.zoomLevels[this.zoomLevel].offset
    );


    let s = d1.map(this.xC);
    let period = s.map(this.xC.invert, this.xC);

    if (this.xC.domain()[0] > period[0]) {
      this.xC.domain(this.xC.domain().map(c => d3.timeWeek.offset(c, -1)));
    } else if (this.xC.domain()[1] < period[1]) {
      this.xC.domain(this.xC.domain().map(c => d3.timeWeek.offset(c, 1)));
    }

    this.update('brushend', period);

    this.context.select(".brush").call(this.brush.move, s);

  };

  this.brush = d3
    .brushX()
    .extent([[0, 0], [this.width, this.height2]])
    .on("brush", () => this.brushmove())
    .on("end", () => this.brushed());

  this.setZoomLevel = function (i) {
    this.zoomLevel = i;

    this.controls
      .selectAll("rect")
      .style("fill", (d, i1) => (i1 === i ? styles.controls.stroke : "white"));
    this.controls
      .selectAll("text")
      .style("fill", (d, i1) => (i1 !== i ? styles.controls.stroke : "white"));
  };

  let controlWidth = styles.controls.width / this.zoomLevels.length;

  this.controls = this.svg
    .append("g")
    .attr("class", "controls")
    .attr(
    "transform",
    `translate(${this.margin.left + this.width - styles.controls.width},${this
      .margin.top - styles.controls.height})`
    );

  this.controls
    .selectAll("g")
    .data(this.zoomLevels)
    .enter()
    .append("g")
    .attr(
    "transform",
    (d, i) => `translate(${controlWidth * i},${-styles.controls.top})`
    )
    .style("cursor", "pointer")
    .on("click", (d, i) => {
      d3.event.stopPropagation();
      let i0 = this.zoomLevel;
      let x;
      let offset;
      let date;
      let start;
      let end;

      this.setZoomLevel(i);

      x = this.selected ? this.xF(this.selected.time) : this.width / 2;
      if ( x < 0 || x > this.width )
        x = this.width / 2;

      offset = Math.ceil(
        x / this.width * this.zoomLevels[this.zoomLevel].gridOffset
      );

      date = this.zoomLevels[this.zoomLevel].grid.offset(
        this.xF.invert(x),
        -offset
      );

      start = this.zoomLevels[this.zoomLevel].grid.ceil(date);
      end = this.zoomLevels[this.zoomLevel].interval.offset(start, 1);

      this.zoomed(start, end);
    })
    .append("rect")
    .attr("width", controlWidth)
    .attr("height", styles.controls.height)
    .attr("fill", "white")
    .attr("stroke", styles.controls.stroke)
    .attr("stroke-width", styles.controls.strokeWidth);

  this.controls
    .selectAll("g")
    .append("text")
    .attr("x", controlWidth / 2)
    .attr("y", styles.controls.height / 2)
    .style("text-anchor", "middle")
    .style("dominant-baseline", "middle")
    .attr("font-size", styles.controls.fontSize)
    .style("fill", styles.controls.stroke)
    .text(d => d.mode);

  this.setZoomLevel(1); // set w level

  this.liveButton = this.svg
    .append("g")
    .attr(
    "transform",
    `translate(${this.margin.left},${this.margin.top -
    styles.liveButton.height -
    styles.liveButton.top})`
    )
    .style("cursor", "pointer")
    .on("click", () => {
      this.liveButton
        .select("text")
        .attr(
        "fill",
        this.live
          ? styles.liveButton.textFill[1]
          : styles.liveButton.textFill[0]
        );
      this.liveButton
        .select("rect")
        .attr(
        "fill",
        this.live
          ? styles.liveButton.buttonFill[1]
          : styles.liveButton.buttonFill[0]
        );
      this.liveButton
        .select("rect")
        .style(
        "stroke",
        this.live ? styles.liveButton.stroke[1] : styles.liveButton.stroke[1]
        );

      const maxDate = this.data[this.data.length - 1].time;
      const date = this.zoomLevels[this.zoomLevel].grid.ceil(maxDate);
      const start = this.zoomLevels[this.zoomLevel].grid.offset(date, -4);
      const end = this.zoomLevels[this.zoomLevel].interval.offset(start, 1);


      this.update("jump", [start, end]);
      this.changeTicks();
    });

  this.liveButton
    .append("rect")
    .attr("width", styles.liveButton.width)
    .attr("height", styles.liveButton.height)
    // .attr(
    //   'transform',
    //   'translate(' + this.margin.left + ',' + this.margin.top + ')'
    //   )
    .attr("x", styles.liveButton.x)
    .attr("fill", styles.liveButton.buttonFill[0])
    .attr("stroke-width", styles.liveButton.strokeWidth);

  this.liveButton
    .append("text")
    .attr("x", styles.liveButton.x + styles.liveButton.width / 2)
    .attr("y", styles.liveButton.height / 2)
    .attr("text-anchor", "middle")
    .style("dominant-baseline", "middle")
    .attr("fill", "white")
    .attr("font-size", styles.liveButton.fontSize)
    .text(styles.liveButton.text[0]);


  this.lockData = false;
  this.live = false;

  this.init = function (object) {
    this.data = object.data;
    this.dataReduced = object.dataReduced;
    this.dataReduced2 = object.dataReduced2;
    this.cfdata = object.cfdata;
    this.cfdata_values = object.cfdata_values;
    this.cfdata_times = object.cfdata_times;
    this.cfdata_red = object.cfdata_red;
    this.cfdata_times_red = object.cfdata_times_red;
    this.cfdata_red2 = object.cfdata_red2;
    this.cfdata_times_red2 = object.cfdata_times_red2;

    this.maxValue = d3.max(this.data, d => d.value);
    this.minValue = d3.min(this.data, d => d.value);
    this.maxDate = d3.max(this.data, d => d.time);

    this.updateDataView([
      d3.timeDay.floor(this.maxDate),
      d3.timeDay.ceil(this.maxDate)
    ]);

    this.xF.domain([this.start, this.end]);
    this.yF.domain([this.minValue * 1.2, this.maxValue * 1.2]);

    this.startC = d3.timeWeek.offset(d3.timeWeek.ceil(this.end), -5);
    this.endC = d3.timeWeek.ceil(this.end);
    this.xC.domain([this.startC, this.endC]);
    this.yC.domain(this.yF.domain());

    this.updateContextView();

    this.mode = object.mode;

    this.axes
      .append("g")
      .attr("class", "axis axis--x")
      .attr('clip-path', `url(#clip-axes${this.id})`)
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.xF));

    this.axes // axis for visible grid
      .append("g")
      .attr('clip-path', `url(#clip-axes${this.id})`)
      .attr("class", "axis axis--x_ticks")
      .attr("transform", "translate(0," + this.height + ")")
      .call(
      d3
        .axisBottom(this.xF)
        .ticks(d3.timeHour.filter(t => (t.getHours() + 2) % 8 === 0))
      );

    
    this.axes
      .append("g")
      .attr("class", "axis axis--y axis--y1")
      .call(d3.axisLeft(this.yF))
      .append("line")
      .attr("class", "domain")
      .attr("y2", this.height)
      .attr("stroke", styles.axisY1.stroke)
      .attr("stroke-width", styles.axisY1.strokeWidth);

    if (this.mode === "normal") {
      // 2nd y-axis
      this.axes
        .append("g")
        .attr("class", "axis axis--y axis--y2")
        .call(d3.axisRight(this.yF2))
        .attr("transform", "translate(" + this.width + ", 0)")
        .append("line")
        .attr("class", "domain")
        .attr("y2", this.height)
        .attr("stroke", styles.axisY2.stroke)
        .attr("stroke-width", styles.axisY2.strokeWidth);

      this.axes
        .select("g.axis--y2")
        .append("text")
        .attr("x", 40)
        .attr("y", 5)
        .text("[%]");

      this.svg.select(".zoom").call(this.drag);


      this.focus.on(
        'mousemove',
        () => {
          if (!this.dataView.length || this.permanent) return;

          let [x, y] = d3.mouse(this.focus.node());
          let d = this.findPoint(x, y);

          if (d)
            this.showInfo(d);
          else if (this.selected)
            this.hideInfo();
        })
        .on(
          "mouseleave",
          () => (!this.permanent ? this.hideInfo() : null)
        )
        .on(
          'click',
          () => {
            if (!this.dataView.length) return;

            let [x, y] = d3.mouse(this.focus.node());
            let d = this.findPoint(x, y);

            if (d)
              this.pointClick(d);
          });
    }


    this.initFocus();

    if (this.mode === "alternative") {
      this.initBrushes(object);
    }

    // Navigation chart

    this.initContext();


    this.context
      .append("rect")
      .classed("scroll-area", true)
      .attr("width", this.width2)
      .attr("height", this.height2)
      .style("fill", "transparent")
      .on("click", () => {
        let x = d3.mouse(this.context.node())[0];
        let date = this.xC.invert(x);
        let domainOld = this.xF.domain();
        let dateSnap = this.zoomLevels[this.zoomLevel].interval(date);
        let period;

        period = [
          dateSnap,
          this.zoomLevels[this.zoomLevel].interval.offset(dateSnap, 1)
        ];

        this.update("jump", period);
      });

    this.context
      .append("g")
      .attr("class", "brush")
      .call(this.brush);

    this.context
      .select("rect.selection")
      .style("stroke", "none")
      .style("fill", "transparent");

    this.context
      .selectAll("rect.handle")
      .remove();

    this.context
      .select(".overlay")
      .remove();

    this.context
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.height2 + ")")
      .call(d3
        .axisBottom(this.xC)
        .ticks(d3.timeWeek)
        .tickFormat(d3.timeFormat("%m. %d"))
      );

    this.context
      .append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(this.yC).ticks(4))
      .append("line")
      .attr("class", "domain")
      .attr("y2", this.height2)
      .attr("stroke", styles.axisY2.stroke)
      .attr("stroke-width", styles.axisY1.strokeWidth);

    this.context
      .append("g")
      .attr("class", "arrow-group")
      .attr("transform", `translate(0,${this.height2 / 2})`)
      .append("use")
      .attr("xlink:href", "#arrow" + this.id)
      .attr("transform", `translate(${-styles.arrow.offset},0)`)
      .on("click", () => {
        this.jump(-4, d3.timeWeek);
      });

    this.context
      .select(".arrow-group")
      .append("use")
      .attr("xlink:href", "#arrow" + this.id)
      .attr(
      "transform",
      `scale(-1,1) translate(${-this.width2 -
      styles.arrow.offset +
      styles.arrow.width},0)`
      )
      .on("click", () => {
        this.jump(4, d3.timeWeek);
      });


    this.svg
      .selectAll("path.domain, .tick line")
      .attr("stroke", "transparent");

    this.svg
      .on('mouseenter', () => (this.mouseOn = true))
      .on('mouseleave', () => (this.mouseOn = false));

    document.addEventListener("keydown", event => {
      if (!this.mouseOn) return;
      switch (event.key) {
        case "ArrowLeft":
          this.keyUp = false;
          this.step(-1, this.hold ? 'drag' : 'dragend');
          d3.timer(() => this.hold = !this.keyUp, 250);
          break;
        case "ArrowRight":
          this.keyUp = false;
          this.step(1, this.hold ? 'drag' : 'dragend');
          d3.timer(() => this.hold = !this.keyUp, 250);
          break;
        default:
          break;
      }
    });

    document.addEventListener("keyup", () => {
      this.hold = false;
      this.keyUp = true;
    });

    this.selected = false;
    this.permanent = false;
    this.hold = false;
    this.keyUp = false;
    this.update('drag', this.xF.domain());

    d3.select(window).on('resize.' + this.id, () => {
      let svg = parent.selectAll('svg');
      let targetWidth = parseInt(parent.node().clientWidth);
      if (targetWidth == 0) return;

      this.width = targetWidth - this.margin.left - this.margin.right;
      this.width2 = targetWidth - this.margin2.left - this.margin2.right;
      this.xF.range([0, this.width]);
      this.xC.range([0, this.width2]);

      svg.attr("width", targetWidth);

      this.defs
        .select(`#clip${this.id} rect`)
        .attr("width", this.width);

      this.defs
        .select(`#clipNav${this.id} rect`)
        .attr("width", this.width2);

      this.defs
        .select(`#clip-axes${this.id} rect`)
        .attr("width", this.width + 40);

      this.svg
        .select("rect.zoom")
        .attr("width", this.width);

      this.controls
        .attr(
          "transform",
          `translate(${this.margin.left + this.width - styles.controls.width},${this
            .margin.top - styles.controls.height})`
        );

      this.context
        .select(".arrow-group use:nth-child(2)")
        .attr(
          "transform",
          `scale(-1,1) translate(${-this.width2 -
          styles.arrow.offset +
          styles.arrow.width},0)`
        );

      this.axes
        .select(".axis--y2")
        .attr("transform", `translate(${this.width}, 0)`);

      this.brush
        .extent([[0, 0], [this.width2, this.height2]]);

      this.context.select(".brush")
        .call(this.brush);

      this.context
        .select("rect.selection")
        .style("stroke", "none")
        .style("fill", "transparent");

      this.context
        .selectAll("rect.handle")
        .remove();

      this.context
        .select(".overlay")
        .remove();


      this.context
        .select("rect.scroll-area")
        .attr("width", this.width2);

      if (this.selected) {

      }

      if (this.mode === 'alternative') {
        this.loadSets(this.sets.slice(0));

        this.legend
          .style(
            "left",
            (this.margin.left + this.width + this.margin.right) * 0.7 + "px"
          )
          .style(
            "top",
            (this.margin.top + this.height + this.margin.bottom) * 0.2 + "px"
          )
          .style(
            "width",
            (this.margin.left + this.width + this.margin.right) * 0.2 + "px"
          );
      }

      this.update('resize', this.xF.domain());
    });

  };

  this.initBrushes = function (object) {
    const _this = this;
    this.index = 0;

    this.moveActive = false;

    this.dragBrush = d3.drag()
      .on('drag', () => {
        if (this.moveActive) return;
        let set = d3.event.subject;
        let delta = d3.event.dx;
        let selection = d3.brushSelection(
          document.getElementById("brush-" + set.id)
        ).map(s => s + delta);
        let step = selection[0] < 25 && delta < 0
          ? -1
          : selection[1] > this.width - 25 && delta > 0
          ? 1 : 0;

        if (step) {
          set.period = set.period.map(
            s => this.zoomLevels[this.zoomLevel].grid.offset(s, step)
          );
          this.moveActive = true;
          this.step(step);
          d3.timeout(()=> {
            this.moveActive = false;
          }, 250);
        } else {
          set.period = selection.map(this.xF.invert);
          this.loadSets();
        }
    })
      .on('end', () => {
        let set = d3.event.subject;
        this.saveSets(set, 'update');
        this.loadSets();
      });

    this.newBrush = function (params) {
      let brush = d3
        .brushX()
        .extent([[0, 0], [this.width, this.height]])
        .on("start", set => brushstart(set))
        .on("brush", set => brushmove(set))
        .on("end", set => brushend(set));
      let set;

      if (typeof params === "object") {
        set = params;
        set.brush = brush;
      } else {
        set = {
          id: params,
          name: '',
          period: [],
          brush
        };
        this.sets.push(set);
      }

      let pCache = [],
        xCache;

      let brushstart = function (set) {
        if (!d3.event.sourceEvent) return;
        if (d3.event.sourceEvent.type !== 'mousedown') return;

        xCache = 0;
        _this.brushActive = true;
        pCache = [false, false];
        _this.moveActive = false;

      };



      let brushmove = function (set) {
        if (!d3.event.sourceEvent) return; //filter programmatical moving
        if (d3.event.sourceEvent.type !== 'mousemove') return;

        let x = d3.mouse(_this.focus.node())[0];
        let x0 = xCache;
        xCache = x;

        if (_this.moveActive || _this.lockData) return;
        if(!d3.event.selection || !d3.event.selection.length) return;

        let selection = d3.event.selection;
        let [start, end] = selection.map(s => _this.xF.invert(s).getTime());

        if (!set.period.length) {
          set.period = [start, end];
          _this.loadSets();
          return;
        }

        let step = x < 25 && x < x0
          ? -1
          : _this.width - x < 25 && x > x0
            ? 1
            : 0;

        if (step) {
          let period = _this.xF.domain().map(
            d =>
              _this.zoomLevels[_this.zoomLevel].grid.offset(d, step)
          );
          let active = Math.abs(_this.xF(set.period[0]) - x) <
                       Math.abs(_this.xF(set.period[1]) - x)
                      ? 0
                      : 1;
          let opposite = 1 - active;

          pCache[opposite] = pCache[opposite] || set.period[opposite];
          set.period[opposite] = pCache[opposite];
          set.period[active] = _this.zoomLevels[_this.zoomLevel].grid.offset(
            set.period[active],
            step
          ).getTime();

          if (set.period[0] > set.period[1]) {
            pCache[active] = pCache[opposite];
            pCache[opposite] = false;
            set.period[opposite] = set.period[active];
            set.period[active] = pCache[active];
          }

          _this.moveActive = true;
          d3.select("#brush-" + set.id)
            .call(
              set.brush.move,
              set.period.map(_this.xF)
            );
          _this.update('dragend', period);
          d3.timeout(() => {
            _this.moveActive = false;
          }, 250);

        } else {
          let date = _this.xF.invert(x).getTime();

          if (start > _this.xF.domain()[0])
            set.period[0] = start;
          if (end < _this.xF.domain()[1])
            set.period[1] = end;

          if (pCache[0])
            if (date > pCache[0]) {
              set.period[0] = pCache[0];
              set.period[1] = date;
            }
            else {
              set.period[1] = (pCache[1] = pCache[0]);
              pCache[0] = false;
              set.period[1] = date;
            }
          if (pCache[1]) {
            if (date < pCache[1]) {
              set.period[1] = pCache[1];
              set.period[0] = date;
            }
            else {
              set.period[0] = (pCache[0] = pCache[1]);
              pCache[1] = false;
              set.period[1] = date;
            }
          }

          d3.select("#brush-" + set.id).call(set.brush.move, set.period.map(_this.xF));
          _this.loadSets();
        }

      };

      let brushend = function (set) {
        if (!d3.event.sourceEvent) return;
        if (d3.event.sourceEvent.type !== "mouseup") return;


        _this.brushActive = false;
        let lastBrush = document.getElementById("brush-" + set.id);
        let selection;
        if (lastBrush) {
          selection = d3.brushSelection(lastBrush) ||
            [d3.mouse(_this.focus.node())[0] - 1, d3.mouse(_this.focus.node())[0] + 1];
        }
        if (selection && selection.length && selection[0] !== selection[1]) {
          let [start, end] = selection.map(s => _this.xF.invert(s));
          set.period = [start, end];
          _this.saveSets(set, 'update');
          _this.loadSets();
        }

      };

    };

    this.brushArea = this.focus
      .append("g")
      .classed("brush-area", true)
      .attr("clip-path", `url(#clip${this.id})`)
      .attr("filter", `url(#motionBlur${this.id})`);

    this.svg.on("click", () => this.onMouseDown());

    this.svg.select(".brush-area").call(this.zoom);

    this.legend = parent
      .append("div")
      .attr("id", "legend")
      .style(
      "left",
      (this.margin.left + this.width + this.margin.right) * 0.7 + "px"
      )
      .style(
      "top",
      (this.margin.top + this.height + this.margin.bottom) * 0.2 + "px"
      )
      .style(
      "width",
      (this.margin.left + this.width + this.margin.right) * 0.2 + "px"
      )
      .style('z-index', 10);

    this.loadSets(object.sets);

  };

  this.correctedSets = [];

  this.updateCorrected = function(set, type) {
    let setCorr = this.correctedSets.filter( s => s.id === set.id)[0];

    if (type === "remove") {
      set.period = [];
      this.sets.splice(this.sets.indexOf(set), 1);
      if (setCorr) {
        this.correctedSets.splice(this.correctedSets.indexOf(setCorr), 1);
      }

    } else if (set.period.length) {

      if (set.period[0] > this.data[this.data.length - 1].time || set.period[1] < this.data[0].time) {
        set.period = [];
        this.sets.splice(this.sets.indexOf(set), 1);
        if (setCorr) {
          this.correctedSets.splice(this.correctedSets.indexOf(setCorr), 1);
        }
      }

      if (type === "rename") {
        if (setCorr) {
          setCorr.name = set.name;
        }
      }
      if (type === "update") {
            let periodData = [];

            this.data.forEach(d => {
             if (set.period[0] <= d.time && d.time <= set.period[1]) {
                 periodData.push({
                 time: +d.time,
                 value: d.value });
             }
           });

          if (periodData.length === 0) {
            set.period = [];
            this.sets.splice(this.sets.indexOf(set), 1);
            if (setCorr) {
              this.correctedSets.splice(this.correctedSets.indexOf(setCorr), 1);
            }
          } else {
            if (!setCorr) {
              setCorr = {};
              this.correctedSets.push(setCorr);
            }

            if (set.period[1] > this.data[this.data.length - 1].time) {
              set.period[1] = new Date(periodData[periodData.length - 1].time);
            }
            if (set.period[0] < this.data[0].time) {
              set.period[0] = new Date(periodData[0].time);
            }
            if(set.period[0] === set.period[1]) {
              set.period[0] -= this.xF.invert(1);
              set.period[1] += this.xF.invert(1);
            }

            Object.assign(setCorr, {
              set: periodData,
              domain: this.yF.domain(),
              name: set.name,
              period: set.period.slice(0),
              id: set.id
            });
          }
      }
    }
  };

  this.saveSets = function(set, type) {
    this.updateCorrected(set, type);
    //this.updateSets();
    let event = new Event("set:update");
    event.sets = this.correctedSets.slice(0);
    parent.node()
      .dispatchEvent(event);
  };

  this.loadSets = function(sets) {
    if(sets) {
      this.sets = [];
      this.correctedSets = [];
      this.drawBrushes();
      sets.forEach(s => {
        if (s.period.length) {
          let set = Object.assign({}, {
            id: s.id,
            period: s.period,
            name: s.name
          });
          this.sets.push(set);
          this.updateCorrected(set, 'update');
        }
      });
    }
    this.updateSets();
    this.update('sets');
    if (!this.sets.length || this.sets[this.sets.length - 1].period.length) {
      this.newBrush(++this.index);
      this.drawBrushes();
    }
  };

  this.updateSets = function() {

    for (let i = 0; i < this.sets.length - 1; i++) {
      if (this.sets[i].period.length === 0) this.sets.splice(i, 1);
    }

    this.index = this.sets.length
      ? d3.max(this.sets, s => s.id) + 1
      : 0;

    this.sets.forEach((s, i) => {
      if (s.period.length && s.name === "") {
        let prev = this.sets.slice(0,i);
        let index = prev.filter(s1 => s1.name).length + 1;
        prev
          .map(s => s.name)
          .forEach(n => {
            if (
              n.slice(0, 3) === "Set" &&
              !isNaN(parseInt(n.slice(3)))
            ) {
              if (parseInt(n.slice(3)) >= index)
                index = parseInt(n.slice(3)) + 1;
            }
          });
        this.sets[i].name = "Set " + index;
      }
      if (!this.sets[i].brush)
        this.newBrush(this.sets[i]);
    });
  };

  this.drawBrushes = function (t) {
    const _this = this;
    let brushSelection = this.svg
      .select(".brush-area")
      .selectAll(".brush")
      .data(this.sets, s => s.id);

    brushSelection
      .enter()
      .insert("g", ".brush")
      .attr("class", "brush")
      .attr("id",
        b => "brush-" + b.id)
      .each(function (brushObject, i) {
        const group = d3.select(this);
        group.call(brushObject.brush);

        group.select('.selection')
          .attr('fill', 'none');

        group
          .selectAll(".handle--custom")
          .data([{ type: "w" }, { type: "e" }])
          .enter()
          .append("use")
          .attr("cursor", "ew-resize")
          .attr("class", "handle--custom")
          .attr("display", "none")
          .attr("xlink:href", "#arrow" + _this.id);

        group.append('rect')
          .classed('selection2', true)
          .style("stroke", styles.brushes.color)
          .style('cursor', 'move')
          .style("fill-opacity", 0.1)
          .style("fill", styles.brushes.color)
          .attr('y', -4)
          .attr('height', _this.height + 8)
          .call(_this.dragBrush);

        group
          .append("text")
          .classed("name", true);

        // let length = 0;
        // _this.data.forEach((date) => {
        //   if (brushObject.period[0] <= date.time && date.time <= brushObject.period[1]) {
        //     length += 1;
        //   }
        // });

        group
          .append("text")
          .classed("remove", true)
          .style("cursor", "pointer")
          .text("x")
          // .text(`(${length}) x`)
          .on("mousedown", d => {
            _this.saveSets(d, 'remove');
            _this.loadSets();
          });

        group
          .selectAll("text")
          .attr("display", "none")
          .style("fill", "black")
          .style("font-size", 10);

      });

    brushSelection
      .exit()
      .remove();

    brushSelection
      .each(function (brushObject, i) {
      const group = d3.select(this);
      let selection = brushObject.period.map(_this.xF);

      group
        .attr("class", "brush")
        .selectAll(".overlay")
        .style("pointer-events", function () {
          let brush = brushObject.brush;
          if (
            brushObject.id === _this.sets[_this.sets.length - 1].id &&
            brush !== undefined
          ) {
            return "all";
          } else {
            return "none";
          }
        });

      group
        .select("text.name")
        .text(brushObject.name);


      if (brushObject.period.length && brushObject.brush) {
        let x = _this.xF(brushObject.period[0]);
        let width = _this.xF(brushObject.period[1]) - x;
        let height = _this.height;
        let gr = t
          ? group.transition(t)
            : group;

        gr.call(
          brushObject.brush.move,
          brushObject.period.map(_this.xF)
        );

        group
          .selectAll(".handle")
          .attr("pointer-events", "none")
          .style("cursor", "default");

        let selection2 = group.selectAll('.selection2');

        if (!selection2.size()) {

        }

        let arrows =  group
          .selectAll(".handle--custom")
          .attr("display", "block");

        let remove = group
          .select("text.remove")
          .attr("display", "block");

        let name = group
          .select("text.name")
          .text(brushObject.name)
          .attr("display", "block");

        if ( t ) {
          arrows = arrows.transition(t);
          remove = remove.transition(t);
          name = name.transition(t);
          selection2 = selection2.transition(t);
        }

        selection2
          .attr('x', x)
          .attr('width', width);

        arrows
          .attr("transform", (d, i) => {
          return i === 1
            ? ` rotate(180) translate(${-x - width - 10},${-height /
            2}) scale(.5)`
            : ` translate(${x - 10},${height / 2}) scale(.5)`;
        });

        remove
        .attr("x", +width > 10 ? +x + +width - 10 : +x)
        .attr("y", 15);

        name
        .attr("x", +width > 50 ? +x + 10 : +x)
        .attr("text-anchor",
          +width > 50
            ? "start"
            : "end"
          )
          .attr("y", 15);
      }
    });



    let legendSets = d3
      .select("#legend")
      .selectAll(".set")
      .data(
        this.sets
        .filter(s => s.name),
        s => s.id
      );

    let legendEnter = legendSets
      .enter()
      .append("div")
      .classed("set", true);

    legendEnter
      .append("input")
      .each(function (d) {
        this.value = d.name;
      })
      .on("click", d => {
        if (
          !(
            d.period[0] > _this.xF.domain()[0] &&
            d.period[1] < _this.xF.domain()[1]
          )
        )
          _this.moveToBrush(d.period[0]);
      })
      .on("change", function (d) {
        let set = _this.sets
          .filter(s => s.id === d.id)[0];
        set.name = this.value;
        _this.saveSets(set, 'rename');
        _this.loadSets();
      });

    legendEnter
      .append("button")
      .html("x")
      .on("click", d => {
        let set = _this.sets
          .filter(s => s.id === d.id)[0];
        _this.saveSets(set, 'remove');
        _this.loadSets();
      });
    legendSets.exit().remove();

  };

  this.moveToBrush = function (date) {
    let domainOld = this.xF.domain();
    let dateSnap = this.zoomLevels[this.zoomLevel].grid(date);
    let period;

    if (dateSnap < domainOld[0]) {
       period = [
        dateSnap,
        this.zoomLevels[this.zoomLevel].interval.offset(dateSnap, 1)
      ];
    } else {
      period = [
        dateSnap,
        this.zoomLevels[this.zoomLevel].interval.offset(dateSnap, 1)
      ];
    }

    if (!this.xF.domain()[0] !== period[0]) {
      this.update("jump", period);
    }
  };

  this.changeTicks = function () {
    let min, max;
    if (this.setsView.length){
      min = d3.min(this.setsView, d => d.value);
      max = d3.max(this.setsView, d => d.value);
    } else {
      min = d3.min(this.dataView, d => d.value);
      max = d3.max(this.dataView, d => d.value);
    }

    if ( !isNaN(min) && !isNaN(max)) {
      this.yF.domain([min * 0.9, max * 1.1]);

      if (min < 0 && max > 0 && Math.abs(max) > Math.abs(min)) {
        this.yF.domain([-max * 1.1, max * 1.1]);
      } else if (min < 0 && max > 0 && Math.abs(max) < Math.abs(min)) {
        this.yF.domain([min * 1.1, -min * 1.1]);
      } else if (min > 0 && max > 0) {
        this.yF.domain([0, max * 1.1]);
      } else if (min < 0 && max < 0) {
        this.yF.domain([min * 0.9, 0]);
      }
    }

  };

  this.jumpActive = false;

  this.jump = function (step, interval, animation = "jump") {
    let [start, end] = this.xF.domain(),
      period;
    let timeout = animation === "jump" ? 120 : 120;

    if (!this.jumpActive && !this.zoomActive) {

      this.jumpActive = true;
      d3.timeout(() => (this.jumpActive = false), timeout);

      period = [
        interval.offset(start, step),
        interval.offset(end, step)
      ];


      if (
        this.xC.domain()[0] > period[0] ||
        this.xC.domain()[1] < period[1]
      ) {
        this.xC.domain(this.xC.domain().map(c => d3.timeWeek.offset(c, step)));
      }

      this.update(animation, period);
    }
  };

  this.step = function(step, type = 'dragend') {
    let period = this.xF.domain()
      .map(d =>
        (this.zoomLevels[this.zoomLevel].grid.offset(d, step))
      );

    this.update(type, period);
  };


  this.prevDimension = false;
  this.setsView = [];
  this.setsViewEmpty = true;

  this.updateDataView = function (period, same = false) {
    let [start, end] = period || this.xF.domain();
    let start_utc = start.getTime();
    let end_utc = end.getTime();
    if (start != this.start || end != this.end) {
      if (this.cfdata_times) {
        this.cfdata_times.filterRange([start_utc, end_utc]);
        this.cfdata_times_red.filterRange([start_utc, end_utc]);
        let tempView = this.cfdata_times.bottom(Infinity);

        if (same && this.prevDimension) {
          this.dataView = this.prevDimension.bottom(Infinity);
          let first = this.prevDimension.filterRange([0, start_utc-1]).top(1);
          let last = this.prevDimension.filterRange([end_utc+1, Infinity]).bottom(1);
          this.dataView = first.concat( this.dataView, last);
        }
        else {
          if (tempView.length <= 500) {
            this.dataView = tempView;
            let first = this.cfdata_times.filterRange([0, start_utc-1]).top(1);
            let last = this.cfdata_times.filterRange([end_utc+1, Infinity]).bottom(1);
            this.dataView = first.concat( this.dataView, last);
            this.prevDimension = this.cfdata_times;
          }
          else if(tempView.length > 500 && tempView.length < 20000){
            this.dataView = this.cfdata_times_red.bottom(Infinity);
            let first = this.cfdata_times_red.filterRange([0, start_utc-1]).top(1);
            let last = this.cfdata_times_red.filterRange([end_utc+1, Infinity]).bottom(1);
            this.dataView = first.concat( this.dataView, last);
            this.prevDimension = this.cfdata_times_red;
          }
          else {
            this.dataView = this.cfdata_times_red2.bottom(Infinity);
            this.prevDimension = this.cfdata_times_red2;
          }
        }
      }
    }
    else if (!this.dataView || !this.dataView.length) {
      let newDataChart = this.data.filter((d, i, data) =>
        (i < data.length - 1 ?
          data[i + 1].time >= start_utc
          : d.time >= start_utc)
        && (i > 0 ?
          data[i - 1].time <= end_utc
          : d.time <= end_utc)
      );
      this.dataView = newDataChart;
    }
    this.start = start;
    this.end = end;

  };

  this.updateSetsView = function(period) {
    let [start, end] = period || this.xF.domain();
    let start_utc = start.getTime();
    let end_utc = end.getTime();
    let sets = this.sets.filter( s => s.period[1] > start_utc || s.period[0] < end_utc );
    let setsView = [];

    this.dataView.forEach( d => {
      if (sets.find( s =>
          (s.period[0] <= d.time &&  s.period[1] >= d.time)
        )) {
        setsView.push(d);
      }
    });
    this.setsViewEmpty = this.setsView.length;
    this.setsView = setsView;
  };


  this.updateContextView = function (period) {

    let [start, end] = period || this.xC.domain();

    let start_utc = start.getTime();
    let end_utc = end.getTime();

    if (start != this.startC || end != this.endC) {

      if (this.cfdata_times_red2) {
        this.cfdata_times_red2.filterRange([start_utc, end_utc]);
        this.contextView = this.cfdata_times_red2.bottom(Infinity);
      }
      else {
        let newDataChart = this.data.filter((d, i, data) =>
          (i < data.length - 1 ? data[i + 1].time >= start_utc : d.time >= start_utc)
          && (i > 0 ? data[i - 1].time <= end_utc : d.time <= end_utc)
        );
        this.contextView = newDataChart;
      }

      this.startC = start;
      this.endC = end;
    }  else {
      let newDataChart = this.data.filter((d, i, data) =>
        (i < data.length - 1 ? data[i + 1].time >= start_utc : d.time >= start_utc)
        && (i > 0 ? data[i - 1].time <= end_utc : d.time <= end_utc)
      );
      this.contextView = newDataChart;
    }

  };

  this.getTransition = function(type) {
    let t = {
      zoom: d3.transition("zoom" + this.id).duration(250),
      dragend: d3.transition("dragend" + this.id).duration(250),
      brushend: d3.transition("brushend" + this.id).duration(250),
      jump: d3.transition("jump" + this.id).duration(120),
      shift: d3.transition("shift" + this.id).duration(100).ease(d3.easeLinear),
    }[type];

      if ( t ) {
        t.on('end interrupt', () => {
          this.lockData = false;
        });
      }

      return t;
  };

  this.update = function (type, period) {
    if ( this.lockData && type !== 'resize') return;
    if ( !this.autoMove && type === 'plot' &&  this.data[this.data.length - 1].time >  this.xF.domain()[1] ) return;

    if(type !== 'resize')
      this.lockData = true;

    const t = this.getTransition(type);
    let offset = 0;

    if (period ) {
      let period1 =[
       this.xF.domain()[0].getTime() < period[0].getTime() ? this.xF.domain()[0] : period[0],
       this.xF.domain()[1].getTime() > period[1].getTime() ? this.xF.domain()[1] : period[1]
      ];
      offset = this.xF(period[1]) - this.xF(this.xF.domain()[1]);

      this.autoMove = type === 'shift'
        || this.data[this.data.length - 1].time <=  period[1].getTime();

      if ( type === 'zoom' || type === 'jump' ) {
        this.updateChartData(period);
        this.moveAxes(period, t, true);
        this.blur(period, t);
        return;
      }
      else {
        this.updateChartData(period1, true);
        this.startUpdate();
        this.moveAxes(period, t, type !== 'brush' && type!== 'brushend');
        this.updateChart(period1, t, offset);
      }
    }
    else {
      if (type === 'sets')
        this.changeTicks();
      if (type === 'resize' || type === 'sets')
        this.moveAxes();

      this.updateChart();
    }

    if (!t && type !== 'resize')
      this.lockData = false;

    if (this.data[this.data.length - 1].time >=  this.xF.domain()[1] &&
      this.autoMove && !this.dragOn ) {
        let end = this.zoomLevels[this.zoomLevel].grid.ceil(
          this.zoomLevels[this.zoomLevel].grid.offset(
            this.data[this.data.length-1].time,
            1
          )
        );
        this.update('shift', [this.zoomLevels[this.zoomLevel].interval.offset(end,-1), end]);
    }
  };

  this.moveAxes = function(period = this.xF.domain(), t, brush) {
    this.xF.domain(period);

    if (this.xC.domain()[0] > period[0]) {
      const dateC = d3.timeWeek(period[0]);
      this.xC.domain([dateC, d3.timeWeek.offset(dateC, 5)]);
    } else
    if (this.xC.domain()[1] < period[1]) {
      const dateC = d3.timeWeek.ceil(period[1]);
      this.xC.domain([d3.timeWeek.offset(dateC, -5), dateC]);
    }

    this.updateAxes(t);
    this.moveBrush(t, brush);
    if ( this.selected ) {
      this.moveInfo(t);
    }
  };

  this.updateChart = function(period, t, offset) {
    this.updateChartData(period);
    if (this.mode==="alternative" ) {
      this.drawBrushes(t);
    }
    this.renderChart(t, offset);
  };


  this.blur = function(period, t) {
    const t0 = d3.transition('blur' + this.id).duration(120);

    this.svg
      .select(`#motionBlur${this.id} .blurValues`)
      .transition(t0)
      .attrTween("stdDeviation", function () {
        return d3.interpolateString("0 0", "3 2");
      })
      .on('end interrupt', () => {
        this.updateChart(period);
      })
      .transition(t0)
      .attrTween("stdDeviation", function () {
        return d3.interpolateString("3 2", "0 0");
      });

  };

  this.updateAxes = function (t) {
    let axis = this.axes
      .select("g.axis--x");
    let axis1 = this.axes
      .select("g.axis--x_ticks");
    let axisC = this.context
      .select("g.axis--x");

    if ( t ) {
      axis = axis
        .transition(t);
      axis1 = axis1
        .transition(t);
      axisC = axisC
        .transition(t);
    }

    axis.call(
        d3
          .axisBottom(this.xF)
          .tickFormat(this.zoomLevels[this.zoomLevel].format)
          .ticks(this.zoomLevels[this.zoomLevel].tickInterval)
      );
    axis1.call(
        d3
          .axisBottom(this.xF)
          .ticks(d3.timeHour.filter(t => (t.getHours() + 2) % 8 === 0))
      );
    axisC.call(
        d3
          .axisBottom(this.xC)
          .ticks(d3.timeWeek)
          .tickFormat(d3.timeFormat("%d. %m"))
      );

    this.axes
      .selectAll("g.axis--x .tick line")
      .style("display", "none");


    this.axes
      .selectAll(
        "g.axis--x_ticks .tick text, g.axis--x_ticks .tick line,  g.axis--x .tick line"
      )
      .remove();

    this.axes
      .selectAll("g.axis--x_ticks .tick")
      .append("line")
      .attr("y2", -this.height)
      .style("stroke", styles.grid.visible)
      .style("stroke-width", styles.grid.visibleWidth);

    this.axes
      .selectAll("g.axis--x .tick")
      .append("line")
      .attr("y2", -this.height)
      .style("display", "block")
      .style("stroke", styles.grid.switching)
      .style("stroke-width", styles.grid.switchingWidth);

    this.axes
      .select("g.axis--y1")
      .call(
        d3.axisLeft(this.yF)
      );

    this.context
      .selectAll("g.axis--x .tick line")
      .remove();

    this.context
      .selectAll("g.axis--x .tick")
      .append("line")
      .attr("y2", -this.height2)
      .style("stroke", styles.navChart.stroke)
      .style("stroke-width", styles.navChart.strokeWidth);
  };

  this.moveBrush = function (t, notBrush) {
    if (notBrush) {
      let domain = this.xF.domain().map(d => this.xC(d));
      this.context.select("g.brush").call(this.brush.move, domain);
    }

    if ( t ) {
      this.svg
        .selectAll(`#brush-rect${this.id} rect, .selected-area rect`)
        .transition(t)
        .attr(
          "width",
          this.xC(this.xF.domain()[1]) - this.xC(this.xF.domain()[0])
        )
        .attr("x", this.xC(this.xF.domain()[0]));
    } else {
      this.svg
        .selectAll(`#brush-rect${this.id} rect, .selected-area rect`)
        .attr(
          "width",
          this.xC(this.xF.domain()[1]) - this.xC(this.xF.domain()[0])
        )
        .attr("x", this.xC(this.xF.domain()[0]));
    }


  };


  this.renderChart = function (t, offset) {
    this.updateFocus(t, offset);
    this.updateContext(t);
  };



  this.pointClick = function (d) {
    if (d) {
      this.showInfo(d, true);
      if (this.selected) {
        this.permanent = true;
        d3.event.stopPropagation();
      } else this.hideInfo();
    }

  };

  this.showInfo = function (d, onClick) {
    let options = {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    };
    let duration = onClick ? 0 : 150;
    let name = onClick ? "click" : "hover";
    this.selected = d;
    this.moveInfoWindow();

    this.infoWindow
      .style("z-index", "100")
      .style("opacity", 0)
      .html(
        `<div>${new Date(d.time).toLocaleString("de-DE", options)}</div>
      <hr>
      <div>Messwert: <b>${d.value}</b></div>
      ${Object.prototype.hasOwnProperty.call(d, 'process_quality') ? "<div>Prozessgüte: <b>" +
          Math.round(d.process_quality * 10000)/100 + "%</b></div>" : ""
          }
      <hr>
       ${Object.prototype.hasOwnProperty.call(d, 'dev_abs') ? "<div>Abweichung: <b>" +
          Math.round(d.dev_abs * 10000)/100 + "%</b></div>" : ""
          }
       ${Object.prototype.hasOwnProperty.call(d, 'ooc') ? "<div>OOC: <b>" +
          Math.round(d.ooc * 10000)/100 + "%</b></div>" : ""
          }
       ${Object.prototype.hasOwnProperty.call(d, 'dev_arithmetic') ? "<div>Drift: <b>" +
          Math.round(d.dev_arithmetic * 10000)/100 + "%</b></div>" : ""
          }
      ${Object.prototype.hasOwnProperty.call(d, 'mean_variation') ? "<div>Streuung: <b>" +
          Math.round(d.mean_variation * 10000)/100 + "%</b></div>" : ""
          }
    `

      )
      .transition()
      .duration(duration)
      .style("opacity", 1);

    let lineHeight =
      this.mode === "normal"
        ? this.height -
        (d.process_quality
          ? Math.min(this.yF(d.value), this.yF2(d.process_quality * 100))
          : this.yF(d.value))
        : this.height - this.yF(d.value);
    let lineHeight0 = -+this.focus.select("g.pinToLine line").attr("y1");

    this.focus
      .selectAll("g.pinToLine line")
      .transition(name)
      .duration(duration)
      .attr("y1", -lineHeight);

    this.focus
      .select("g.pinToLine #c1")
      .transition(name)
      .duration(0)
      .attr("cy", -this.height + this.yF(d.value))
      .transition(name)
      .duration(duration)
      .delay(150 * (1 - this.yF(d.value) / (lineHeight - lineHeight0)))
      .attrTween("r", function () {
        return function (t) {
          return styles.pinToLine.r * (t < 0.8 ? t * 1.25 : (1.6 - t) * 1.25);
        };
      });

    if (this.mode === "normal")
      this.focus
        .select("g.pinToLine #c2")
        .attr("display", d.process_quality ? "block" : "none")
        .transition(name)
        .duration(0)
        .attr("cy", -this.height + this.yF2(d.process_quality ? d.process_quality * 100 : 100))
        .transition(name)
        .duration(duration)
        .delay(
        150 *
        (1 -
          this.yF2(d.process_quality ? d.process_quality * 100 : 100) /
          (lineHeight - lineHeight0))
        )
        .attrTween("r", function () {
          return function (t) {
            return styles.pinToLine.r * (t < 0.8 ? t * 1.25 : (1.6 - t) * 1.25);
          };
        });

    this.focus
      .select("g.pinToLine")
      .attr(
      "transform",
      `translate(${this.xF(d.time)},${this.height})`
      );
  };

  this.moveInfo = function(t) {
    let lineHeight =
      this.mode === "normal"
        ? this.height -
        (this.selected.process_quality
          ? Math.min(this.yF(this.selected.value), this.yF2(this.selected.process_quality * 100))
          : this.yF(this.selected.value))
        : this.height - this.yF(this.selected.value);
    let selection = this.focus.select("g.pinToLine");

    selection
      .select("line")
      .attr("y1", -lineHeight);

    selection
      .select("#c1")
      .attr("cy", -this.height + this.yF(this.selected.value));

    if (this.mode === "normal")
      selection
        .select("#c2")
        .attr("cy", -this.height + this.yF2(this.selected.process_quality ? this.selected.process_quality * 100 : 100));

    if (t) selection = selection.transition(t);
    selection
      .attr(
        "transform",
        `translate(${this.xF(this.selected.time)},${this.height})`
      );

    this.moveInfoWindow(t);
  };

  this.moveInfoWindow = function (t) {
    let width = this.infoWindow.node().clientWidth;
    let svgWidth = this.margin.left + this.margin.right + this.width;
    let display = this.xF(this.selected.time) > this.width ||
                  this.xF(this.selected.time) < 0
                    ? 'none'
                    : 'block';
    let left, top, selection;

    if (this.xF(this.selected.time) < this.width / 2) {
      left = (this.xF(this.selected.time) + this.margin.left + 20) + "px";
      top = (this.margin.top + this.yF(this.selected.value) - 30) + "px";
    } else {
      left = (this.xF(this.selected.time) + this.margin.left - width - 20) + "px";
      top = (this.margin.top + this.yF(this.selected.value) - 30) + "px";
    }
    selection = t
      ? this.infoWindow.transition(t)
      : this.infoWindow;
    selection
        .style("left",left)
        .style("top", top)
        .style('display', display);

  };

  this.hideInfo = function () {
    let d = this.selected;

    let lineHeight =
      this.mode === "normal"
        ? this.height -
        (d.process_quality
          ? Math.min(this.yF(d.value), this.yF2(d.process_quality * 100))
          : this.yF(d.value))
        : this.height - this.yF(d.value);

    this.focus
      .selectAll("g.pinToLine line")
      .transition("hover")
      .duration(120)
      .attr("y1", 0);

    this.focus
      .select("g.pinToLine #c1")
      .transition("hover")
      .duration(120)
      .delay(120 * (this.yF(d.value) / lineHeight))
      .attr("r", 1e-6)
      .on("end", () => {
        if (this.selected === d) this.selected = false;
      });

    if (this.mode === "normal")
      this.focus
        .select("g.pinToLine #c2")
        .transition("hover")
        .duration(120)
        .delay(120 * (this.yF2(d.process_quality ? d.process_quality * 100 : 0) / lineHeight))
        .attr("r", 1e-6);

    this.infoWindow
      .transition()
      .duration(120)
      .style("opacity", 0)
      .on("end", () => this.infoWindow.style("z-index", "-1"));

    this.permanent = false;
  };

  this.Xcache = this.width / 2;
  this.onMouseDown = function () {
    this.Xcache = d3.mouse(this.focus.node())[0];

    if (this.selected && this.permanent) {
      this.permanent = false;
      this.hideInfo();
    }
  };


  this.updated = false;
  this.animated = [];

  this.plot = function (object) {
    this.data = object.data;
    this.dataReduced = object.dataReduced;
    this.dataReduced2 = object.dataReduced2;
    this.cfdata = object.cfdata;
    this.cfdata_values = object.cfdata_values;
    this.cfdata_times = object.cfdata_times;
    this.cfdata_red = object.cfdata_red;
    this.cfdata_times_red = object.cfdata_times_red;
    this.cfdata_red2 = object.cfdata_red2;
    this.cfdata_times_red2 = object.cfdata_times_red2;

    this.update("plot");
  };

  this.updateChartData = function(period, same) {
    this.updateContextView();
    this.updateDataView(period, same);
    if (this.mode === "alternative") {
      this.updateSetsView(period);
      this.changeTicks();
    }

    this.bindDataToElems();
  };

  this.bindDataToElems = function() {
    if (this.mode === "normal") {

      this.focus
        .select("path.line")
        .datum(this.dataView.filter(d => d.process_quality), d => d.time);
    }

    this.focus.select("path.chart")
      .datum(this.dataView, d => d.time);

    if (this.zoomLevel > 1) {
      let pins = this.focus
        .select('.pin-group')
        .selectAll(".pin")
        .data(this.dataView, d => d.time);

      pins.enter()
        .append('g')
        .classed('pin', true)
        .classed('new', true);

      pins.exit().classed('remove', true);
    } else {
      this.focus
        .selectAll(".pin").classed('remove', true);
    }
};

  this.startUpdate = function() {
    if (this.mode === "normal") {
      this.focus
        .select("path.line")
        .attr("d", this.line);
    }

    this.focus.select("path.chart")
      .attr("d", this.line1);

    if (this.zoomLevel > 1) {
      this.focus.selectAll('.pin.new')
        .attr("transform", d => `translate(${this.xF(d.time)}, 0)`);
    }


  };

  this.findPoint = function(x, y) {
    let date = this.xF.invert(x);
    let start = this.xF.invert(x - styles.pin.r).getTime();
    let end = this.xF.invert(x + styles.pin.r).getTime();
    let d = this.dataView.find(d =>
      d.time >= start);

    if (!d || d.time > end) return false;

    if ( this.zoomLevel > 1 ) {
      if (
        d.value <= this.yF.invert(y) ||
        (d.oop && Math.abs(this.yF2(d.oop) - y) < styles.pin.r)
      ) return d;
    } else {
      if (
        Math.abs(this.yF(d.value) + this.height - y) < styles.pin.r ||
        (d.oop && Math.abs(this.yF2(d.oop) - y) < styles.pin.r)
      ) return d;
    }
    return false;
  };


  //render elements
  this.initFocus = function() {

    if (this.mode === "normal") {
      // add line
      this.focus
        .append("path")
        .datum(this.dataView)
        .attr("class", "line")
        .attr("d", this.line)
        .attr("fill", "none")
        .attr("stroke", styles.line.stroke)
        .attr("stroke-width", styles.line.strokeWidth);
    }

    // add pins
    this.focus
      .append("g")
      .attr("class", "pin-group");

    this.focus
      .select("g.pin-group")
      .append("path")
      .datum(this.dataView)
      .attr("class", "chart")
      .attr("d", this.line1)
      .attr("fill", "none")
      .style("stroke", styles.pin.stroke)
      .style("stroke-width", styles.pin.strokeWidth);

    // add selected pin
    this.focus
      .append("g")
      .attr("class", "pinToLine")
      .style("cursor", "pointer")
      .append("line")
      .style("stroke", styles.pinToLine.stroke)
      .style("stroke-dasharray", styles.pinToLine.strokeDashArray)
      .style("stroke-width", styles.pinToLine.strokeWidth);

    this.focus
      .select("g.pinToLine")
      .append("line")
      .style("stroke", "transparent")
      .style("stroke-width", styles.pinToLine.r * 2);

    this.focus
      .select("g.pinToLine")
      .selectAll("circle")
      .data(["c1", "c2"])
      .enter()
      .append("circle")
      .attr("id", d => d)
      .attr("r", 1e-6)
      .style("fill", styles.pinToLine.stroke);
  };

  this.initContext = function() {
    this.context
      .append("path")
      .datum(this.contextView)
      .attr("clip-path", `url(#clipNav${this.id})`)
      .attr("class", "line")
      .attr("d", this.line2)
      .attr("fill", "none")
      .attr("stroke-opacity", 0.4)
      .attr("stroke", styles.line.stroke);

    this.context
      .append("g")
      .attr("class", "selected-area")
      .style("filter", `url(#shadow${this.id})`)
      .append("rect")
      .attr("width", this.width)
      .attr("height", this.height2)
      .style("fill", "#e4faff");

    this.context
      .select("g.selected-area")
      .append("path")
      .attr("clip-path", `url(#brush-rect${this.id})`)
      .datum(this.contextView)
      .attr("class", "line")
      .attr("d", this.line2)
      .attr("fill", "none")
      .attr("stroke", styles.pin.stroke);
  };

  this.updateFocus = function(t, offset = 0) {
    let pins =
      this.focus
      .selectAll(".pin");

    let line =
      this.focus
      .select("path.chart");

    if (this.mode === "normal") {
      let qualityLine =
        this.focus
        .select("path.line")
        .attr("d", this.line)
        .attr('transform',
        `translate(${offset},0)`);

      if ( t) {
        qualityLine = qualityLine.transition(t)
          .attr('transform',
            `translate(${offset},0)`);
      }
      qualityLine
        .attr("d", this.line)
        .attr('transform', 'translate(0,0)');
    }

    if (this.zoomLevel > 1) {

      let newPins =
        this.focus
        .selectAll('.pin.new')
        .style("cursor", "pointer")
        .classed("new", false);

      newPins.append("circle")
        .attr("r", styles.pin.r)
        .attr("cy", this.height)
        .style("fill", styles.pin.stroke);

      newPins
        .append("line")
        .style("stroke-width", styles.pin.strokeWidth)
        .attr("y1", this.height);

      pins
        .attr("transform",
          d => `translate(${this.xF(d.time)}, 0)`);

      pins
        .selectAll("line")
        .attr("y2", d => this.yF(d.value))
        .style("stroke", styles.pin.stroke);

      pins
        .selectAll("circle")
        .style("fill", styles.pin.stroke)
        .attr("cy", d => this.yF(d.value));

      if (this.mode==="alternative") {
        let selected = pins.filter( d => this.setsView.indexOf(d) !== -1 );

        selected
          .select("line")
          .style("stroke", styles.brushes.color);
        selected
          .selectAll("circle")
          .style("fill", styles.brushes.color);
      }

      if (t) {
        this.focus
          .select('g.pin-group')
          .attr("transform", `translate(${offset}, 0)`)
          .transition(t)
          .attr("transform", `translate(0, 0)`)
          .on('end', () => this.focus.selectAll('.pin.remove').remove());
      } else {
        this.focus.selectAll('.pin.remove').remove();
      }

      line
        .datum([])
        .attr("d", this.line1)
        .style('opacity', 0);

    } else {

      line.attr("d", this.line1)
        .attr('transform', `translate(${offset},0)`);

      if (t) {
        line = line
          .transition(t);
      }
      line.style('opacity', 1)
        .attr('transform', 'translate(0,0)');
      pins.remove();
    }

  };


  this.updateContext = function(t) {
    const s = this.xF.domain().map(this.xC);

    let line =
      this.context
      .select("path")
      .datum(this.contextView)
      .style("opacity", 1);

    let selected =
      this.context
      .select("g.selected-area path")
      .datum(this.contextView);

    let selection = this.svg
      .selectAll("#brush-rect" + this.id + " rect, .selected-area rect");

    if (t) {
      line = line.transition(t);
      selected = selected.transition(t);
      selection = selection.transition(t);
    }

    line
      .attr("d", this.line2);

    selected
      .attr("d", this.line2);

    selection
      .attr("width", s[1] - s[0])
      .attr("x", s[0]);
  };


}