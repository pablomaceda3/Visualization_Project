function buildChoropleth(year) {
  var year_url = `/specific_year/${year}`;
  Plotly.d3.json(year_url).then(function(yearData) {

    console.log(yearData.Country)
    var data = [{
      type: 'choropleth',
      locations: yearData.Country,
      z: yearData.value,
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
      title: "2000 Malaria Incidence (per Million",
      geo: {
        showframe: false, 
        showcoastlines: false, 
        projection: {
          type: 'mercator'
        }
      }
    }
    Plotly.plot('graph', data, layout, {showlink: false});
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