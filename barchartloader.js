/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


    
 function loadbarchart(dataset){  
     
var headerNames = d3.keys(dataset[0]);

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 500- margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//get the suitable scale for x axis
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);
    
    //can change the width of columns from here
    

//suitable scale for y axis
var y = d3.scale.linear()
    .range([height, 0]);
    
//create x axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

//create y axis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
    

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load the data


    //label to be displayed on x axis
  x.domain(dataset.map(function(d) { return d[headerNames]; }));
  
    //return the range to be displayed on the y axis ( 0 - max data value)
  y.domain([0, d3.max(dataset, function(d) { return d.Value; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
     // .attr("transform","rotate(10)")
      .call(xAxis)
     
      

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y",10)
      .attr("dy", ".95em")
      .style("text-anchor", "end")
      .text("Population");
      
      //create a bar for each district

  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.District); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.Value); })
      .attr("height", function(d) { return height - y(d.Value); });


function total(d) {
  d.Value = +d.Value;
  return d;
}

 }

