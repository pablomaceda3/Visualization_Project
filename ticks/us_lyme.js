var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 900 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

// Parse the date / time
var	parseDate = d3.time.format("%Y").parse;

var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.time.format("%Y"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("us_lyme_final.csv", function(error, data) {

    data.forEach(function(d) {
        d.Year = parseDate(d.Year);
        d.Incidents = +d.Incidents;
    });
	
  x.domain(data.map(function(d) { return d.Year; }));
  y.domain([0, d3.max(data, function(d) { return d.Incidents; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of Incidents per 100,000");

  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .style("fill", "lightgreen")
      .attr("x", function(d) { return x(d.Year); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.Incidents); })
      .attr("height", function(d) { return height - y(d.Incidents); });

});