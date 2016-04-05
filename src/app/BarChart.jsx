import React from 'react';
import d3 from 'd3';

require('./BarChartStyles.css');

export default class BarChart extends React.Component {
  constructor(props){
    super(props);
  }
  componentDidMount() {
    this.createChart(this.props);
  }
  shouldComponentUpdate(nextProps) {
    this.updateChart(nextProps);
    return false;
  }
  render () {
    //this is just run once when mounting for first time
    return (
      <div ref="wrapper">
        <h3/>
        <div id="chart" ref="chart"/>
      </div>
    );
  }
  createChart(props){
    this.place = d3.select("[data-reactid='" + this.refs.wrapper.getAttribute("data-reactid") + "']");
    this.chartframe = this.place.select('#chart').append('svg').attr('width', '100%').attr('height', '100%');
    this.updateChart(props);
  }
  updateChart(props){
    //this should be called everytime something in the chart has to change
    this.updateTitle(props);
    this.updateBars(props);
  }
  updateTitle(props){
    this.place.select("h3").text(props.title || "Untitled");
  }
  updateBars(props){

    const framewidth = this.refs.chart.offsetWidth;
    const frameheight = this.refs.chart.offsetHeight;

    const chartdata = props.data || [];
    const margin = {top: 30, right: 10, bottom: 30, left: 50};

    const height = frameheight - margin.top - margin.bottom,
    width = framewidth - margin.left - margin.right,
    barWidth = 40,
    barOffset = 20;

    var dynamicColor;
    var yScale = d3.scale.linear()
    .domain([0, d3.max(chartdata,d=>d.value)])
    .range([0, height])

    var xScale = d3.scale.ordinal()
    .domain(d3.range(0, chartdata.length))
    .rangeBands([0, width])

    var colors = d3.scale.linear()
    .domain([0, chartdata.length * 0.33, chartdata.length * 0.66, chartdata.length])
    .range(['#d6e9c6', '#bce8f1', '#faebcc', '#ebccd1'])

    var awesome = this.chartframe.attr('class', 'chart')
    .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
    .selectAll('rect').data(chartdata)
    .enter().append('rect')
    .attr('class','bar')
    .style('fill',(data, i)=>{return colors(i)})
    .attr('width', xScale.rangeBand())
    .attr('x', (data, i)=>{return xScale(i)})
    .attr('height', 0)
    .attr('y', height)
    .on('mouseover', function(data) {
      dynamicColor = this.style.fill;
        d3.select(this).classed("mouseover", true).style('fill',d3.rgb(dynamicColor).darker(0.1));
    })

    .on('mouseout', function (data) {
        d3.select(this).classed("mouseover", false).style('fill',dynamicColor);
    })

    awesome.transition()
    .attr('height', data=>{return yScale(data.value)})
    .attr('y', data=>{return height - yScale(data.value)})
    .delay((data, i)=>{return i * 20})
    .duration(2000)
    .ease('elastic');

    var verticalGuideScale = d3.scale.linear()
    .domain([0, d3.max(chartdata,d=>d.value)])
    .range([height, 0])

    var vAxis = d3.svg.axis()
    .scale(verticalGuideScale)
    .orient('left')
    .ticks(10)

var verticalGuide = d3.select('svg').append('g')
vAxis(verticalGuide)
verticalGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
verticalGuide.selectAll('path')
    .style({fill: 'none', stroke: "#3c763d"})
verticalGuide.selectAll('line')
    .style({stroke: "#3c763d"})

var hAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(chartdata.size)

var horizontalGuide = d3.select('svg').append('g')
hAxis(horizontalGuide)
horizontalGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')')
horizontalGuide.selectAll('path')
    .style({fill: 'none', stroke: "#3c763d"})
horizontalGuide.selectAll('line')
    .style({stroke: "#3c763d"});
  }
}
