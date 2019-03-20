function buildChoropleth(year) {
  var year_url = `/specific_year/${year}`;
  d3.json(year_url).then(function(yearData) {
    var data = [{
      type: 'choropleth',
      locations: yearData.country,
      z: yearData.incidence,
      colorscale: [
        [0,'rgb(5, 10, 172)'],[0.35,'rgb(40, 60, 190)'],
        [0.5,'rgb(70, 100, 245)'], [0.6,'rgb(90, 120, 245)'],
        [0.7,'rgb(106, 137, 247)'],[1,'rgb(220, 220, 220)']],
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
      title:  `${year} Malaria Incidence (per Million)`,
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
    Plotly.newPlot('graph', data, layout, {showlink: false});
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
}

function optionChanged(newYear) {
  buildChoropleth(newYear);
}

init();