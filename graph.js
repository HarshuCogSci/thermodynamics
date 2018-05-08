/*******************************************************************************************/
// Initialiing some variables

var lineGen = d3.line().x(function(d){ return d.x }).y(function(d){ return d.y });
var xScale = d3.scaleLinear(), yScale = d3.scaleLinear(),
    xVar = null, yVar = null;
var graph = {};

/*******************************************************************************************/
// Graphing Function

graph.create = function(){
  d3.select('#origin').remove();

  var graph = d3.select('#graph');
  var width = parseInt(graph.style('width'));
  var height = parseInt(graph.style('height'));

  yVar = document.getElementById('yAxis_var').value;
  xVar = document.getElementById('xAxis_var').value;

  xScale.range([0, width-100]);
  yScale.range([0, -(height-100)]);

  var origin = graph.append('g').attrs({ id: 'origin', transform: 'translate(' +50+ ',' +(height-50)+ ')' });
  origin.append('g').attrs({ id: 'xAxis' });
  origin.append('g').attrs({ id: 'yAxis' });

  origin.append('text').attrs({ id: 'xLabel', class: 'axes_label', 'transform': 'translate(' +(0.8*(width-100))+ ',' +30+ ')' });
  origin.append('g').attrs({ class: 'axes_label', 'transform': 'translate(' +-40+ ',' +(-0.8*(height-100))+ ') rotate(-90)' })
                      .append('text').attrs({ id: 'yLabel' });

  origin.append('path').attrs({ id: 'graph_path' }).styles({ 'stroke-width': 2, 'fill': 'none' });

  origin.append('circle').attrs({ id: 's1_circle', r: 4 }).styles({ 'cursor': 'hand', 'opacity': 0.4 });
  origin.append('text').attrs({ class: 'axes_label', id: 's1_text' }).styles({ 'text-anchor': 'middle', 'dominant-baseline': 'middle' }).text(1);

  origin.append('circle').attrs({ id: 's2_circle', r: 4 }).styles({ 'cursor': 'hand', 'opacity': 0.8 });
  origin.append('text').attrs({ class: 'axes_label', id: 's2_text' }).styles({ 'text-anchor': 'middle', 'dominant-baseline': 'middle' }).text(2);
}

/*******************************************************************************************/
// Graphing Function

graph.setup = function(){
  yVar = document.getElementById('yAxis_var').value;
  xVar = document.getElementById('xAxis_var').value;

  xScale.domain([params[xVar].min, params[xVar].max]);
  yScale.domain([params[yVar].min, params[yVar].max]);

  d3.select('#xAxis').call( d3.axisBottom(xScale) );
  d3.select('#yAxis').call( d3.axisLeft(yScale) );

  d3.select('#xLabel').text(params[xVar].name + ' →');
  d3.select('#yLabel').text(params[yVar].name + ' →');

  d3.select('#graph_path').styles({ 'stroke': this.process.stroke });
  d3.select('#s1_circle').styles({ 'fill': this.process.stroke });
  d3.select('#s2_circle').styles({ 'fill': this.process.stroke });
}

/*******************************************************************************************/
// Graphing Function

graph.update = function(){
  var graph_data = this.process.process_states.map(d => { return { x: xScale(d[xVar]), y: yScale(d[yVar]) } });
  d3.select('#graph_path').attrs({ d: lineGen(graph_data) });

  d3.select('#s1_circle').attrs({ cx: xScale(this.process.state_1.values[xVar]), cy: yScale(this.process.state_1.values[yVar]) });
  d3.select('#s2_circle').attrs({ cx: xScale(this.process.state_2.values[xVar]), cy: yScale(this.process.state_2.values[yVar]) });

  d3.select('#s1_text').attrs({ transform: 'translate(' +(xScale(this.process.state_1.values[xVar])+10)+ ',' +(yScale(this.process.state_1.values[yVar])-10)+ ')' });
  d3.select('#s2_text').attrs({ transform: 'translate(' +(xScale(this.process.state_2.values[xVar])+10)+ ',' +(yScale(this.process.state_2.values[yVar])-10)+ ')' });
}

/*******************************************************************************************/
// Axes parameters input events

graph.events = function(){
  d3.select('#yAxis_var').on('change', function(){
    graph.setup(); graph.update();
  })

  d3.select('#xAxis_var').on('change', function(){
    graph.setup(); graph.update();
  })
}
