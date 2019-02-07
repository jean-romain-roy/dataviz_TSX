/**
 * Fichier principal permettant de dessiner le graphique demandé. Ce fichier utilise les autres fichiers
 * que vous devez compléter.
 *
 * /!\ Aucune modification n'est nécessaire dans ce fichier!
 */
(function (d3) {
  "use strict";

  /***** Configuration *****/
  var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 80
  };
  var width = 1000 - margin.left - margin.right;
  var height = 600 - margin.top - margin.bottom;

  /***** Échelles *****/
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  /***** Création des éléments *****/
  var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  var tilesGroup = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var files = ["./data/mig_report.csv"];

  // Lecture du CSV
  d3.csv(files, function(d) {

    // Formattage des donnees
    return {
      name: d.Ticker,
      qmv: +d['QMV($)'],
      province: d['HQ Location'],
      sector: d.Sector
    };

  }).then(function(data) {

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0]); 

    // Set the color domain
    var list = d3.map(data, function (d) { return d.province; }).keys();
    color.domain(list);
    
    var nest = d3.nest()
      .key(function(d) { 
        return d.province; 
      }) 
      .key(function(d) { 
        return d.name; 
      }) 
      .rollup(function(values) { 
        return d3.sum(values, function(value) { 
          return value.qmv; 
        }); 
      }); 

    var treemapLayout = d3.treemap()
      .size([width, height])
      .paddingOuter(0);

    var root = d3.hierarchy({
                  values: nest.entries(data)
                }, function(d) { 
                  return d.values; 
                })
                .sum(function(d) { return d.value; })
                .sort(function(a, b) { return b.value - a.value ; });

    treemapLayout(root);

    var tiles = tilesGroup
      .selectAll('rect')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('transform', function(d) {return 'translate(' + [d.x0, d.y0] + ')'});

    tiles
      .append("rect")
      .attr('width', function(d) { return d.x1 - d.x0; })
      .attr('height', function(d) { return d.y1 - d.y0; })
      .attr('fill',function(d){
        if(d.height == 2){
          return "#FFFFFF";
        }else if(d.height == 1){
          return color(d.data.key);
        }else if(d.height == 0){
          return color(d.parent.data.key);
        }
      })
      .attr('stroke',function(d){
        return "#ffffff";
      })
      .on("mouseover", tip.show)					
      .on("mouseout", tip.hide);

      var subsetTiles = tiles.filter(function(d){
        return d.height === 1;
      })

      var labels = [];
      subsetTiles.each(function(d){
        labels.push({
          province: d.data.key,
          x: +d.x0,
          y: +d.y0,
          qvm: +d.value
        })
      });

      var textGroup = tilesGroup
                        .selectAll("text")
                        .data(labels)
                        .enter()
                        .append("text");

      var textLabels = textGroup
                        .attr("x", function(d) { return d.x + 4; })
                        .attr("y", function(d) { return d.y + 20; })
                        .text( function (d) { return d.province; })
                        .attr("font-family", "sans-serif")
                        .attr("font-size", "20px")
                        .attr("fill", "white");


    /***** Création de l'infobulle *****/
    tip.html(function(d) {
      return getToolTipText.call(this, d)
    });
    tilesGroup.call(tip);

  });

})(d3);
