d3.json("wnvJoin.json", function(error, wnv) {
  if (error) return console.warn(error);
  
  data = wnv;

  var wnvByYear = d3.nest()
    .key(function(d) { return +d.year; })
    .entries(data);

  var year2013 = wnvByYear[5].values;

  var margin = {top: 20, right: 10, bottom: 80, left: 10},
    width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  var x = d3.scale.linear()
    .range([0,width])
    .domain([25,53]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
    // .tickValues(function(d) { return d.monthAbbrev; });

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var tooltip = d3.select("body").append("div").attr("class", "tooltip");


  var chart = d3.selectAll(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("class", "chartContainer")
      .attr("transform", "translate(30,60)");

    y.domain([0, 35]);
    //needs cleanup... y.domain should be calculated based on a formula, not brute-forced with a 35

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.selectAll(".bar")
      .data(year2013)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("id", function(d) {return d.countyID; })
      .attr("x", function(d) { return x(+d.weekNumInYear); })
      .attr("y", function(d) { return y(+d.impCases); })
      .attr("height", function(d) { return height - y(+d.impCases); })
      .attr("width", 10)


      .on("mouseover", function(d) {
        tooltip.transition()
        tooltip.html(

        "<strong>2013</strong> - week " + d.weekNumInYear + ": " + d.impCases + " cases in " + d.impCounty + " County"
        );
        tempColor = this.style.fill;
        d3.select(this)
          .style("fill", "#fc4e2a")
          .on("mouseout", function(d) {
            d3.select(this)
              .style("fill", tempColor)
          });

      });


d3.json("ca_map.json", function(error, ca_map) {

var margin = {top: -70, right: 10, bottom: 20, left: 10};

var width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  var svg = d3.selectAll(".map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "state")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var projection = d3.geo.mercator()
      .scale(1700)
      .center([-112, 33])
      .translate([width, height]);

  var path = d3.geo.path()
      .projection(projection);

  var calcColor = d3.scale.quantize()
      .domain([0, 23])
      .range(d3.range(8).map(function(i) { return "c" + i; }));

  var week = 20090913;

	svg.selectAll(".county")
		.data(topojson.feature(ca_map, ca_map.objects.ca).features)
		.enter().append("path")
        .attr("class", function(d) { return "county"; }) 
        .attr("z-index", "5")
        .attr("id", function(d) { return d.id ;})
        .attr("d", path)
  
  });

})

