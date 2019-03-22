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
d3.csv("https://raw.githubusercontent.com/pablomaceda3/Visualization_Project/master/data_files/Temp_CO2_dataset.csv", function(error, tempData) {
  if (error) throw error;

  console.log(tempData);

  // var formatTime = d3.timeFormat("%B %d, %Y");
  // formatTime(new Date); // "June 30, 2015"

  // Create a function to parse date and time
  var parseTime = d3.timeParse("%Y");

  // Format the data
  tempData.forEach(function(data) {
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
      .html(function(d) {
        return (`<br>Source:${d.Source1} <br>Year: ${(d.Year)} <br>Temperature C:${d.Mean}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
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
      .html(function(d) {
        return (`<br>Source: ${d.Source2}<br>Year:${d.Year}<br>Co2 levels:${d.Co2_data_mean_global}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip2);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup1.on("click", function(data) {
      toolTip2.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
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
  .text("Temperature");

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
