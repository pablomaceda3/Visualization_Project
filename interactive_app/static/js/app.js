var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 85,
  left: 160
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
  buildMosquitoViz();
  buildClimateViz();
}

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

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var svg = d3.select("#area")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "Temperature";

var chosenYAxis = "biting_rate";

function buildMosquitoViz() {

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

function buildClimateViz() {
  // Chart Params
  // var svgWidth = 960;
  // var svgHeight = 500;
  var svgWidth = 1200;
  var svgHeight = 700;

  var margin = { top: 20, right: 40, bottom: 60, left: 50 };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
  var svg = d3
    .select(".chart")
    // .select("body")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);


  // var svg = d3
  // .select(".chart")
  // .select("body")
  // .append("svg")
  // .attr("width", svgWidth)
  // .attr("height", svgHeight);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Import data from an external CSV file
  d3.json('/climate').then(function (tempData) {
    console.log(tempData);

    // var formatTime = d3.timeFormat("%B %d, %Y");
    // formatTime(new Date); // "June 30, 2015"

    // Create a function to parse date and time
    var parseTime = d3.timeParse("%Y");

    // Format the data
    tempData.forEach(function (data) {
      data.Year = parseTime(+data.Year);
      // data.Year = (+data.Year);  
      data.Mean = +data.Mean;
      data.Co2_data_mean_global = +data.Co2_data_mean_global;
    });

    // // Create scaling functions
    var xTimeScale = d3.scaleTime()
      .domain([d3.min(tempData, d => d.Year), d3.max(tempData, d => d.Year)])
      .range([0, width]);


    var yLinearScale1 = d3.scaleLinear()
      .domain([d3.min(tempData, d => d.Mean), d3.max(tempData, d => d.Mean)])
      .range([height, 0]);



    var yLinearScale2 = d3.scaleLinear()
      .domain([277, d3.max(tempData, d => d.Co2_data_mean_global)])
      .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xTimeScale)

    var leftAxis = d3.axisLeft(yLinearScale1);
    var rightAxis = d3.axisRight(yLinearScale2);

    // Add x-axis
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // Add y1-axis to the left side of the display
    chartGroup.append("g")
      // Define the color of the axis text
      .classed("red", true)
      .call(leftAxis);

    // Add y2-axis to the right side of the display
    chartGroup.append("g")
      // Define the color of the axis text
      .classed("blue", true)
      .attr("transform", `translate(${width}, 0)`)
      .call(rightAxis);

    // Line generators for each line
    var line1 = d3.line()
      .x(d => xTimeScale(d.Year))
      .y(d => yLinearScale1(d.Mean));

    var line2 = d3.line()
      .x(d => xTimeScale(d.Year))
      .y(d => yLinearScale2(d.Co2_data_mean_global));

    // Append a path for line1
    chartGroup.append("path")
      .data([tempData])
      .attr("d", line1)
      .classed("line red", true);

    // Append a path for line2
    chartGroup.append("path")
      .data([tempData])
      .attr("d", line2)
      .classed("line blue", true);
    // Step 5: Create Circles for Temperature
    // ==============================


    var circlesGroup = chartGroup.selectAll("circle")
      .data(tempData)
      .enter()
      .append("circle")
      .attr("cx", d => xTimeScale(d.Year))
      .attr("cy", d => yLinearScale1(d.Mean))
      .attr("r", "5")
      .attr("fill", "pink")
      .attr("opacity", ".5");

    // Step 6: Initialize tool tip
    // ==============================

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function (d) {
        return (`<br>Year: ${(d.Year)} <br>Temperature C:${d.Mean}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function (data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function (data, index) {
        toolTip.hide(data);
      });
    // Step 5: Create Circles for CO2 levels
    // ==============================
    var circlesGroup1 = chartGroup.selectAll(".circle")
      .data(tempData)
      .enter()
      .append("circle")
      .attr("cx", d => xTimeScale(d.Year))
      .attr("cy", d => yLinearScale2(d.Co2_data_mean_global))
      .attr("r", "5")
      .attr("fill", "blue")
      .attr("opacity", ".5");

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip2 = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function (d) {
        return (`<br>Year:${d.Year}<br>Co2 levels:${d.Co2_data_mean_global}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip2);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup1.on("click", function (data) {
      toolTip2.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function (data, index) {
        toolTip2.hide(data);
      });
    // Append axes titles
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 5)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .classed("red text", true)
      .text("Temperature (Celcius)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
      .classed("year-text text", true)
      .text("Years (1880 to 2017)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 37})`)
      .classed("CO2-text text", true)
      .text("Global Temperatures and CO2 levels");

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.right + 1174)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .classed("blue text", true)
      .text("CO2 global data");

  });

}





//Ticks US

var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 900 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

// Parse the date / time
// var	parseDate = d3.time.format("%Y").parse;

// var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

// var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.axisBottom(xAxis)
    .tickFormat(function(d){ return d.x;});
    

var yAxis = d3.axisLeft(yAxis);


var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

d3.json('/ticks-us').then(function (data) {

    data.forEach(function(d) {
        d.Year = +d.Year;
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

//Ticks Regions

d3.json('/ticks-region').then(function(data) {
  console.log(data);
  data.forEach(function (d) {
      d.Year = +d.Year;
      d.Southwest = +d.Southwest;
      d.Pacific = +d.Pacific;
      d.Gulf = +d.Gulf;
      d.Northeast = +d.Northeast;
      d.Midwest = +d.Midwest;
  });

  var chart = makeLineChart(data, 'Year', {
      'Southwest': {column: 'Southwest'},
      'Pacific': {column: 'Pacific'},
      'Gulf': {column: 'Gulf'},
      'Northeast': {column: 'Northeast'},
      'Midwest': {column: 'Midwest'}
  }, {xAxis: 'Years', yAxis: 'Number of Incidents per 100,000 People'});
  chart.bind("#chart-line1");
  chart.render();

});

function makeLineChart(dataset, xName, yObjs, axisLables) {
  var chartObj = {};
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  chartObj.xAxisLable = axisLables.xAxis;
  chartObj.yAxisLable = axisLables.yAxis;
  /*
   yObjsects format:
   {y1:{column:'',name:'name',color:'color'},y2}
   */

  chartObj.data = dataset;
  chartObj.margin = {top: 15, right: 60, bottom: 30, left: 50};
  chartObj.width = 1200 - chartObj.margin.left - chartObj.margin.right;
  chartObj.height = 2000 - chartObj.margin.top - chartObj.margin.bottom;

// So we can pass the x and y as strings when creating the function
  chartObj.xFunct = function(d){return d[xName]};

// For each yObjs argument, create a yFunction
  function getYFn(column) {
      return function (d) {
          return d[column];
      };
  }

// Object instead of array
  chartObj.yFuncts = [];
  for (var y  in yObjs) {
      yObjs[y].name = y;
      yObjs[y].yFunct = getYFn(yObjs[y].column); //Need this  list for the ymax function
      chartObj.yFuncts.push(yObjs[y].yFunct);
  }

//Formatter functions for the axes
  chartObj.formatAsNumber = d3.format(".0f");
  chartObj.formatAsDecimal = d3.format(".2f");
  chartObj.formatAsCurrency = d3.format("$.2f");
  chartObj.formatAsFloat = function (d) {
      if (d % 1 !== 0) {
          return d3.format(".2f")(d);
      } else {
          return d3.format(".0f")(d);
      }
      
  };

  chartObj.xFormatter = chartObj.formatAsNumber;
  chartObj.yFormatter = chartObj.formatAsFloat;

  chartObj.bisectYear = d3.bisector(chartObj.xFunct).left; //< Can be overridden in definition

//Create scale functions
  chartObj.xScale = d3.scale.linear().range([0, chartObj.width]).domain(d3.extent(chartObj.data, chartObj.xFunct)); //< Can be overridden in definition

// Get the max of every yFunct
  chartObj.max = function (fn) {
      return d3.max(chartObj.data, fn);
  };
  chartObj.yScale = d3.scale.linear().range([chartObj.height, 0]).domain([0, d3.max(chartObj.yFuncts.map(chartObj.max))]);

  chartObj.formatAsYear = d3.format("");

//Create axis
  chartObj.xAxis = d3.svg.axis().scale(chartObj.xScale).orient("bottom").tickFormat(chartObj.xFormatter); //< Can be overridden in definition

  chartObj.yAxis = d3.svg.axis().scale(chartObj.yScale).orient("left").tickFormat(chartObj.yFormatter); //< Can be overridden in definition


// Build line building functions
  function getYScaleFn(yObj) {
      return function (d) {
          return chartObj.yScale(yObjs[yObj].yFunct(d));
      };
  }
  for (var yObj in yObjs) {
      yObjs[yObj].line = d3.svg.line().interpolate("cardinal").x(function (d) {
          return chartObj.xScale(chartObj.xFunct(d));
      }).y(getYScaleFn(yObj));
  }
  

  chartObj.svg;

// Change chart size according to window size
  chartObj.update_svg_size = function () {
      chartObj.width = parseInt(chartObj.chartDiv.style("width"), 10) - (chartObj.margin.left + chartObj.margin.right);

      chartObj.height = 800;

      /* Update the range of the scale with new width/height */
      chartObj.xScale.range([0, chartObj.width]);
      chartObj.yScale.range([chartObj.height, 0]);

      if (!chartObj.svg) {return false;}

      /* Else Update the axis with the new scale */
      chartObj.svg.select('.x.axis').attr("transform", "translate(0," + chartObj.height + ")").call(chartObj.xAxis);
      chartObj.svg.select('.x.axis .label').attr("x", chartObj.width / 2);

      chartObj.svg.select('.y.axis').call(chartObj.yAxis);
      chartObj.svg.select('.y.axis .label').attr("x", -chartObj.height / 2);

      /* Force D3 to recalculate and update the line */
      for (var y  in yObjs) {
          yObjs[y].path.attr("d", yObjs[y].line);
      }
      

      d3.selectAll(".focus.line").attr("y2", chartObj.height);

      chartObj.chartDiv.select('svg').attr("width", chartObj.width + (chartObj.margin.left + chartObj.margin.right)).attr("height", chartObj.height + (chartObj.margin.top + chartObj.margin.bottom));

      chartObj.svg.select(".overlay").attr("width", chartObj.width).attr("height", chartObj.height);
      return chartObj;
  };

  chartObj.bind = function (selector) {
      chartObj.mainDiv = d3.select(selector);
      // Add all the divs to make it centered and responsive
      chartObj.mainDiv.append("div").attr("class", "inner-wrapper").append("div").attr("class", "outer-box").append("div").attr("class", "inner-box");
      chartSelector = selector + " .inner-box";
      chartObj.chartDiv = d3.select(chartSelector);
      d3.select(window).on('resize.' + chartSelector, chartObj.update_svg_size);
      chartObj.update_svg_size();
      return chartObj;
  };

// Render the chart
  chartObj.render = function () {
      //Create SVG element
      chartObj.svg = chartObj.chartDiv.append("svg").attr("class", "chart-area").attr("width", chartObj.width + (chartObj.margin.left + chartObj.margin.right)).attr("height", chartObj.height + (chartObj.margin.top + chartObj.margin.bottom)).append("g").attr("transform", "translate(" + chartObj.margin.left + "," + chartObj.margin.top + ")");

      // Draw Lines
      for (var y  in yObjs) {
          yObjs[y].path = chartObj.svg.append("path").datum(chartObj.data).attr("class", "line").attr("d", yObjs[y].line).style("stroke", color(y)).attr("data-series", y).on("mouseover", function () {
              focus.style("display", null);
          }).on("mouseout", function () {
              focus.transition().delay(700).style("display", "none");
          }).on("mousemove", mousemove);
      }
      

      // Draw Axis
      chartObj.svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + chartObj.height + ")").call(chartObj.xAxis).append("text").attr("class", "label").attr("x", chartObj.width / 2).attr("y", 30).style("text-anchor", "middle").text(chartObj.xAxisLable);

      chartObj.svg.append("g").attr("class", "y axis").call(chartObj.yAxis).append("text").attr("class", "label").attr("transform", "rotate(-90)").attr("y", -42).attr("x", -chartObj.height / 2).attr("dy", ".71em").style("text-anchor", "middle").text(chartObj.yAxisLable);

      //Draw tooltips
      var focus = chartObj.svg.append("g").attr("class", "focus").style("display", "none");

      for (var y  in yObjs) {
          yObjs[y].tooltip = focus.append("g");
          yObjs[y].tooltip.append("circle").attr("r", 5);
          yObjs[y].tooltip.append("rect").attr("x", 8).attr("y","-5").attr("width",22).attr("height",'0.75em');
          yObjs[y].tooltip.append("text").attr("x", 9).attr("dy", ".35em");
      }

      // Year label
      focus.append("text").attr("class", "focus year").attr("x", 9).attr("y", 7);
      // Focus line
      focus.append("line").attr("class", "focus line").attr("y1", 0).attr("y2", chartObj.height);

      //Draw legend
      var legend = chartObj.mainDiv.append('div').attr("class", "legend");
      for (var y  in yObjs) {
          series = legend.append('div');
          series.append('div').attr("class", "series-marker").style("background-color", color(y));
          series.append('p').text(y);
          yObjs[y].legend = series;
      }

      // Overlay to capture hover
      chartObj.svg.append("rect").attr("class", "overlay").attr("width", chartObj.width).attr("height", chartObj.height).on("mouseover", function () {
          focus.style("display", null);
      }).on("mouseout", function () {
          focus.style("display", "none");
      }).on("mousemove", mousemove);

      return chartObj;
      function mousemove() {
          var x0 = chartObj.xScale.invert(d3.mouse(this)[0]), i = chartObj.bisectYear(dataset, x0, 1), d0 = chartObj.data[i - 1], d1 = chartObj.data[i];
          try {
              var d = x0 - chartObj.xFunct(d0) > chartObj.xFunct(d1) - x0 ? d1 : d0;
          } catch (e) { return;}
          minY = chartObj.height;
          for (var y  in yObjs) {
              yObjs[y].tooltip.attr("transform", "translate(" + chartObj.xScale(chartObj.xFunct(d)) + "," + chartObj.yScale(yObjs[y].yFunct(d)) + ")");
              yObjs[y].tooltip.select("text").text(chartObj.yFormatter(yObjs[y].yFunct(d)));
              minY = Math.min(minY, chartObj.yScale(yObjs[y].yFunct(d)));
          }

          focus.select(".focus.line").attr("transform", "translate(" + chartObj.xScale(chartObj.xFunct(d)) + ")").attr("y1", minY);
          focus.select(".focus.year").text("Year: " + chartObj.xFormatter(chartObj.xFunct(d)));
      }

  };
  return chartObj;
}

init();
