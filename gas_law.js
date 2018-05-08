/*******************************************************************************************/
// Gas law relations

function getTemperatureArray(p,v){
  return numeric.mul( numeric.mul(p, v), (1000/R_air) )
}

function getPressureArray(v, T){
  return numeric.mul( numeric.div(T, v), (R_air/1000) )
}

function getVolumeArray(p, T){
  return numeric.mul( numeric.div(T, v), (R_air/1000) )
}

/*******************************************************************************************/

function getVolume(p, T){
  return R_air*T/(p*1000)
}

function getPressure(v, T){
  return (R_air*T/v)/1000
}

function getTemperature(p, v){
  return (p*1000)*v/R_air
}
