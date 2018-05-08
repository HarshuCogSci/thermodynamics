var checkBox = new Object();

/********************************************************************************/
// Check/uncheck the Check boxes

checkBox.check = function(process){
  for(d in params){
    document.getElementById('s1_' +d+ '_check').checked = process.state_1.checkBox.checked[d];
    document.getElementById('s2_' +d+ '_check').checked = process.state_2.checkBox.checked[d];
  }
}

/********************************************************************************/
// Activate required check boxes

checkBox.activate = function(process){
  d3.selectAll('.s_check').attrs({ 'disabled': true });
  for(d in params){
    document.getElementById('s1_' +d+ '_check').disabled = process.state_1.checkBox.active[d] == true ? null : true;
    document.getElementById('s2_' +d+ '_check').disabled = process.state_2.checkBox.active[d] == true ? null : true;
  }
}

/********************************************************************************/
// Assign events to check boxes

checkBox.events = function(process){
  d3.selectAll('.s_check').on('change', function(){
    var state = d3.select(this).attr('state');
    var d = d3.select(this).attr('data');
    process[state].checkBox.checked[d] = !process[state].checkBox.checked[d];
    process.decide_ux(); process.compute();
    checkBox.activate(process);
    inputBox.activate(process); inputBox.assignValues(process_current);
    graph.update();
  })
}
