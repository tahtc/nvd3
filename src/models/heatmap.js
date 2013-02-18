nv.models.heatmap = function() {

  //============================================================
  // Public Variables with Default Settings
  //------------------------------------------------------------

  var margin = {top: 5, right: 5, bottom: 5, left: 5}
    , width = 500
    , height = 500
    , x = d3.scale.ordinal()
    , y = d3.scale.ordinal()
    , id = Math.floor(Math.random() * 100000) //Create semi-unique ID incase user doesn't select one
    , shape = {m: null, n: null}
    , getRow = function(i) { return parseInt(i / shape.n); }
    , getCol = function(i) { return parseInt(i % shape.n); }
    , cellWidth
    , cellHeight
    , domain
    , xDomain
    , yDomain
    , colors
    , palette = d3.scale.quantize()
    , stroke // TODO
    , strokeColor // TODO
    , dispatch = d3.dispatch('elementMouseover', 'elementMouseout');

  //============================================================


  //============================================================
  // Private Variables
  //------------------------------------------------------------



  //============================================================


  function chart(selection) {
    selection.each(function(data) {
      container = d3.select(this);
      shape.m = data.length || null;
      shape.n = data.length && data[0].length || null;

      var flattened = [];
      data = flattened.concat.apply(flattened, data);

      var availableWidth = width - margin.left - margin.right,
      availableHeight = height - margin.top - margin.bottom;

      cellWidth = cellWidth || Math.floor(availableWidth / shape.n);
      cellHeight = cellHeight || Math.floor(availableHeight / shape.m);

      palette.domain(domain).range(colors);

      //------------------------------------------------------------
      // Setup Scales

      x.domain(xDomain).rangeBands([0, availableWidth], .1);
      y.domain(yDomain).rangeBands([0, availableHeight], .1);

      //------------------------------------------------------------
      // Setup containers and skeleton of chart

      var wrap = container.selectAll('g.nv-wrap.nv-heatmap').data([data]);
      var wrapEnter = wrap.enter().append('g').attr('class', 'nvd3 nv-wrap nv-heatmap');
      var gEnter = wrapEnter.append('g').attr('class', 'nv-cells');

      var cells = wrap.select('.nv-cells').selectAll('.nv-cells').data(data);

      cells.enter().append('rect')
        .attr('class', function(d, i) {
          var row = getRow(i);
          var col = getCol(i);
          return 'nv-cell nv-cell-' + row + '' + col + ' nv-row-' + row + ' nv-col-' + col;
        })
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .attr('x', function(d, i) { return getCol(i) * cellWidth; })
        .attr('y', function(d, i) { return getRow(i) * cellHeight; })
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .style('fill', function(d) {
            return palette(d);
        })
        .on('mouseover', function(d, i) {
            d3.select(this).classed('hover', true);
            dispatch.elementMouseover({
              col: getCol(i),
              row: getRow(i),
              value: d,
              pos: [(getCol(i) + .5) * cellWidth, (getRow(i) + .5) * cellHeight],
              index: i,
              e: d3.event,
              id: id,
            });
        })
        .on('mouseout', function() {
          d3.select(this).classed('hover', false);
          dispatch.elementMouseout();
        });
    });

    return chart;
  }


  //============================================================
  // Expose Public Variables
  //------------------------------------------------------------

  chart.dispatch = dispatch;

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin.top    = typeof _.top    != 'undefined' ? _.top    : margin.top;
    margin.right  = typeof _.right  != 'undefined' ? _.right  : margin.right;
    margin.bottom = typeof _.bottom != 'undefined' ? _.bottom : margin.bottom;
    margin.left   = typeof _.left   != 'undefined' ? _.left   : margin.left;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.x = function(_) {
    if (!arguments.length) return x;
    x = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return y;
    y = _;
    return chart;
  };

  chart.xScale = function(_) {
    if (!arguments.length) return x;
    x = _;
    return chart;
  };

  chart.yScale = function(_) {
    if (!arguments.length) return y;
    y = _;
    return chart;
  };

  chart.xDomain = function(_) {
    if (!arguments.length) return xDomain;
    xDomain = _;
    return chart;
  };

  chart.yDomain = function(_) {
    if (!arguments.length) return yDomain;
    yDomain = _;
    return chart;
  };

  chart.id = function(_) {
    if (!arguments.length) return id;
    id = _;
    return chart;
  };

  chart.domain = function(_) {
    if (!arguments.length) return domain;
    domain = _;
    return chart;
  };

    chart.colors = function(_) {
    if (!arguments.length) return colors;
    colors = _;
    return chart;
  };

    chart.palette = function(_) {
    if (!arguments.length) return palette;
    palette = _;
    return chart;
  };
  //============================================================


  return chart;
};
