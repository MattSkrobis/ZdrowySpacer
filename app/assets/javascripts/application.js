//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
//= require d3
//= require leaflet

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

                 x.domain(d3.extent(data, function(d) { return d.date; }));
                 y.domain([0, d3.max(data, function(d) { return d.value; })]);
                   var dataNest = d3.nest()
                       .key(function(d) {return d.symbol;})
                       .entries(data);

                   dataNest.forEach(function(d) {
                       svg.append("path")
                           .attr("class", "line")
                           .attr("d", valueLine (d.values));
                         });

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
                  debugger
                  $("#location-popup").append("<p></p>")
                  $("#location-popup").append("<p>Stan na 10.01.2017</p>")
                  $("#location-popup").append("<p>Godzina 19:00</br>30µg\/m<sup>3</sup></p></div>")
                        }})

  }

  // var   "<p>#{@location.name}</p>"/
    // "<p>Stan na 10.01.2017</p>"/
    // "<p>Godzina 19:00</br>30µg\/m<sup>3</sup></p></div>"/
})
