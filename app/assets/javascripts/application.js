//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
//= require d3
//= require leaflet
//= require lodash

$(document).ready(function() {

  var longitude = $('#longitude').html();
  var latitude = $('#latitude').html();

 var map = L.map('map', {closePopupOnClick: false});
 map.setView([latitude, longitude], 15);
 marker = L.marker([latitude, longitude]).addTo(map);
 marker.bindPopup('<div id=\'location-popup\' class=\'text-center\'>');
 L.tileLayer('https://api.tiles.mapbox.com/v4/mattskrobis.43e4d029/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWF0dHNrcm9iaXMiLCJhIjoiY2l4bHNzeDFkMDAxcDJ3bnlqamh1emJhdCJ9.47cHuad_oyhd-1xhJ6289w', {
           attribution: '2017 ®',
           maxZoom: 18,
 }).addTo(map);

  $("#location-popup").append(
    '<div>kot</div><i id="loading-image" class="fa fa-circle-o-notch fa-spin" style="font-size:24px"></i>')

      $('#loading-image').bind('ajaxStart', function(){
        debugger
        $(this).show();
      }).bind('ajaxStop', function(){
        $(this).hide();
      });

  var margins = {
      top: 30,
      right: 20,
      bottom: 30,
      left: 50
    },
    width = window.innerWidth - margins.left - margins.right - 30,
    height = (window.innerHeight * 0.45) - margins.top - margins.bottom;

  var dateParser = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");

  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  var xAxis = d3.axisBottom(x).ticks(36);
  var yAxis = d3.axisLeft(y);

  var colorMapping = {
    'pm_2_5_value': ["PM 2.5", "violet"],
    'pm_10_value': ["PM 10", "steelblue"]
  }

  var valueLine = d3.line()
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return y(d.value);
    });

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
    success: function(data) {
      data.forEach(function(d) {
        d.symbol = d[0];
        d.value = +d[1];
        d.date = dateParser(d[2]);
      });

      var maxValue = d3.max(data, function(d) {
        return d.value;
      })

      x.domain(d3.extent(data, function(d) {
        return d.date;
      }));

      y.domain([0, maxValue]);

      var dataNest = d3.nest()
        .key(function(d) {
          return d.symbol;
        })
        .entries(data);

      _.forEach(dataNest, function(d, index) {
        svg.append("path")
          .attr("class", "data-line-" + index)
          .attr("d", valueLine(d.values));
      });

      svg.append("line")
        .style("stroke", "red")
        .attr("x1", 0)
        .attr("y1", y(50))
        .attr("x2", window.innerWidth - margins.left - margins.right - 30)
        .attr("y2", y(50));

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

      var legend = svg.append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 100)
        .attr('transform', 'translate(-40,-10)');

      legend.selectAll('rect')
        .data(dataNest)
        .enter()
        .append("rect")
        .attr("x", width - 16)
        .attr("y", function(d, i) {
          return i * 15;
        })
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function(d) {
          return colorMapping[d.key][1];
        })

      legend.selectAll('text')
        .data(dataNest)
        .enter()
        .append("text")
        .attr("class", "legend-text")
        .attr("x", width - 2)
        .attr("y", function(d, i) {
          return i * 15 + 9;
        })
        .text(function(d) {
          return colorMapping[d.key][0];
        });
    }
  });
  $($("#map img.leaflet-marker-icon")[0]).on('click', function() {
    $(".graph").toggleClass('hidden')
    setPopupText()
  });

  $($("#map")[0]).on('click', function(e) {
    e.preventDefault();
  });

  var icon_src = $(".leaflet-pane.leaflet-marker-pane img")[0].src
  $(".leaflet-pane.leaflet-marker-pane img")[0].src = icon_src.replace('%22)marker-icon.png', '')

  function setPopupText() {
    $.ajax({
      type: "GET",
      contentType: "application/json; charset=utf-8",
      url: '/measurements/current',
      dataType: 'json',
      data: "location_id=" + $('#location-id').html(),
      success: function(data) {
        $("#location-popup").empty();
        $("#location-popup").append("<p>" + data.city_name + " - " + data.location_name + "</p>")
        $("#location-popup").append("<p>Stan na " + data.date + "</p>")
        $("#location-popup").append("<p>Godzina " + data.time + "</p>")
        $("#location-popup").append("PM 2.5: " + data.pm_2_5_value + "µg/m<sup>3</sup></p>")
        $("#location-popup").append("PM 10: " + data.pm_10_value + "µg/m<sup>3</sup></p>")
      }
    })
  }
})
