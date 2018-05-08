/********************************************************************************/
// Isothermal Process

function isothermal_process(){
  this.process = 'Isothermal';
  this.stroke = 'orange';

  // State 1 variables
  this.state_1 = {};
  this.state_1.values = { p: ambient.p, v: ambient.v, T: ambient.T };

  this.state_1.checkBox = {};
  this.state_1.checkBox.active = { p: true, v: true, T: true };
  this.state_1.checkBox.checked = { p: false, v: false, T: false };
  this.state_1.checkBox.count = 0;

  this.state_1.inputBox = {};
  this.state_1.inputBox.active = { p: false, v: false, T: false };

  // State 2 variables
  this.state_2 = {};
  this.state_2.values = { p: ambient.p, v: ambient.v, T: ambient.T };

  this.state_2.checkBox = {};
  this.state_2.checkBox.active = { p: true, v: true, T: true };
  this.state_2.checkBox.checked = { p: false, v: false, T: false };
  this.state_2.checkBox.count = 0;

  this.state_2.inputBox = {};
  this.state_2.inputBox.active = { p: false, v: false, T: false };

  // Process states
  this.process_states = [];

  // Other variables
  this.known_state = null;
  this.unknown_state = null;
  this.parameter_changed = null;
}

/********************************************************************************/
// Update all the checkbox and inputbox varaibles

isothermal_process.prototype.decide_ux = function(){
  this.updateCounts();

  // Check boxes
  for(d in params){ this.state_1.checkBox.active[d] = true; this.state_2.checkBox.active[d] = true; }

  if(this.state_1.checkBox.count == 2){
    for(d in params){ if(this.state_1.checkBox.checked[d] == false){ this.state_1.checkBox.active[d] = false } }
    if(this.state_2.checkBox.count == 1){
      for(d in params){ if(this.state_2.checkBox.checked[d] == false){ this.state_2.checkBox.active[d] = false } }
    }
  }

  if(this.state_2.checkBox.count == 2){
    for(d in params){ if(this.state_2.checkBox.checked[d] == false){ this.state_2.checkBox.active[d] = false } }
    if(this.state_1.checkBox.count == 1){
      for(d in params){ if(this.state_1.checkBox.checked[d] == false){ this.state_1.checkBox.active[d] = false } }
    }
  }

  // Making check boxes inactive
  if(this.state_1.checkBox.checked.T || (this.state_1.checkBox.checked.p && this.state_1.checkBox.checked.v)){ this.state_2.checkBox.active.T = false; }
  if(this.state_2.checkBox.checked.T || (this.state_2.checkBox.checked.p && this.state_2.checkBox.checked.v)){ this.state_1.checkBox.active.T = false; }

  if(this.state_1.checkBox.checked.T && this.state_2.checkBox.checked.p){ this.state_2.checkBox.active.v = false; }
  if(this.state_1.checkBox.checked.T && this.state_2.checkBox.checked.v){ this.state_2.checkBox.active.p = false; }

  if(this.state_2.checkBox.checked.T && this.state_1.checkBox.checked.p){ this.state_1.checkBox.active.v = false; }
  if(this.state_2.checkBox.checked.T && this.state_1.checkBox.checked.v){ this.state_1.checkBox.active.p = false; }

  // Input boxes
  for(d in params){ this.state_1.inputBox.active[d] = false; this.state_2.inputBox.active[d] = false; }

  if(this.state_1.checkBox.count == 2){
    for(d in params){ if(this.state_1.checkBox.checked[d] == true){ this.state_1.inputBox.active[d] = true } }
    if(this.state_2.checkBox.count == 1){
      for(d in params){ if(this.state_2.checkBox.checked[d] == true){ this.state_2.inputBox.active[d] = true } }
    }
  }

  if(this.state_2.checkBox.count == 2){
    for(d in params){ if(this.state_2.checkBox.checked[d] == true){ this.state_2.inputBox.active[d] = true } }
    if(this.state_1.checkBox.count == 1){
      for(d in params){ if(this.state_1.checkBox.checked[d] == true){ this.state_1.inputBox.active[d] = true } }
    }
  }

  // Figuring out known states
  this.known_state = null; this.unknown_state = null; this.parameter_changed = null;

  if(this.state_1.checkBox.count == 2){ this.known_state = this.state_1;
    if(this.state_2.checkBox.count == 1){ this.unknown_state = this.state_2;
      for(d in params){ if(this.state_2.checkBox.checked[d] == true){ this.parameter_changed = d; } }
    }
  }

  if(this.state_2.checkBox.count == 2){ this.known_state = this.state_2;
    if(this.state_1.checkBox.count == 1){ this.unknown_state = this.state_1;
      for(d in params){ if(this.state_1.checkBox.checked[d] == true){ this.parameter_changed = d; } }
    }
  }

}

/********************************************************************************/
// Update Counts

isothermal_process.prototype.updateCounts = function(){
  this.state_1.checkBox.count = 0;
  this.state_2.checkBox.count = 0;
  for(d in params){
    if(this.state_1.checkBox.checked[d] == true){ this.state_1.checkBox.count++; }
    if(this.state_2.checkBox.checked[d] == true){ this.state_2.checkBox.count++; }
  }
}

/********************************************************************************/
// Compute the process states

isothermal_process.prototype.compute = function(){
  this.process_states = [];

  // Computing the third variable for the known state
  if(this.known_state != null){
    for(d in params){ if(this.known_state.checkBox.checked[d] == false){
      if(d == 'p'){ this.known_state.values.p = getPressure(this.known_state.values.v, this.known_state.values.T); }
      if(d == 'v'){ this.known_state.values.v = getVolume(this.known_state.values.p, this.known_state.values.T); }
      if(d == 'T'){ this.known_state.values.T = getTemperature(this.known_state.values.p, this.known_state.values.v); }
    } }
  }

  // Computing the process states
  if(this.known_state != null && this.unknown_state != null){
    var temp_Constant = null, tempScale = null;
    var pressure_array = [], volume_array = [], temperature_array = [];

    temperature_array = d3.range(num_Points).map((d,i) => { return this.known_state.values.T });
    temp_Constant = this.known_state.values.p*this.known_state.values.v;

    // if pressure is the changing variable
    if(this.parameter_changed == 'p'){
      tempScale = d3.scaleLinear().domain([0, num_Points-1]).range([this.known_state.values.p, this.unknown_state.values.p]);
      pressure_array = d3.range(num_Points).map((d,i) => { return tempScale(i) });
      volume_array = numeric.div(temp_Constant, pressure_array);
    }

    // if pressure is the changing variable
    if(this.parameter_changed == 'v'){
      tempScale = d3.scaleLinear().domain([0, num_Points-1]).range([this.known_state.values.v, this.unknown_state.values.v]);
      volume_array = d3.range(num_Points).map((d,i) => { return tempScale(i) });
      pressure_array = numeric.div(temp_Constant, volume_array);
    }

    // Assigning values to object variables
    this.process_states = [];
    this.process_states = pressure_array.map(d => { return { p: d } });
    this.process_states.forEach((d, i) => { d.v = volume_array[i] });
    this.process_states.forEach((d, i) => { d.T = temperature_array[i] });
    for(d in params){ this.known_state.values[d] = this.process_states[0][d]; this.unknown_state.values[d] = this.process_states.last()[d]; }
  }

}
