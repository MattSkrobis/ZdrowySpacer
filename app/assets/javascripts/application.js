//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
//= require d3
//= require leaflet
//= require lodash

$(document).ready(function(){
  var margins = {top: 30, right: 20, bottom: 30, left: 50},
  width = 1280 - margins.left - margins.right,
  height = 300 - margins.top - margins.bottom;

  var dateParser = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");

  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  var xAxis = d3.axisBottom(x).ticks(36);
  var yAxis = d3.axisLeft(y);

  var valueLine = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.value); });

  var svg = d3.select("div.graph")
      .append("svg")
          .attr("width", width + margins.left + margins.right)
          .attr("height", height + margins.top + margins.bottom)
      .append("g")
          .attr("transform",
                "translate(" + margins.left + "," + margins.top + ")");

  $.ajax({
              type: "GET",
              contentType: "application/json; charset=utf-8",
              url: '/measurements/chart_data',
              dataType: 'json',
              data: "location_id=" + $('#location-id').html(),
              success: function (data) {
                 data.forEach(function(d) {
                     d.symbol = d[0];
                     d.value = +d[1];
                     d.date = dateParser(d[2]);
                 });

                var maxValue = _.max(_.map(data, 'value'));

                var yScale = (height * 50 / (Math.round(maxValue / 10) * 10));

                 x.domain(d3.extent(data, function(d) { return d.date; }));
                 y.domain([0, d3.max(data, function(d) { return d.value; })]);
                   var dataNest = d3.nest()
                       .key(function(d) {return d.symbol;})
                       .entries(data);

                   _.forEach(dataNest, function(d, index) {
                       svg.append("path")
                           .attr("class", "data-line-" + index)
                           .attr("d", valueLine (d.values));
                         });

                svg.append("line")
                    .style("stroke", "red")
                    .attr("x1", 0)
                    .attr("y1", yScale)
                    .attr("x2", 1220)
                    .attr("y2", yScale);

                 svg.append("g")
                     .attr("class", "x axis")
                     .attr("transform", "translate(0," + height + ")")
                     .call(xAxis);

                 svg.append("g")
                     .attr("class", "y axis")
                     .call(yAxis);
      }});
  $($("#map img.leaflet-marker-icon")[0]).on('click', function() {
    $(".graph").toggleClass('hidden')
    setPopupText()
  });

  var icon_src = $(".leaflet-pane.leaflet-marker-pane img")[0].src
  $(".leaflet-pane.leaflet-marker-pane img")[0].src
          = icon_src.replace('%22)marker-icon.png', '')



  function setPopupText() {
    $.ajax({
                type: "GET",
                contentType: "application/json; charset=utf-8",
                url: '/measurements/current',
                dataType: 'json',
                data: "location_id=" + $('#location-id').html(),
                success: function (data) {
                  $("#location-popup").empty();
                  $("#location-popup").append("<p>"+ data.city_name +" - "+data.location_name +"</p>")
                  $("#location-popup").append("<p>Stan na "+data.date+"</p>")
                  $("#location-popup").append("<p>Godzina "+data.time+"</p>")
                  $("#location-popup").append("PM 2.5: "+ data.pm_2_5_value +"µg/m<sup>3</sup></p>")
                  $("#location-popup").append("PM 10: "+ data.pm_10_value +"µg/m<sup>3</sup></p>")
                        }})

  }
})
