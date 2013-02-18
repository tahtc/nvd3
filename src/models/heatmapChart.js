nv.models.heatmapChart = function() {
  var heatmap = nv.models.heatmap()
  , xAxis = nv.models.axis()
  , yAxis = nv.models.axis()
  , xTitle = '' // TODO
  , yTitle = '' // TODO
  , title = '' // TODO
  , legend = null //TODO
  ;

  var margin = {top: 20, right: 20, bottom: 300, left: 300}
  , width = null
  , height = null
  ;

  var tooltips = true
  , tooltipFormat = d3.format(',.2f')
  , tooltip = function(value) {
    return '<p>' + tooltipFormat(value) + '<p>';
  }

  , dispatch = d3.dispatch('tooltipShow', 'tooltipHide')
  ;

  xAxis
    .orient('bottom')
    .highlightZero(false)
    .showMaxMin(false)
    ;
  yAxis
    .orient('left')
    .highlightZero(false)
    .showMaxMin(false)
    ;

  //============================================================
  // Private Variables

  var showTooltip = function(e, offsetElement) {
    var left = e.pos[0] + ( (offsetElement && offsetElement.offsetLeft) || 0 ),
        top = e.pos[1] + ( (offsetElement && offsetElement.offsetTop) || 0),
        content = tooltip(e.value);
    nv.tooltip.show([left, top], content, e.value < 0 ? 'n' : 's', null, offsetElement);
  };

  //------------------------------------------------------------

  function chart(selection) {
    selection.each(function(data) {
      var container = d3.select(this),
          that = this;

      var availableWidth = (width  || parseInt(container.style('width')) || 960)
                             - margin.left - margin.right,
          availableHeight = (height || parseInt(container.style('height')) || 400)
                             - margin.top - margin.bottom;

      chart.update = function() { chart(selection) };
      chart.container = this;

      //------------------------------------------------------------
      // Setup Scales

      x = heatmap.xScale();
      y = heatmap.yScale();

      //------------------------------------------------------------
      // Setup containers and skeleton of chart

      var wrap = container.selectAll('g.nv-wrap.nv-heatmapChart').data([data]);
      var gEnter = wrap.enter().append('g').attr('class', 'nvd3 nv-wrap nv-heatmapChart').append('g');
      var g = wrap.select('g');

      gEnter.append('g').attr('class', 'nv-x nv-axis');
      gEnter.append('g').attr('class', 'nv-y nv-axis');
      gEnter.append('g').attr('class', 'nv-heatmapWrap');
      //gEnter.append('g').attr('class', 'nv-legendWrap');

      //------------------------------------------------------------

      //------------------------------------------------------------
      // Legend


      //------------------------------------------------------------
      // Main Chart Component(s)

      heatmap
        .width(availableWidth)
        .height(availableHeight);

      var heatmapWrap = g.select('.nv-heatmapWrap')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .datum(data)
        .call(heatmap);

      //------------------------------------------------------------


      //------------------------------------------------------------
      // Setup Axes

      xAxis
        .scale(x)
        .tickSize(0)
        .rotateLabels(-90)
        ;

      g.select('.nv-x.nv-axis')
        .attr('transform', 'translate(' + margin.left + ',' + (margin.top + availableHeight) + ')')
        .call(xAxis);

      g.select('.nv-x.nv-axis').selectAll('text')
        .style('text-anchor', 'end')
        .style('opacity', 1);

      yAxis
        .scale(y)
        .tickSize(0);

      g.select('.nv-y.nv-axis')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(yAxis);


      g.select('.nv-y.nv-axis').selectAll('text')
        .style('text-anchor', 'end')
        .style('opacity', 1);


      //------------------------------------------------------------


      //============================================================
      // Event Handling/Dispatching (in chart's scope)
      //------------------------------------------------------------

      dispatch.on('tooltipShow', function(e) {
        if (tooltips) showTooltip(e, that.parentNode);
      });

      //============================================================

    });

    return chart;
  }


  //============================================================
  // Event Handling/Dispatching (out of chart's scope)
  //------------------------------------------------------------

  heatmap.dispatch.on('elementMouseover.tooltip', function(e) {
    e.pos = [e.pos[0] +  margin.left, e.pos[1] + margin.top];
    dispatch.tooltipShow(e);
  });

  heatmap.dispatch.on('elementMouseout.tooltip', function(e) {
    dispatch.tooltipHide(e);
  });

  dispatch.on('tooltipHide', function() {
    if (tooltips) nv.tooltip.cleanup();
  });

  //============================================================


  //============================================================
  // Expose Public Variables
  //------------------------------------------------------------

  // expose chart's sub-components
  chart.dispatch = dispatch;
  chart.heatmap = heatmap;
  chart.legend = legend;
  chart.xAxis = xAxis;
  chart.yAxis = yAxis;

  d3.rebind(chart, heatmap, 'colors', 'domain', 'x', 'xDomain', 'y', 'yDomain', 'id');

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

  chart.tooltipContent = function(_) {
    if (!arguments.length) return tooltip;
    tooltip = _;
    return chart;
  };

  chart.tooltipFormat = function(_) {
    if (!arguments.length) return tooltipFormat;
    tooltipFormat = d3.format(_);
    return chart;
  };

  chart.tooltips = function(_) {
    if (!arguments.length) return tooltips;
    tooltips = _;
    return chart;
  };

  //============================================================

  return chart;
};
