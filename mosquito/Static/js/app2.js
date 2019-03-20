var svgWidth = 1000;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 85,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#area")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the area
var area = d3.area()
    .x(function(d) { return x(d.Temperature); })
    .y0(height)
    .y1(function(d) { return y(d.biting_rate); });

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.Temperature); })
    .y(function(d) { return y(d.biting_rate); });


// get the data
var url = "https://raw.githubusercontent.com/pablomaceda3/Visualization_Project/master/data_files/mosquito_life.csv"
// var mosquito_data_url = '/mosquito'

// change to json to be compatible with Flask application
// d3.json(mosquito_data_url).then(function(mosquitoData) {
//   Code to build chart here
// })

d3.csv(url)
  .then(function(error, data) {

  // format the data
  data.forEach(function(d) {
    d.Temperature = +d.Temperature;
    d.biting_rate = +d.biting_rate;
    d.mosquito_develoment_rate = +d.mosquito_develoment_rate;
    d.infection_probability = +d.infection_probability;
    d.fecundity = +d.fecundity;
    d.adult_lifespan = +d.adult_lifespan;
    d.egg_rate_to_adult_survival =+d.egg_rate_to_adult_survival;
    d.transmission_probability = +d.transmission_probability;
  });

  console.log(data.Temperature)

  // scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.Temperature; }));
  y.domain([0, d3.max(data, function(d) { return d.biting_rate; })]);

  // add the area
    svg.append("path")
       .data([data])
       .attr("class", "area")
       .attr("d", area);

  // add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  // add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

});