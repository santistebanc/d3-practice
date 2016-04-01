import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

export default class PieChart extends React.Component {
  componentDidMount() {
    var dom =  ReactDOM.findDOMNode(this);
    createChart(dom, this.props);
  }
  shouldComponentUpdate() {
    var dom =  ReactDOM.findDOMNode(this);
    createChart(dom, this.props);
    return false;
  }
  render () {
    return (
      <div>
        <h4> {this.props.title} </h4>
      </div>
    );
  }
}

PieChart.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  title: React.PropTypes.string,
};
PieChart.defaultProps = {
  width: 300,
  height: 350,
  title: 'untitled',
};

function createChart(dom, props){
  //variables used
  var width = props.width;
  var height = props.height;
  width = width + 200;
  var data = props.data;
  var colors = ['#FD9827', '#DA3B21', '#3669C9', '#1D9524', '#971497', '#654578'];
  var sum = data.reduce(function(memo, num){ return memo + num.population; }, 0);


  var chart = d3.select(dom).append('svg').attr('class', 'd3').attr('width', width).attr('height', height)
        .append("g")
          .attr("transform", "translate(" + (props.width/2) + "," + (height/2) + ")");
  var outerRadius = props.width/2.2;
  var innerRadius = props.width/8;
  var arc = d3.svg.arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);

  var pie = d3.layout.pie()
      .value(function (d) { return d.population; });

  var g = chart.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

  g.append("path")
    .style("fill", function(d, i) { return colors[i]; })
    .transition().delay(function(d, i) { return i * 400; }).duration(500)
    .attrTween('d', function(d) {
         var i = d3.interpolate(d.startAngle, d.endAngle);
         return function(t) {
             d.endAngle = i(t);
           return arc(d);
         }
    });
  var center =
  g.filter(function(d) { return d.endAngle - d.startAngle > 0.3; }).append("text").style("fill", "white")
    .attr('transform', function(d){
      return "translate(" + arc.centroid(d) + ")";
    })
    .attr("text-anchor", "middle").attr("dy", ".35em")
    .text(function(d) { return d.value; });

};
