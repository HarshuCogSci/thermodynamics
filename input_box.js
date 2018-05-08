var inputBox = new Object();

/********************************************************************************/
// Assign Values to Input Boxes

inputBox.assignValues = function(process){
  for(d in params){
    document.getElementById('s1_' +d+ '_input').value = Math.round(process.state_1.values[d]*100)/100;
    document.getElementById('s2_' +d+ '_input').value = Math.round(process.state_2.values[d]*100)/100;
  }
}

/********************************************************************************/
// Activate required input boxes

inputBox.activate = function(process){
  d3.selectAll('.s_input').attrs({ 'disabled': true });
  for(d in params){
    document.getElementById('s1_' +d+ '_input').disabled = process.state_1.inputBox.active[d] == true ? null : true;
    document.getElementById('s2_' +d+ '_input').disabled = process.state_2.inputBox.active[d] == true ? null : true;
  }
}

/********************************************************************************/
// Assign events to input boxes

inputBox.events = function(process){
  d3.selectAll('.s_input').on('change', function(){
    var state = d3.select(this).attr('state');
    var d = d3.select(this).attr('data');
    process[state].values[d] = this.value;
    process.decide_ux(); process.compute();
    checkBox.activate(process);
    inputBox.activate(process); inputBox.assignValues(process_current);
    graph.update();
  })
}
