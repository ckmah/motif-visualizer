var end = [0, 500, 1000, 1980, 1990];
var start = [8, 510, 1012, 1988, 2000];
var b_sites = ['b1', 'b2', 'b3', 'b4', 'b5'];

var SCALE = 0.5;

var BOX_WIDTH = 2000 * SCALE;
var BOX_HEIGHT = 200;

var PROMOTER_SIZE = 2000;
var SEQ_HEIGHT = 50;

function createGeneVisual(gene, b_sites, start, end) {

  var end_pos = end;
  var length = [];

  var scaletest = d3.scale.linear()
    .domain([-2000, 0])
    .range([0, 1000]);

  // setup length for d3js rect
  for (var i = 0; i < start.length; i++) {
    length.push(start[i] - end[i]);
  }

  // add an entry
  d3.select('#wrapper')
    .append('div')
    .attr('id', 'entry');

  // add div MOTIFS container
  d3.select('#entry')
    .append('div')
    .attr({
      'id': gene + '_MOTIFS',
      'class': 'motif_container'
    })
    .style({
      'width': BOX_WIDTH + 'px',
      'height': BOX_HEIGHT + 'px'
    });

  // create MOTIFS svg
  d3.select('#' + gene + '_MOTIFS')
    .append('svg')
    // .scale(scaletest)
    .attr({
      'id': gene + 'svg',
      'width': '100%',
      'height': '100%'
    })

  // add binding site data
  d3.select('#' + gene + 'svg')
    .selectAll('rect')
    .data(end_pos)
    .enter()
    .append('rect')
    .attr({
      'width': function(d, i) {
        return length[i] * SCALE;
      },
      'height': SEQ_HEIGHT,
      'x': function(d, i) {
        return (PROMOTER_SIZE - length[i] - end_pos[i]) * SCALE;
      },
      'y': (BOX_HEIGHT - SEQ_HEIGHT) / 2
    });

  // add large gene label
  d3.select('#entry')
    .append('div')
    .text(gene)
    .attr('class', 'gene_name');

  // binding site text
  d3.select('#' + gene + 'svg')
    .selectAll('text')
    .data(b_sites)
    .enter()
    .append('text')
    .attr('x', function(d, i) {
      return (PROMOTER_SIZE - end_pos[i] - length[i]) * SCALE;
    })
    .attr('y', function(d) {
      return (BOX_HEIGHT - SEQ_HEIGHT) / 2 - 10;
    })
    .attr({
      'class': 'b_sites'
    })
    .text(function(d, i) {
      return '[-' + start[i] + ', -' + end[i] + ']';
    });

  /******************** X-Axis ********************/
  // adding axis
  var xAxisScale = d3.scale.linear()
    .domain([-2000, 0])
    .range([0, 1000]);

  // apply axis scale
  var xAxis = d3.svg.axis()
    .scale(xAxisScale);

  // add to canvas with position and style
  var xAxisGroup = d3.select('#' + gene + '_MOTIFS')
    .append('svg')
    .attr({
      'id': gene + '_axis',
      'width': '100%',
      'height': '100%',
      'class': 'axis'
    })
    .style('margin-top', BOX_HEIGHT - 50 + 'px')
    .append('g')
    .call(xAxis);

  /******************** Brush ********************/
  var brush = d3.svg.brush()

  /******************** Transitions ********************/
  var xscale = d3.scale.linear();

  // initial fade-in
  d3.select('#wrapper')
    .style('opacity', 0)
    .transition()
    .delay(300)
    .duration(500)
    .style('opacity', 1);

  // show data label on mouseover
  d3.select('#' + gene + 'svg')
    .selectAll('rect')
    .on('mouseover', function(d, i) {
      d3.select('#' + gene + 'svg' + ">.b_sites:nth-of-type(" +
        (i + 1) + ")")
        .transition()
        .duration(200)
        .style('opacity', 1)
    })
    .on('mouseout', function(d, i) {
      d3.select('#' + gene + 'svg' + ">.b_sites:nth-of-type(" +
        (i + 1) + ")")
        .transition()
        .duration(200)
        .style('opacity', 0)
    });

}

createGeneVisual('GENE1', b_sites, start, end);