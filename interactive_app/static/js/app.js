var svgWidth = 1000;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 85,
  left: 80
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#area")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "Temperature";

var chosenYAxis = "biting_rate";


function buildChoropleth(year) {
  var year_url = `/specific_year/${year}`;
  d3.json(year_url).then(function (yearData) {
    var data = [{
      type: 'choropleth',
      locations: yearData.country,
      z: yearData.incidence,
      colorscale: [
        [0, 'rgb(5, 10, 172)'], [0.35, 'rgb(40, 60, 190)'],
        [0.5, 'rgb(70, 100, 245)'], [0.6, 'rgb(90, 120, 245)'],
        [0.7, 'rgb(106, 137, 247)'], [1, 'rgb(220, 220, 220)']],
      autocolorscale: false,
      reversescale: true,
      marker: {
        line: {
          color: 'rgb(180,180,180)',
          width: 0.5
        }
      },
      tick0: 0,
      zmin: 0,
      dtick: 1000,
      colorbar: {
        autotic: false,
        title: "Incidence per Million"
      }
    }];

    var layout = {
      width: 500,
      height: 500,
      title: `${year} Malaria Incidence (per Million)`,
      geo: {
        resolution: '110',
        showframe: false,
        showcoastlines: false,
        lataxis: {
          range: [-60, 35]
        },
        lonaxis: {
          range: [-135, -20]
        },
        projection: {
          type: 'mercator',
          scale: 1
        }
      }
    }
    Plotly.newPlot('malaria_map', data, layout, { showlink: false });
  });
};


function init() {
  var selector = d3.select("#selDataset");

  d3.json("/years").then((years) => {
    years.forEach((year) => {
      selector
        .append("option")
        .text(year)
        .property("value", year);
    });

    const firstYear = years[0];
    buildChoropleth(firstYear);
  });

  d3.json('/mosquito').then(function (Data) {
    console.log(Data)

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    // parse data
    Data.forEach(function (data) {
      data.Temperature = +data.Temperature;
      data.biting_rate = +data.biting_rate;
      data.mosquito_development_rate = +data.mosquito_development_rate;
      data.infection_probability = +data.infection_probability;
      data.fecundity = +data.fecundity;
      data.adult_lifespan = +data.adult_lifespan;
      data.egg_rate_to_adult_survival = +data.egg_rate_to_adult_survival;
      data.transmission_probability = +data.transmission_probability;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = xScale(Data, chosenXAxis);
    var yLinearScale = yScale(Data, chosenYAxis);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // append x axis
    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);

    chartGroup
      .append("path")
      .data([Data])
      .attr("class", "area");

    chartGroup
      .append("path")
      .data([Data])
      .attr("class", "line");

    renderArea(xLinearScale, yLinearScale, chosenYAxis);

    var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "Temperature") // value to grab for event listener
      .classed("active", true)
      .text("Temperature (°C)");

    // append y axis
    var ylabelsGroup = chartGroup.append("g")

    var biting_ratelabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("value", "biting_rate")
      .classed("active", true)
      .text("Biting Rate (1/day)");

    var mosquito_developmentlabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 15 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("value", "mosquito_development_rate")
      .classed("inactive", true)
      .text("Mosquito development Rate (1/day)");

    var infection_probabilitylabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 30 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("value", "infection_probability")
      .classed("inactive", true)
      .text("Infection Probability");

    var fecunditylabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 45 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("value", "fecundity")
      .classed("inactive", true)
      .text("Fecundity (Eggs per female per day)");

    var adult_lifespanlabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 60 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("value", "adult_lifespan")
      .classed("inactive", true)
      .text("Adult Lifespan (days)");

    var incubation_ratelabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 75 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("value", "incubation_rate")
      .classed("inactive", true)
      .text("Incubation  Rate (1/day)");

    var egg_to_adult_survivallabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 90 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("value", "egg_to_adult_survival")
      .classed("inactive", true)
      .text("Egg to adult survival");

    var transmission_probabilitylabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 105 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("value", "transmission_probability")
      .classed("inactive", true)
      .text("Transmission Probability");




    // y axis labels event listener
    ylabelsGroup.selectAll("text")
      .on("click", function () {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

          // replaces chosenYaxis with value
          chosenYAxis = value;

          // updates y scale for new data
          yLinearScale = yScale(Data, chosenYAxis);

          // updates y axis with transition
          yAxis = renderYAxes(yLinearScale, yAxis);

          // updates circles with new y values
          area = renderArea(xLinearScale, yLinearScale, chosenYAxis);

          // changes classes to change bold text
          console.log(chosenYAxis);
          switch (chosenYAxis) {
            case "biting_rate":
              biting_ratelabel
                .classed("active", true)
                .classed("inactive", false);
              mosquito_developmentlabel
                .classed("active", false)
                .classed("inactive", true);
              infection_probabilitylabel
                .classed("active", false)
                .classed("inactive", true);
              fecunditylabel
                .classed("active", false)
                .classed("inactive", true);
              adult_lifespanlabel
                .classed("active", false)
                .classed("inactive", true);
              incubation_ratelabel
                .classed("active", false)
                .classed("inactive", true);
              egg_to_adult_survivallabel
                .classed("active", false)
                .classed("inactive", true);
              transmission_probabilitylabel
                .classed("active", false)
                .classed("inactive", true);
              break;
            case "mosquito_development_rate":
              biting_ratelabel
                .classed("active", false)
                .classed("inactive", true);
              mosquito_developmentlabel
                .classed("active", true)
                .classed("inactive", false);
              infection_probabilitylabel
                .classed("active", false)
                .classed("inactive", true);
              fecunditylabel
                .classed("active", false)
                .classed("inactive", true);
              adult_lifespanlabel
                .classed("active", false)
                .classed("inactive", true);
              incubation_ratelabel
                .classed("active", false)
                .classed("inactive", true);
              egg_to_adult_survivallabel
                .classed("active", false)
                .classed("inactive", true);
              transmission_probabilitylabel
                .classed("active", false)
                .classed("inactive", true);
              break;
            case "infection_probability":
              biting_ratelabel
                .classed("active", false)
                .classed("inactive", true);
              mosquito_developmentlabel
                .classed("active", false)
                .classed("inactive", true);
              infection_probabilitylabel
                .classed("active", true)
                .classed("inactive", false);
              fecunditylabel
                .classed("active", false)
                .classed("inactive", true);
              adult_lifespanlabel
                .classed("active", false)
                .classed("inactive", true);
              incubation_ratelabel
                .classed("active", false)
                .classed("inactive", true);
              egg_to_adult_survivallabel
                .classed("active", false)
                .classed("inactive", true);
              transmission_probabilitylabel
                .classed("active", false)
                .classed("inactive", true);
              break;
            case "fecundity":
              biting_ratelabel
                .classed("active", false)
                .classed("inactive", true);
              mosquito_developmentlabel
                .classed("active", false)
                .classed("inactive", true);
              infection_probabilitylabel
                .classed("active", false)
                .classed("inactive", true);
              fecunditylabel
                .classed("active", true)
                .classed("inactive", false);
              adult_lifespanlabel
                .classed("active", false)
                .classed("inactive", true);
              incubation_ratelabel
                .classed("active", false)
                .classed("inactive", true);
              egg_to_adult_survivallabel
                .classed("active", false)
                .classed("inactive", true);
              transmission_probabilitylabel
                .classed("active", false)
                .classed("inactive", true);
              break;
            case "adult_lifespan":
              biting_ratelabel
                .classed("active", false)
                .classed("inactive", true);
              mosquito_developmentlabel
                .classed("active", false)
                .classed("inactive", true);
              infection_probabilitylabel
                .classed("active", false)
                .classed("inactive", true);
              fecunditylabel
                .classed("active", false)
                .classed("inactive", true);
              adult_lifespanlabel
                .classed("active", true)
                .classed("inactive", false);
              incubation_ratelabel
                .classed("active", false)
                .classed("inactive", true);
              egg_to_adult_survivallabel
                .classed("active", false)
                .classed("inactive", true);
              transmission_probabilitylabel
                .classed("active", false)
                .classed("inactive", true);
              break;
            case "incubation_rate":
              biting_ratelabel
                .classed("active", false)
                .classed("inactive", true);
              mosquito_developmentlabel
                .classed("active", false)
                .classed("inactive", true);
              infection_probabilitylabel
                .classed("active", false)
                .classed("inactive", true);
              fecunditylabel
                .classed("active", false)
                .classed("inactive", true);
              adult_lifespanlabel
                .classed("active", false)
                .classed("inactive", true);
              incubation_ratelabel
                .classed("active", true)
                .classed("inactive", false);
              egg_to_adult_survivallabel
                .classed("active", false)
                .classed("inactive", true);
              transmission_probabilitylabel
                .classed("active", false)
                .classed("inactive", true);
              break;
            case "egg_to_adult_survival":
              biting_ratelabel
                .classed("active", false)
                .classed("inactive", true);
              mosquito_developmentlabel
                .classed("active", false)
                .classed("inactive", true);
              infection_probabilitylabel
                .classed("active", false)
                .classed("inactive", true);
              fecunditylabel
                .classed("active", false)
                .classed("inactive", true);
              adult_lifespanlabel
                .classed("active", false)
                .classed("inactive", true);
              incubation_ratelabel
                .classed("active", false)
                .classed("inactive", true);
              egg_to_adult_survivallabel
                .classed("active", true)
                .classed("inactive", false);
              transmission_probabilitylabel
                .classed("active", false)
                .classed("inactive", true);
              break;
            case "transmission_probability":
              biting_ratelabel
                .classed("active", false)
                .classed("inactive", true);
              mosquito_developmentlabel
                .classed("active", false)
                .classed("inactive", true);
              infection_probabilitylabel
                .classed("active", false)
                .classed("inactive", true);
              fecunditylabel
                .classed("active", false)
                .classed("inactive", true);
              adult_lifespanlabel
                .classed("active", false)
                .classed("inactive", true);
              incubation_ratelabel
                .classed("active", false)
                .classed("inactive", true);
              egg_to_adult_survivallabel
                .classed("active", false)
                .classed("inactive", true);
              transmission_probabilitylabel
                .classed("active", true)
                .classed("inactive", false);
              break;

          }
        }
      });
  });

}

function optionChanged(newYear) {
  buildChoropleth(newYear);

}

init();

// @TODO: YOUR CODE HERE!


// function used for updating x-scale var upon click on axis label
function xScale(Data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([
      d3.min(Data, d => d[chosenXAxis]) * 0.8,
      d3.max(Data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

function yScale(Data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([
      d3.min(Data, d => d[chosenYAxis]) * 0.8,
      d3.max(Data, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

function renderArea(newXScale, newYScale, chosenYAxis) {
  // define the area
  var area = d3.area()
    .x(d => newXScale(d.Temperature))
    .y0(height)
    .y1(d => newYScale(d[chosenYAxis]));

  // define the line
  var valueline = d3.line()
    .x(d => newXScale(d.Temperature))
    .y(d => newYScale(d[chosenYAxis]));

  // add the area
  chartGroup.selectAll("path.area").attr("d", area);

  // add the line
  chartGroup.selectAll("path.line").attr("d", valueline);
}

// var url = "https://raw.githubusercontent.com/pablomaceda3/Visualization_Project/master/data_files/mosquito_life2.2.csv"

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);


