/* CHEMISTRY-2 FINAL EXAM PREPARATION */
/***** David Williamson, 20191209 *****/

// MOLES
// ACIDS
// LEWIS STRUCTURES
// HYBRIDIZATION
// RULE OF SEVEN
// MOLECULAR STRUCTURE
// ORGANIC CHEMISTRY
// NOMENCLATURE
// FUNCTIONAL GROUPS
// ORGANIC REACTIONS
// INTERMOLECULAR FORCES
// PHASES
// VAPOR PRESSURE
// CONCENTRATION UNITS
// COLLIGATIVE PROPERTIES
// ROULTS LAW
// KINETICS
// RATES
// PLOTTING
// Q VS K
// LE CHATELIERS PRINCIPLE
// BRONSTED ACIDS AND BASES
// WATER, pH, Kw
// BUFFERS
// POLYPROTIC ACIDS
// TITRATIONS
// SOLUBILITY
// Ksp
// THERMO
// ENTROPY
// FREE ENERGY
// REDOX
// GALVANIC CELL
// REDUCTION POTENTIAL
// NERNST EQUATION
// ELECTROPLATING

/* -------------------------------------------------------------- */
// Utilities

// Greatest Common Denominator
gcd = (...arguments) => { 
  let args = [...arguments]
  if (Array.isArray(args[0])) {
    args = [...args[0]]
  }
  initialArgument = args.shift()
  return args.reduce((_gcd, arg) => {
    arg = Math.abs(arg)
    while (arg) {
      let temp = arg
      arg = _gcd % arg
      _gcd = temp
    }
    return _gcd
  }, initialArgument)
}

// Lowest Common Multiple
lcm = (...arguments) => {
  let args = [...arguments]
  if (Array.isArray(args[0])) {
    args = [...args[0]]
  }
  initialArgument = args.shift()
  return args.reduce((_lcm, arg) => {
    arg = arg ? arg : 1 
    return Math.abs(_lcm * arg / gcd(_lcm, arg))
  }, initialArgument)
}

solveQuadratic = (a, b, c) => ({
  x1: (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a) || null,
  x2: (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a) || null
})

const sci = (num) => num.toExponential()

// convert string to string-literal, as long as the placeholders are varaible names.
const literalize = (str) => {
  const divided = str.split(/(\$\{[\w-\[\]]+\})/) // search for ${placeholders}
  return divided.reduce((out, cur) => {
    if (/^\$\{[\w-\[\]]+\}$/.test(cur)) {
      const reference = cur.slice(2, -1)
      // if variable in placeholder refers to array element, pull it out of the array.
      if (/\[/.test(reference)) {
	const split = reference.split(/(\[\d+\])/)
	out += this[split[0]][split[1].slice(1, -1)]
      } else {
	out += this[reference].toString()
      }
    } else {
      out += cur
    }
    return out
  }, '') 
}

// evaluate mathematical formula
const mathEval = (str, figs, expo) => {

  // evaluates mathematical expressions which have no further grouping parentheses
  // operators with equal precedence will be evaluated from left to right
  const operate = (arr) => {
    if (typeof arr === 'object') {
      // get the sides of the equation to the left and right of the operator
      const opLeft = (index) => operate(arr.slice(0, index)) 
      const opRight = (index) => operate(arr.slice(index + 1, arr.length))

      // separate terms
      for (let i = arr.length; i > -1; i--) {
	switch (arr[i]) {
	case '-':
	  if (typeof arr[i - 1] === 'number') {
	    return opLeft(i) - opRight(i)
	  } else {
	    arr.splice(i, 2, arr[i + 1] * -1)
	    return operate(arr)
	  }
	case '+':
	  if (typeof arr[i - 1] === 'number') {
	    return opLeft(i) + opRight(i)
	  } else {
	    arr.splice(i, 1)
	    return operate(arr)
	  }
	} 
      }

      // separate numerator and denominator, factors, remainder
      for (let i = arr.length; i > -1; i--) {
	switch (arr[i]) {
	case '/':
	  let quotient = opLeft(i) / opRight(i)
	  return quotient
	case '*':
	  let product = opLeft(i) * opRight(i)
	  return product
	case '%':
	  return opLeft(i) % opRight(i)
	} 
      }
      
      // separate base from exponent
      for (let i = arr.length; i > -1; i--) {
	if (arr[i] === '**') {
	  return opLeft(i) ** opRight(i)
	}
      }
    }
    arr = typeof arr === 'object' && arr.length === 1 ? arr[0] : arr
    return arr
  }

  // find the innermost groupings, and evaluate them, moving outward.
  const evalParens = (eq) => {
    for (let i = 0; i < eq.length; i++) {
      if (/^[\)]$/.test(eq[i])) {
	for (let j = i - 1; j > -1; j--) {
	  if (/^[\(]$/.test(eq[j])) {
	    return evalParens(eq.slice(0, j)
	      .concat([operate(eq.slice(j + 1, i))])
	      .concat(eq.slice(i + 1, eq.length)))
	  } else if (/^Math\.[a-z]+\($/.test(eq[j])) {
	    let args = [[]]
	    for (const elem of eq.slice(j + 1, i)) {
	      if (/^,$/.test(elem)) {
		args.push([])
	      } else {
		args[args.length - 1].push(elem)
	      }
	    }

	    return evalParens(eq.slice(0, j)
	      .concat([
		Math[eq[j].split(/[\.\(]/)[1]](...args
		  .map((arg) => {
		    return operate(arg)
		  })
		)
	      ])
	      .concat(eq.slice(i + 1, eq.length)))
	  } else if (/^\.toExponential\($/.test(eq[j])) {
	    return evalParens(eq.slice(0, j)
	      .concat(eq.slice(i + 1, eq.length)))
	  }
	}
      }
    }
    
    return operate(eq)
  }

  // convert the string into a manageable array
  const splitter = /(\+|\-|\/|[\d\.]+e[\+|\-]?[\d\.]+|\*{1,2}|Math\.[a-z]+\()|(\.toExponential\()|([\(\),])/
  const arr = str
    .replace(/\s/g, '') // remove spaces
    .split(splitter) // split on parentheses, numbers, operators, Math, and .toExponential(
    .filter((elem) => elem !== '' && elem !== undefined) // remove empty elements and commas
    .map((elem) => {
      if (/^Math\.[A-Z0-2_]+$/.test(elem)) { // evaluate Math.CONSTANTS
	return Math[elem.split(/\./)[1]]
      } else if (/^[\d\.]+(e[\+|\-]?[\d\.]+)?$/.test(elem)) { // evaluate numbers
	return parseFloat(elem) 
      } else {
	return elem
      }
    })


  let evaluation = evalParens(arr)
  if (figs) {
    evaluation = evaluation.toExponential(figs - 1)
    if (expo) {
      return evaluation
    } else {
      let output = ''
      evaluation = evaluation.split('e')
      evaluation = [evaluation[0].replace('.', ''), parseInt(evaluation[1])]
      if (evaluation[1] >= evaluation[0].length) {
	return evaluation[0].padEnd(evaluation[1] + 1, '0')
      } else if (evaluation[1] < 0) {
	evaluation[0] = evaluation[0].padStart(evaluation[0].length + Math.abs(evaluation[1]), '0')
	return evaluation[0].slice(0, 1) + '.' + evaluation.slice(1)
      } else {
	return evaluation[0].slice(0, evaluation[1] + 1) + '.' + evaluation[0].slice(evaluation[1] + 1)
      }
    }
  } else if (expo) {
    return evaluation.toExponential()
  } else {
    return evaluation.toString()
  }
}

// produces random number, inclusive of both maximum and minimum bounds.
const randomize = (a, b, step=1) => {
  let min
  let max
  
  if (b) {
    [min, max] = [a, b]
  } else if (a) {
    [min, max] = [0, a]
  } else {
    return Math.random()
  }

  const difference = max - min
  const quotient = difference / step
  return min + step * Math.round(quotient * Math.random())
}

// creates shuffled indeces, based on input array.
// this was made for the purpoes of the exam project, and may be removed.
const shuffle = (arr) => {
  let nums = []
  let shuffled = []
  arr.forEach((elem, i) => nums.push(i))
  while (nums.length > 0) {
    shuffled.push(nums.splice(randomize(nums.length - 1), 1)[0])
  }
  return shuffled
}



// SYNTHESIS

const synth = {
  cycleTime: (processingTime, workHandlingTime, toolHandlingTime=0) => {
    if (typeof processingTime === 'object') {
      const options = processingTime
      return Object.keys(options).reduce((sum, t) => {
	return sum + options[t]
      }, 0) // min/pc 
    } else {
      return processingTime + workHandlingTime + toolHandlingTime // min/pc 
    }
  },
  batchTime: (options, cycleTime, quantity) => {
    if (typeof options === 'object') {
      const { setupTime, cycleTime, quantity } = options
    } else {
      const setupTime = options
    }
    const total = setupTime + cycleTime * quantity
    return {
      total,
      average: total / quantity
    }	  
  }
}


// CHEMBOARD LOGIC

// Conversions
// Basic Units:
//   mass: gram or kilogram **convert everything to grams**
//   time: second
//   distance: meter
//   pressure: kilopascal
//   volume: liter
//   temperature: kelvin
//   energy: joules

// Constants
const elementalCharge = e = 1.6021766208e-19 // coulombs
const electronVolt = eV = e // joules
const vacuumPermittivity = 8.854187817e-12 // farads per meter
const fineStructureConstant = 0.0072973525664
const speedOfLight = 299792458 // meters per second
const planck  = h = 6.626070040e-34
const reducedPlanck = 6.626069934e-34
const coulombsConstant = 1 / (4 * Math.PI * vacuumPermittivity)
const electronRestMass = 9.10938356e-31 // kg
const bohrRadius = r1 = 5.2917721067e-11 // meters
const gasConstant = R = 8.3144598 // liter-kilopascals per kelvin-mol
const avogadro = 6.02214179e23
const boltzmann = 1.38064852e-23 // meters-squared kilograms square-root-seconds reciprocal-kelvin
const atomicMassUnit = amu = 1.660539040e-27 // kg
const constantVolume = R * 3 / 2 // for monoatomic ideal gas
const constantPressure = R * 5 / 2 // for monoatomic ideal gas
const zeroC = 273.15
const atm = 101.325
const angstrom = 1e-10
const lorenz = 2.44e-8

const vacancies = (temperature=0, energyOfFormation=1, sites=1) => {
  return sites * Math.exp(-energyOfFormation / (boltzman * temperature))
}

const verts = {}
verts.troyOunce = (m=1) => m * 31.1034768
verts.pound = (m=1) => m * 453.592
verts.atmosphere = (P=1) => P * atm
verts.milibar = (P=1) => P * 0.1
verts.celsius = (degrees=0) => degrees + zeroC
verts.farenheit = (degrees=32) => verts.celsius((degrees - 32) * 5 / 9)
verts.angstrom = (d=1) => d * angstrom
verts.radians = (radians) => radians * 180 / Math.PI
verts.degrees = (degrees) => degrees * Math.PI / 180

class Angle {
  constructor (deg, rad) {
    this.degrees = deg || verts.radians(rad)
    this.radians = verts.degrees(deg) || radians
  }
}
const deg = verts.radians
const rad = verts.degrees

// Bohr
const force = (chargeA, chargeB, distance) => coulombsConstant * chargeA * chargeB / Math.pow(distance, 2)
const potential = (radius) => -coulombsConstant * Math.pow(e, 2) / radius
const kinetic = (a, b) => {
  if (b) {
    const mass = a
    const velocity = b
    return mass * Math.pow(velocity, 2) / 2
  } else {
    const radius = a
    return -potential(radius) / 2
  }
}
const getRadius = (principalQuantumNumber) => bohrRadius * Math.pow(principalQuantumNumber, 2)
const bohrEnergy = (nA=1, nB) => nB ? kinetic(getRadius(nA)) - kinetic(getRadius(nB)) : -kinetic(getRadius(nA))
const centripetalAcceleration = (velocity, radius) => Math.pow(velocity, 2) / radius
const velocity = (kineticEnergy=kinetic(r1)) => Math.sqrt(2 * kineticEnergy / electronRestMass)
const momentum = (m=electronRestMass, v=velocity()) => m * v
const rydberg = -bohrEnergy() / (speedOfLight * planck)

class Light {
  constructor (wavelength, frequency, energy) {
    this.wavelength = speedOfLight * planck / energy || speedOfLight / frequency || wavelength // meters
    this.frequency = speedOfLight / this.wavelength
    this.energy = this.frequency * planck // joules
  }
  getWavelength () {
    console.log(`wavelength: ${(this.wavelength * 1e9).toFixed(0)} nm`)
    return this.wavelength
  } 
  getEnergy () {
    console.log(`energy: ${(this.energy / (eV * 1000)).toFixed(0)} keV`)
    return this.energy
  }
}

const getWavelength = (a, b) => {
  const wavelength = new Light(null, null, Math.abs(bohrEnergy(a, b))).wavelength
  console.log(`wavelength: ${(wavelength * 1e9).toFixed(0)} nm`)
  return wavelength
}

const getBindingEnergy = (light, kinetic) => {
  const energy = light.energy || light
  return energy - kinetic
}

// de Broglie
const matterWave = (a, b) => {
  a = b ? a * b : a
  return planck / a
}

// Heisenberg
const uncertainty = (delta) => planck / (4 * Math.PI * delta)

const cutoff = (voltage=1) => planck * speedOfLight / (elementalCharge * voltage)

// lattice 
const getLatticeParameter = (element, atomsPerCell) => {
  const density = element.density * 1e6 // grams per cubic meter
  return Math.pow(atomsPerCell * element.atomicMass / (avogadro * density), 1 / 3)
}

// Brag
const braggs = {}
braggs.dSpacing = (h, k, l, a=1) => {
  if (l) {
    return a / Math.sqrt(Math.pow(h, 2) + Math.pow(k, 2) + Math.pow(l, 2))
  } else {
    const wavelength = h
    const angle = k
    return wavelength / (2 * Math.sin(angle))
  }
}
braggs.angle = (wavelength, dSpacing) => Math.asin(wavelength / (2 * dSpacing))
braggsTheta = (D, r) => Math.atan(r / D)

// Moseley
const moseley = (atomicNumber, transition, energy) => {
  if (transition) {
    return atomicNumber
  } else {
    const getFrequency = (nf, ni) => {
      const sigma = [1, 7.4][nf - 1]
      return rydberg * speedOfLight * ((1 / Math.pow(nf, 2)) - (1 / Math.pow(ni, 2))) * Math.pow(atomicNumber - sigma, 2)
    }
    const levels = [1, 2, 3, 4]
    let lights = []
    for (final of levels.slice(0, 2)) {
      for (initial of levels.slice(final, final + 2)) {
	lights.push(new Light(null, getFrequency(final, initial)))
      }
    }
    return lights
  }
}

// Schrodinger
const getWaveFunction = (Z, a_0) => {
  return (1 / Math.PI) * Math.pow(Z / a_0, 3 / 2) * Math.exp(-Z * r / a_0)
} 

// Electron configurations
// Cr is 4s1 3d5
// Cu is 4s1 3d10
const getConfiguration = (input, long) => {
  let element
  let electrons
  if (typeof(input) === 'object') {
    element = input
    electrons = input.number
  } else {
    element = getElemByNumber(input)
    electrons = input
  }
  const orbitals = [
    null, // this list is one-indexed
    { name: 's', spots: 2 }, 
    { name: 'p', spots: 6 }, 
    { name: 'd', spots: 10 }, 
    { name: 'f', spots: 14 }
  ] 
  let config = { inPeriod: {} }
  let text = ''
  let fullText = ''
  let endText = ''
  let nobleGas = ''
  let arrow = 2 // analogous to pen-and-paper technique
  const appendElectron = (energyLevel, orbital) => {
    energyLevel[orbitals[orbital].name] = energyLevel[orbitals[orbital].name] || 0
    energyLevel[orbitals[orbital].name] += 1
  }
  while (true) {
    let shell = Math.ceil(arrow / 2)
    let subshell = Math.floor(arrow / 2)
    while (subshell > 0) {
      let spots = orbitals[subshell].spots
      let elects = electrons
      while (spots > 0) {
	if (subshell === 1 && spots === 2 && electrons > 0) {
	  if (element.ypos > 1) {
	    if (element.ypos > 7) {
	      element.ypos -= 2
	    }
	    nobleGas = nobleGas || `[${getElemByPos(18, element.ypos - 1).symbol}] `
	  }
	  config.inPeriod = {}
	  endText = ''
	}
	if (electrons > 0) {
	  config[shell] = config[shell] || { s: 0 }
	  appendElectron(config[shell], subshell)
	  appendElectron(config.inPeriod, subshell)
	  spots -= 1
	  electrons -= 1
	} else {
	  // elements[elements.map((e) => e[prop]).indexOf(value)]
	  // console.log(`configuration: ${fullText.slice(0, fullText.length - 2)}`)
	  if (elects !== 0) {
	    text = `${shell}${orbitals[subshell].name}${elects} `
	    fullText += text
	    endText += text
	  }
	  if (!long) {
	    console.log(`configuration: ${nobleGas}${endText.trim()}`)
	  } else {	
	    console.log(`configuration: ${fullText.trim()}`)
	  }		
	  return config
	}  
      }
      
      text = `${shell}${orbitals[subshell].name}${orbitals[subshell].spots} `
      fullText += text
      endText += text
      
      
      shell += 1
      subshell -= 1
    }
    arrow += 1
  }
}

class Gas {
  constructor (P, V, n, T, a=0, b=0) {
    if (P !== null && typeof(P) === 'object') { // object was passed to constructor
      const obj = P
      P = obj.pressure // kilopascals
      V = obj.volume // liters
      n = obj.moles
      T = obj.temperature // degrees, kelvin
      a = obj.a // kilopascal-liters, squared per mol, squared
      b = obj.b // liters per mol
    }
    this.solve(P, V, n, T, a, b) 
  }
  
  solve (P, V, n, T, a=0, b=0) {
    P = P !== null && typeof(P) === 'object' ? P.pressure : P
    V = V !== null && typeof(V) === 'object' ? V.volume : V
    n = n !== null && typeof(n) === 'object' ? n.moles : n
    T = T !== null && typeof(T) === 'object' ? T.temperature : T
    a = a !== null && typeof(a) === 'object' ? a.a : a
    b = b !== null && typeof(b) === 'object' ? b.b : b
    
    for (let val of [P, V, n, T]) {
      val = Number(val)
    }

    this.pressure = P || (n * R * T / (V - (n * b))) - (Math.pow(n, 2) * a / Math.pow(V, 2))
    // Newton-Raphson formula for finding volume
    const realVolume = (Vi, epsilon) => {
      const alpha = a * Math.pow(n, 2) / Math.pow(Vi, 2)
      const tempVol = Vi - ((((P + alpha) * (Vi - (n * b))) - (n * R * T)) / (P - alpha - (alpha * b * n / Vi)))
      if (Math.abs(Vi - tempVol) > epsilon) {
	return realVolume(tempVol, epsilon)
      } else {
	return tempVol
      }
    }
    if (V) {
      this.volume = V
    } else {
      this.volume = n * R * T / P
      if (b) {
	this.volume = realVolume(this.volume, 1e-9) // set epsilon value here
      }
    }
    // needs to be able to compute moles for real gasses
    // this.moles = n || (P + (Math.pow(n, 2) * a / Math.pow(V, 2))) * (V - (n * b)) / (R * T)
    this.moles = n || P * V / (R * T)
    this.temperature = T || (P + (Math.pow(n, 2) * a / Math.pow(V, 2))) * (V - (n * b)) / (n * R)
    this.a = a
    this.b = b
  }
  getPressure () {
    return this.pressure.toExponential()
  }
  getVolume () {
    return this.volume.toExponential()
  }
  getMoles () {
    return this.moles.toExponential()
  }
  getTemperature () {
    return this.temperature.toExponential()
  }
}


// thermodynamics
// 0. if H_a = H_b && H_b = H_c, H_a = H_c
// 1. conservation of energy
// 2. any spontaneous process probably results in more disorder

// kinetic energy can be translational, rotational, or vibrational
// potential energy is energy stored in things like relative height, or tension of a spring, etc.
// internal energy represents kinetic and potential energies on a microscopic scale

// heat is the flow of thermal energy. it is measured in joules
// work is any energy other than heat

// general: deltaU + deltaKE + deltaPE = Q - W
// stationary: deltaU = Q - W
// adiabatic: deltaU + deltaKE + deltaPE = W
// isochoric: deltaU + deltaKE + deltaPE = Q

class Energy {
  constructor (deltaU, deltaKE, deltaPE, heat, work) {
    this.deltaU = deltaU || heat - work - deltaKE - deltaPE
    this.deltaKE = deltaKE || heat - work - deltaU - deltaPE
    this.deltaPE = deltaPE || heat - work - deltaU - deltaKE
    this.heat = heat || deltaU + deltaKE + deltaPE + work
    this.work = work || heat - deltaU - deltaKE - deltaPE
  }
}

class System {
  constructor (energy, pressure, volume, temperature) {
    this.energy = energy
    this.pressure = pressure
    this.volume = volume
    this.temperature = temperature
    this.heat = (deltaE) => this.energy += deltaE
    this.work = (force, distance) => force * distance
    // Hess's Law: enthaply is a state
    // deltaH = H_formation of products - H_formation of reactants
    this.enthalpy = this.energy + (this.pressure * this.volume)
    // this.deltaH = (heat, work, deltaP, deltaV) => heat + work + (deltaP * deltaV)
    this.deltaH = (heatCapacity, mass, deltaT) => heatCapacity * mass * deltaT
  }
}

class State {
  constructor (pressure, volume, temperature) {
    this.pressure = pressure.pressure || pressure
    this.volume = volume.volume || volume
    this.temperature = temperature.temperature || temperature
  }
  isochoric (pressure, temperature, moles=1, Cv=constantVolume) {
    if (typeof(pressure) === 'object') {
      pressure = pressure.pressure
      temperature = pressure.temperature
    }
    return {
      work: 0, 
      heat: moles * Cv * (temperature - this.temperature), 
      deltaU: moles * Cv * (temperature - this.temperature)
    }
  }
  isobaric (volume, temperature, moles=1, Cv=constantVolume, Cp=constantPressure) {
    if (typeof(volume) === 'object') {
      volume = pressure.volume
      temperature = pressure.temperature
    }
    return {
      work: this.pressure * (volume - this.volume) || moles * R * (temperature - this.temperature), 
      heat: moles * Cp * (temperature - this.temperature), 
      deltaU: moles * Cv * (temperature - this.temperature)
    }
  }
  isothermal (pressure, volume, moles=1) {
    if (typeof(pressure) === 'object') {
      pressure = pressure.pressure
      volume = pressure.volume
    }
    return {
      work: moles * R * log(volume / this.volume) || moles * R * log(this.pressure / pressure),
      heat: moles * R * log(volume / this.volume) || moles * R * log(this.pressure / pressure),
      deltaU: 0
    }
  }
  adiabatic (temperature, moles=1, Cv=constantVolume) {
    if (typeof(temperature) === 'object') {
      temperature = temperature.temperature
    }
    return {
      work: -moles * Cv * (temperature - this.temperature), 
      heat: 0, 
      deltaU: moles * Cv * (temperature - this.temperature)
    }
  }
}

const sTP = new State(atm, 22.4, zeroC)

const getGibbsFreeEnergy = (enthalpy, temperature, entropy) => enthalpy - temperature * entropy
const getEnthalpy = (internalEnergy, pressure, volume) => internalEnergy + pressure * volume
const approxDeltaEntropy = (atoms, vacancies) => {
  const selfTimesLog = (x) => x * Math.log(x)
  return boltzmann * (selfTimesLog(atoms + vacancies) - selfTimesLog(vacancies) - selfTimesLog(atoms))
}

const spontaneity = (changeInEnthalpy, temperature, changeInEntropy) => {
  const changeInGibbs = changeInEnthalpy - temperature * changeInEntropy
  return { changeInGibbs, spontaneous: changeInGibbs < 0 }
}

const acidBaseDissolution = (options) => {
  /* This function is used to infer variables associated with the dissolution of an acid or a base,
     when provided known values associated with the dissolution.
     The 'options' parameter is intended to be an object, with one or more properties.
     Acceptable property names can be found inside the abVariables and equilibriumConstants arrays.
     'acid' and 'base' can also be passed in, to indicate the molarity of a monoprotic acid or monohydroxyl base. */
  let hydronium // [H3O+]
  let Ka
  const Kw = 1e-14
  const conjugate = options.conjugate || 0
  const abVariables = ['hydronium', 'hydroxide', 'pH', 'pOH']
  const equilibriumConstants = ['Ka', 'Kb', 'pKa', 'pKb']
  const output = {}

  const getVariables = (input, propNames) => { 
    // takes one variable and determines the other three.
    // Passing in hydronium concentration would assign  hydronium, hydroxide, pH, and pOH properties to output.
    const [acidic, basic, pAcidic, pBasic] = propNames
    output[acidic] = input,
      output[basic] = Kw / input,
      output[pAcidic] = -Math.log10(input),
      output[pBasic] = -Math.log10(Kw / input)
  }
  
  if (typeof options === 'number') {
    hydronium = options
    console.log('options was a number')
  } else {
    getInput = (propNames) => { 
      // reads input passed to acidBaseReaction, and generates an input for getVariables()
      const [acidic, basic, pAcidic, pBasic] = propNames
      if (options.hasOwnProperty(acidic)) {
	return options[acidic]
      } else if (options.hasOwnProperty(basic)) {
	return Kw / options[basic]
      } else if (options.hasOwnProperty(pAcidic)) {
	return Math.pow(10, -options[pAcidic])
      } else if (options.hasOwnProperty(pBasic)) {
	return Math.pow(10, options[pBasic] - 14)
      }
    }
    hydronium = getInput(abVariables)
    Ka = getInput(equilibriumConstants)

    if (typeof Ka !== 'undefined') {
      getVariables(Ka, equilibriumConstants)
      if (options.hasOwnProperty('acid')) { 
	// only when one mole of acid makes one mole of hydronium and one mole of conjugate base
	output.acid = options.acid
	hydronium = solveQuadratic(1, output.Ka + conjugate, -output.Ka * output.acid).x1
      } else if (options.hasOwnProperty('base')) {
	// only when one mole of base makes one mole of hydroxide and one mole of conjugate acid
	output.base = options.base
	hydronium = Kw / solveQuadratic(1, output.Kb + conjugate, -output.Kb * output.base).x1
      }
    }
  }
  
  if (typeof hydronium !== 'undefined') {
    getVariables(hydronium, abVariables)
  }
  
  if (typeof Ka === 'undefined') {
    if (options.hasOwnProperty('acid')) { 
      // only when one mole of acid makes one mole of hydronium and one mole of conjugate base
      output.acid = options.acid
      Ka = Math.pow(output.hydronium, 2) / (output.acid - output.hydronium)
    } else if (options.hasOwnProperty('base')) {
      // only when one mole of base makes one mole of hydroxide and one mole of conjugate acid
      output.base = options.base
      Ka = Kw / Math.pow(output.hydroxide, 2) / (output.base - output.hydroxide)
    }
    if (typeof Ka !== 'undefined') {
      getVariables(Ka, equilibriumConstants)
    }
  }

  return output
}

const getElemByNumber = (n) => elements[n - 1]
const getElemByValue = (value, prop) => elements[elements.map((e) => e[prop]).indexOf(value)]
const getElemByPos = (x, y) => {
  for (let elem of elements) {
    if (elem.xpos === x && elem.ypos === y) {
      return elem
    }
  }
}

class Compound {
  constructor (formula) {
    this.formula = formula
    this.molarMass = 0

    const splitter = {
      onParens: (formula) => formula.split(/(\(.*\)\d+)/g).filter((e) => e !== ''),
      withParens: (component) => component.split(/[\(\)]/).slice(1),
      toElems: (formula) => formula.split(/(?=[A-Z])/),
      splitElem: (elem) => elem.split(/(?<=[a-zA-Z])(?=\d)/)
    }

    const addComponent = (obj, key, num) => {
      if (obj[key]) {
	obj[key] += num
      } else {
	obj[key] = num
      }
    }

    const parseFormula = (formula) => {
      for (let componentString of splitter.onParens(formula)) {
	let componentObj = {}
	let coefficients
	if (componentString.match(/\(/)) {
	  coefficients = splitter.withParens(componentString)
	} else {
	  coefficients = [componentString, 1]
	}
	for (let elem of splitter.toElems(coefficients[0])) {
	  elem = splitter.splitElem(elem)
	  let element = getElemByValue(elem[0], 'symbol')
	  if (elem.length < 2) {
	    elem.push(1)
	  }
	  addComponent(componentObj, element.name, parseInt(elem[1]))
	}
	for (let key in componentObj) {
	  componentObj[key] *= parseInt(coefficients[1])
	  addComponent(this, key, componentObj[key])
	  this.molarMass += getElemByValue(key, 'name').atomic_mass * componentObj[key]
	}
      }
    }

    parseFormula(this.formula)
  }
  getMolarMass () {
    return this.molarMass.toExponential()
  } 
  getMoles (mass=this.mass) {
    this.mass = Number(mass)
    this.moles = this.mass / this.molarMass
    return this.moles.toExponential()
  }
  getMass (moles=this.moles) {
    this.moles = Number(moles)
    this.mass = this.moles * this.molarMass
    return this.mass.toExponential()
  }
  setMolarity (volume) {
    if (!volume) {
      volume = window.volume || sTP.volume // liter
    }
    this.molarity = this.moles / volume
    return this.molarity
  }
  setMoles (moles, volume) {
    this.moles = Number(moles)
    this.mass = this.moles * this.molarMass
    if (!volume) {
      volume = window.volume || sTP.volume // liter
    }
    this.molarity = this.moles / volume
    return this.moles
  }
  setMass (mass, volume) {
    this.mass = Number(mass)
    this.moles = this.mass / this.molarMass
    if (!volume) {
      volume = window.volume || sTP.volume // liter
    }
    this.molarity = this.moles / volume
    return this.mass
  }
  getDSpacing (plane, d) {
    const dSpacing = (d || this.dSpacings[plane] || 0) * angstrom
    console.log(`d spacing: &{dSpacing.toFixed(2)} angstroms`)
    return dSpacing / angstrom
  }
}

const comp = (formula, mass=0, moles=0) => new Compound(formula, mass, moles)
const sample = (compound, mass=1, moles=0, stoich=1) => {
  if (typeof(compound) === 'object') {
    copy = comp(compound.formula)
  } else {
    copy = comp(compound) // user entered a formula
  }
  if (moles) {
    copy.setMoles(moles)
  } else {
    if (mass === null) {
      mass = 1
    }
    copy.setMass(mass)
  }
  copy.setMolarity()
  copy.stoich = stoich
  return copy
}

// Chemical equilibrium

// const getStoichiometryNumbers = (reactants, products) => {
//   ...balance equations alorithm
//   compound.stoichiometry = stoichiometry
// }

const getEquilibrium = (reactants, products, volume) => {     
  // getStoichiometryNumbers(reactants, products)
  volume = volume || window.volume
  const reducer = (acc, val) => Math.pow(val.molarity, val.stoich) * acc
  return products.reduce(reducer, 1) / reactants.reduce(reducer, 1)
}

// BALANCE EQUATIONS
// MAKE LIST OF ELEMENTS
// FOR EACH ELEMENT, MAKE EQUATION WITH A VARIABLE FOR EACH COMPOUND, AND PUT THE COEFFICIENT OF THAT ELEMENT'S SUBSCRIPT, MAKE THE PRODUCTS NEGATIVE
// SOLVE THE SYSTEM OF EQUATIONS
const balanceEquation = (reactants, products) => {
  getCompounds = (_compounds) => _compounds.map((compound) => {
    return typeof compound === 'string' ? comp(compound) : compound
  })
  reactants = getCompounds(reactants)
  products = getCompounds(products)
  
  getElements = (_compounds) => {
    let _elements = new Set()
    for (let compound of _compounds) {
      for (let prop in compound) {
	if ((prop !== 'formula') && (prop !== 'molarMass')) {
	  _elements.add(prop)
	}
      }
    }
    return Array.from(_elements)
  }
  const _elements = Array.from(new Set(getElements(reactants).concat(getElements(products))))

  const equations = _elements.reduce((_equations, element) => {
    let equation = []
    for (let reactant of reactants) {
      if (reactant[element]) {
	equation.push(-reactant[element])
      } else {
	equation.push(0)
      }
    }
    for (let product of products) {
      if (product[element]) {
	equation.push(product[element])
      } else {
	equation.push(0)
      }
    }
    _equations[element] = equation
    return _equations
  }, {})

  let compounds = equations[_elements[0]].map((compound) => [])
  if (compounds.length -1 < _elements) {
    console.log('Too many unknowns to determine.')
    return null
  }

  // Add together any rows which have nonzero values in axis-cell
  let cleanEquations = []
  // loop through each axis equation
  for (let i = 0; i < compounds.length - 1; i++) {
    let clean = new Array(compounds.length).fill(0)
    // loop through each cell in axis equation
    for (let j = 0; j < compounds.length; j++) {
      for (let elem in equations) {
	if (equations[elem][i] !== 0) {
	  clean[j] += equations[elem][j]
	}
      }
    }
    cleanEquations.push(clean)
  }
  
  const operateRows = (i, j) => {
    let coeffII = cleanEquations[i][i]
    let coeffJI = cleanEquations[j][i]		
    if (coeffII && coeffJI) {
      let lcmIJ = lcm(coeffII, coeffJI)
      let sign = coeffII * coeffJI > 0 ? -1 : 1
      let opRowI = [...cleanEquations[i]].map((coeff) => coeff * Math.abs(lcmIJ / coeffII))

      cleanEquations[j] = [...cleanEquations[j]].map((coeff, k) => {
	return (sign * opRowI[k]) + (coeff * Math.abs(lcmIJ / coeffJI))
      })
      let gcdJ = gcd(cleanEquations[j])
      cleanEquations[j] = cleanEquations[j].map((coeff) => coeff / gcdJ)
    }
  }

  for (let i = 0; i < cleanEquations.length; i++) {
    for (let j = i + 1; j < cleanEquations.length; j++) {
      operateRows(i, j)
    }
  }
  
  for (let i = cleanEquations.length - 1; i > -1; i--) {
    for (let j = i - 1; j > -1; j--) {
      operateRows(i, j)
    }
  }	

  cleanEquations.forEach((eq, i) => {
    let indy = eq[eq.length - 1]
    let axis = eq[i]
    eq[i] = indy
    eq[eq.length - 1] = axis
  })
  
  const lowestCommonMultiple = lcm(cleanEquations.map((eq) => eq[eq.length - 1]))
  cleanEquations = cleanEquations.map((eq) => {
    return eq.map((coeff) => coeff * lowestCommonMultiple / eq[eq.length - 1])
  })
  
  let finalMoles = []
  for (let i = 0; i < cleanEquations.length; i++) {
    finalMoles.push(cleanEquations[i][i])
  }
  finalMoles.push(cleanEquations[0][cleanEquations[0].length - 1])
  
  // make sure the finalMoles are small numbers.
  const finalGCD = gcd(finalMoles)
  finalMoles = finalMoles.map((moles) => Math.abs(moles / finalGCD))

  // put the finalMoles into the ractants and products
  reactants.map((reactant) => reactant.setMoles(finalMoles.shift()))
  products.map((product) => product.setMoles(finalMoles.shift()))
  
  // print it out
  let report = ''
  reactants.forEach((reactant, i) => {
    report += `${reactant.moles !== 1 ?reactant.moles : ''} ${reactant.formula}  `
    if (i !== reactants.length - 1) {
      report += '+  '
    }
  })
  report += '=>  '
  products.forEach((product, i) => {
    report += `${product.moles !== 1 ? product.moles : ''} ${product.formula} `
    if (i !== products.length - 1) {
      report += '+  '
    }
  })
  console.log(report)
  return { reactants, products }
}

// kinetic reaction plot
const plotConcentration = (
  k, 
  initial,
  final,
  order
) => {
  if (typeof k === 'object') {
    const {
      k=2.4e47, 
      initial=0,
      final=1,
      order=0
    } = k
  }
  console.log('k, initial, final, order: ', k, initial, final, order)
  if (initial > final) { // reactants
    return [
      (t) => initial - k * t,
      (t) => final + Math.exp(-k * t + Math.log(initial-final)),
      (t) => final + 1 / (k * t + (1 / (initial - final)))
    ][order]
  } else { // products
    return [
      (t) => initial + k * t,
      (t) => final - Math.exp(-k * t + Math.log(final - initial)),
      (t) => final - 1 / (k * t + (1 / (final - initial)))
    ][order]
  }
}

// elements json
const elements = [
  {
    "name": "Hydrogen", 
    "appearance": "colorless gas", 
    "atomic_mass": 1.008, 
    "boil": 20.271, 
    "category": "diatomic nonmetal", 
    "color": null, 
    "density": 0.08988, 
    "discovered_by": "Henry Cavendish", 
    "melt": 13.99, 
    "molar_heat": 28.836, 
    "named_by": "Antoine Lavoisier", 
    "number": 1, 
    "period": 1, 
    "phase": "Gas", 
    "source": "https://en.wikipedia.org/wiki/Hydrogen", 
    "spectral_img": "https://en.wikipedia.org/wiki/File:Hydrogen_Spectra.jpg", 
    "summary": "Hydrogen is a chemical element with chemical symbol H and atomic number 1. With an atomic weight of 1.00794 u, hydrogen is the lightest element on the periodic table. Its monatomic form (H) is the most abundant chemical substance in the Universe, constituting roughly 75% of all baryonic mass.", 
    "symbol": "H", 
    "xpos": 1, 
    "ypos": 1, 
    "shells": [
      1
    ]
  }, 
  {
    "name": "Helium", 
    "appearance": "colorless gas, exhibiting a red-orange glow when placed in a high-voltage electric field", 
    "atomic_mass": 4.0026022, 
    "boil": 4.222, 
    "category": "noble gas", 
    "color": null, 
    "density": 0.1786, 
    "discovered_by": "Pierre Janssen", 
    "melt": 0.95, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 2, 
    "period": 1, 
    "phase": "Gas", 
    "source": "https://en.wikipedia.org/wiki/Helium", 
    "spectral_img": "https://en.wikipedia.org/wiki/File:Helium_spectrum.jpg", 
    "summary": "Helium is a chemical element with symbol He and atomic number 2. It is a colorless, odorless, tasteless, non-toxic, inert, monatomic gas that heads the noble gas group in the periodic table. Its boiling and melting points are the lowest among all the elements.", 
    "symbol": "He", 
    "xpos": 18, 
    "ypos": 1, 
    "shells": [
      2
    ]
  }, 
  {
    "name": "Lithium", 
    "appearance": "silvery-white", 
    "atomic_mass": 6.94, 
    "boil": 1603, 
    "category": "alkali metal", 
    "color": null, 
    "density": 0.534, 
    "discovered_by": "Johan August Arfwedson", 
    "melt": 453.65, 
    "molar_heat": 24.86, 
    "named_by": null, 
    "number": 3, 
    "period": 2, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Lithium", 
    "spectral_img": null, 
    "summary": "Lithium (from Greek:\u03bb\u03af\u03b8\u03bf\u03c2 lithos, \"stone\") is a chemical element with the symbol Li and atomic number 3. It is a soft, silver-white metal belonging to the alkali metal group of chemical elements. Under standard conditions it is the lightest metal and the least dense solid element.", 
    "symbol": "Li", 
    "xpos": 1, 
    "ypos": 2, 
    "shells": [
      2,
      1
    ]
  }, 
  {
    "name": "Beryllium", 
    "appearance": "white-gray metallic", 
    "atomic_mass": 9.01218315, 
    "boil": 2742, 
    "category": "alkaline earth metal", 
    "color": null, 
    "density": 1.85, 
    "discovered_by": "Louis Nicolas Vauquelin", 
    "melt": 1560, 
    "molar_heat": 16.443, 
    "named_by": null, 
    "number": 4, 
    "period": 2, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Beryllium", 
    "spectral_img": null, 
    "summary": "Beryllium is a chemical element with symbol Be and atomic number 4. It is created through stellar nucleosynthesis and is a relatively rare element in the universe. It is a divalent element which occurs naturally only in combination with other elements in minerals.", 
    "symbol": "Be", 
    "xpos": 2, 
    "ypos": 2, 
    "shells": [
      2,
      2
    ]
  }, 
  {
    "name": "Boron", 
    "appearance": "black-brown", 
    "atomic_mass": 10.81, 
    "boil": 4200, 
    "category": "metalloid", 
    "color": null, 
    "density": 2.08, 
    "discovered_by": "Joseph Louis Gay-Lussac", 
    "melt": 2349, 
    "molar_heat": 11.087, 
    "named_by": null, 
    "number": 5, 
    "period": 2, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Boron", 
    "spectral_img": null, 
    "summary": "Boron is a metalloid chemical element with symbol B and atomic number 5. Produced entirely by cosmic ray spallation and supernovae and not by stellar nucleosynthesis, it is a low-abundance element in both the Solar system and the Earth's crust. Boron is concentrated on Earth by the water-solubility of its more common naturally occurring compounds, the borate minerals.", 
    "symbol": "B", 
    "xpos": 13, 
    "ypos": 2, 
    "shells": [
      2,
      3
    ]
  }, 
  {
    "name": "Carbon", 
    "appearance": null, 
    "atomic_mass": 12.011, 
    "boil": null, 
    "category": "polyatomic nonmetal", 
    "color": null, 
    "density": 1.821, 
    "discovered_by": "Ancient Egypt", 
    "melt": null, 
    "molar_heat": 8.517, 
    "named_by": null, 
    "number": 6, 
    "period": 2, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Carbon", 
    "spectral_img": "https://en.wikipedia.org/wiki/File:Carbon_Spectra.jpg", 
    "summary": "Carbon (from Latin:carbo \"coal\") is a chemical element with symbol C and atomic number 6. On the periodic table, it is the first (row 2) of six elements in column (group) 14, which have in common the composition of their outer electron shell. It is nonmetallic and tetravalent\u2014making four electrons available to form covalent chemical bonds.", 
    "symbol": "C", 
    "xpos": 14, 
    "ypos": 2, 
    "shells": [
      2,
      4
    ]
  }, 
  {
    "name": "Nitrogen", 
    "appearance": "colorless gas, liquid or solid", 
    "atomic_mass": 14.007, 
    "boil": 77.355, 
    "category": "diatomic nonmetal", 
    "color": null, 
    "density": 1.251, 
    "discovered_by": "Daniel Rutherford", 
    "melt": 63.15, 
    "molar_heat": null, 
    "named_by": "Jean-Antoine Chaptal", 
    "number": 7, 
    "period": 2, 
    "phase": "Gas", 
    "source": "https://en.wikipedia.org/wiki/Nitrogen", 
    "spectral_img": "https://en.wikipedia.org/wiki/File:Nitrogen_Spectra.jpg", 
    "summary": "Nitrogen is a chemical element with symbol N and atomic number 7. It is the lightest pnictogen and at room temperature, it is a transparent, odorless diatomic gas. Nitrogen is a common element in the universe, estimated at about seventh in total abundance in the Milky Way and the Solar System.", 
    "symbol": "N", 
    "xpos": 15, 
    "ypos": 2, 
    "shells": [
      2,
      5
    ]
  }, 
  {
    "name": "Oxygen", 
    "appearance": null, 
    "atomic_mass": 15.999, 
    "boil": 90.188, 
    "category": "diatomic nonmetal", 
    "color": null, 
    "density": 1.429, 
    "discovered_by": "Carl Wilhelm Scheele", 
    "melt": 54.36, 
    "molar_heat": null, 
    "named_by": "Antoine Lavoisier", 
    "number": 8, 
    "period": 2, 
    "phase": "Gas", 
    "source": "https://en.wikipedia.org/wiki/Oxygen", 
    "spectral_img": "https://en.wikipedia.org/wiki/File:Oxygen_spectre.jpg", 
    "summary": "Oxygen is a chemical element with symbol O and atomic number 8. It is a member of the chalcogen group on the periodic table and is a highly reactive nonmetal and oxidizing agent that readily forms compounds (notably oxides) with most elements. By mass, oxygen is the third-most abundant element in the universe, after hydrogen and helium.", 
    "symbol": "O", 
    "xpos": 16, 
    "ypos": 2, 
    "shells": [
      2,
      6
    ]
  }, 
  {
    "name": "Fluorine", 
    "appearance": null, 
    "atomic_mass": 18.9984031636, 
    "boil": 85.03, 
    "category": "diatomic nonmetal", 
    "color": null, 
    "density": 1.696, 
    "discovered_by": "Andr\u00e9-Marie Amp\u00e8re", 
    "melt": 53.48, 
    "molar_heat": null, 
    "named_by": "Humphry Davy", 
    "number": 9, 
    "period": 2, 
    "phase": "Gas", 
    "source": "https://en.wikipedia.org/wiki/Fluorine", 
    "spectral_img": null, 
    "summary": "Fluorine is a chemical element with symbol F and atomic number 9. It is the lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard conditions. As the most electronegative element, it is extremely reactive:almost all other elements, including some noble gases, form compounds with fluorine.", 
    "symbol": "F", 
    "xpos": 17, 
    "ypos": 2, 
    "shells": [
      2,
      7
    ]
  }, 
  {
    "name": "Neon", 
    "appearance": "colorless gas exhibiting an orange-red glow when placed in a high voltage electric field", 
    "atomic_mass": 20.17976, 
    "boil": 27.104, 
    "category": "noble gas", 
    "color": null, 
    "density": 0.9002, 
    "discovered_by": "Morris Travers", 
    "melt": 24.56, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 10, 
    "period": 2, 
    "phase": "Gas", 
    "source": "https://en.wikipedia.org/wiki/Neon", 
    "spectral_img": "https://en.wikipedia.org/wiki/File:Neon_spectra.jpg", 
    "summary": "Neon is a chemical element with symbol Ne and atomic number 10. It is in group 18 (noble gases) of the periodic table. Neon is a colorless, odorless, inert monatomic gas under standard conditions, with about two-thirds the density of air.", 
    "symbol": "Ne", 
    "xpos": 18, 
    "ypos": 2, 
    "shells": [
      2,
      8
    ]
  }, 
  {
    "name": "Sodium", 
    "appearance": "silvery white metallic", 
    "atomic_mass": 22.989769282, 
    "boil": 1156.09, 
    "category": "alkali metal", 
    "color": null, 
    "density": 0.968, 
    "discovered_by": "Humphry Davy", 
    "melt": 370.944, 
    "molar_heat": 28.23, 
    "named_by": null, 
    "number": 11, 
    "period": 3, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Sodium", 
    "spectral_img": "https://en.wikipedia.org/wiki/File:Sodium_Spectra.jpg", 
    "summary": "Sodium /\u02c8so\u028adi\u0259m/ is a chemical element with symbol Na (from Ancient Greek \u039d\u03ac\u03c4\u03c1\u03b9\u03bf) and atomic number 11. It is a soft, silver-white, highly reactive metal. In the Periodic table it is in column 1 (alkali metals), and shares with the other six elements in that column that it has a single electron in its outer shell, which it readily donates, creating a positively charged atom - a cation.", 
    "symbol": "Na", 
    "xpos": 1, 
    "ypos": 3, 
    "shells": [
      2,
      8, 
      1
    ]
  }, 
  {
    "name": "Magnesium", 
    "appearance": "shiny grey solid", 
    "atomic_mass": 24.305, 
    "boil": 1363, 
    "category": "alkaline earth metal", 
    "color": null, 
    "density": 1.738, 
    "discovered_by": "Joseph Black", 
    "melt": 923, 
    "molar_heat": 24.869, 
    "named_by": null, 
    "number": 12, 
    "period": 3, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Magnesium", 
    "spectral_img": "https://en.wikipedia.org/wiki/File:Magnesium_Spectra.jpg", 
    "summary": "Magnesium is a chemical element with symbol Mg and atomic number 12. It is a shiny gray solid which bears a close physical resemblance to the other five elements in the second column (Group 2, or alkaline earth metals) of the periodic table:they each have the same electron configuration in their outer electron shell producing a similar crystal structure. Magnesium is the ninth most abundant element in the universe.", 
    "symbol": "Mg", 
    "xpos": 2, 
    "ypos": 3, 
    "shells": [
      2,
      8, 
      2
    ]
  }, 
  {
    "name": "Aluminium", 
    "appearance": "silvery gray metallic", 
    "atomic_mass": 26.98153857, 
    "boil": 2743, 
    "category": "post-transition metal", 
    "color": null, 
    "density": 2.7, 
    "discovered_by": null, 
    "melt": 933.47, 
    "molar_heat": 24.2, 
    "named_by": "Humphry Davy", 
    "number": 13, 
    "period": 3, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Aluminium", 
    "spectral_img": null, 
    "summary": "Aluminium (or aluminum; see different endings) is a chemical element in the boron group with symbol Al and atomic number 13. It is a silvery-white, soft, nonmagnetic, ductile metal. Aluminium is the third most abundant element (after oxygen and silicon), and the most abundant metal, in the Earth's crust.", 
    "symbol": "Al", 
    "xpos": 13, 
    "ypos": 3, 
    "shells": [
      2,
      8, 
      3
    ]
  }, 
  {
    "name": "Silicon", 
    "appearance": "crystalline, reflective with bluish-tinged faces", 
    "atomic_mass": 28.085, 
    "boil": 3538, 
    "category": "metalloid", 
    "color": null, 
    "density": 2.329, 
    "discovered_by": "J\u00f6ns Jacob Berzelius", 
    "melt": 1687, 
    "molar_heat": 19.789, 
    "named_by": "Thomas Thomson (chemist)", 
    "number": 14, 
    "period": 3, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Silicon", 
    "spectral_img": "https://en.wikipedia.org/wiki/File:Silicon_Spectra.jpg", 
    "summary": "Silicon is a chemical element with symbol Si and atomic number 14. It is a tetravalent metalloid, more reactive than germanium, the metalloid directly below it in the table. Controversy about silicon's character dates to its discovery.", 
    "symbol": "Si", 
    "xpos": 14, 
    "ypos": 3, 
    "shells": [
      2,
      8, 
      4
    ]
  }, 
  {
    "name": "Phosphorus", 
    "appearance": "colourless, waxy white, yellow, scarlet, red, violet, black", 
    "atomic_mass": 30.9737619985, 
    "boil": null, 
    "category": "polyatomic nonmetal", 
    "color": null, 
    "density": 1.823, 
    "discovered_by": "Hennig Brand", 
    "melt": null, 
    "molar_heat": 23.824, 
    "named_by": null, 
    "number": 15, 
    "period": 3, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Phosphorus", 
    "spectral_img": null, 
    "summary": "Phosphorus is a chemical element with symbol P and atomic number 15. As an element, phosphorus exists in two major forms\u2014white phosphorus and red phosphorus\u2014but due to its high reactivity, phosphorus is never found as a free element on Earth. Instead phosphorus-containing minerals are almost always present in their maximally oxidised state, as inorganic phosphate rocks.", 
    "symbol": "P", 
    "xpos": 15, 
    "ypos": 3, 
    "shells": [
      2,
      8, 
      5
    ]
  }, 
  {
    "name": "Sulfur", 
    "appearance": "lemon yellow sintered microcrystals", 
    "atomic_mass": 32.06, 
    "boil": 717.8, 
    "category": "polyatomic nonmetal", 
    "color": null, 
    "density": 2.07, 
    "discovered_by": "Ancient china", 
    "melt": 388.36, 
    "molar_heat": 22.75, 
    "named_by": null, 
    "number": 16, 
    "period": 3, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Sulfur", 
    "spectral_img": "https://en.wikipedia.org/wiki/File:Sulfur_Spectrum.jpg", 
    "summary": "Sulfur or sulphur (see spelling differences) is a chemical element with symbol S and atomic number 16. It is an abundant, multivalent non-metal. Under normal conditions, sulfur atoms form cyclic octatomic molecules with chemical formula S8.", 
    "symbol": "S", 
    "xpos": 16, 
    "ypos": 3, 
    "shells": [
      2,
      8, 
      6
    ]
  }, 
  {
    "name": "Chlorine", 
    "appearance": "pale yellow-green gas", 
    "atomic_mass": 35.45, 
    "boil": 239.11, 
    "category": "diatomic nonmetal", 
    "color": null, 
    "density": 3.2, 
    "discovered_by": "Carl Wilhelm Scheele", 
    "melt": 171.6, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 17, 
    "period": 3, 
    "phase": "Gas", 
    "source": "https://en.wikipedia.org/wiki/Chlorine", 
    "spectral_img": "https://en.wikipedia.org/wiki/File:Chlorine_spectrum_visible.png", 
    "summary": "Chlorine is a chemical element with symbol Cl and atomic number 17. It also has a relative atomic mass of 35.5. Chlorine is in the halogen group (17) and is the second lightest halogen following fluorine.", 
    "symbol": "Cl", 
    "xpos": 17, 
    "ypos": 3, 
    "shells": [
      2,
      8, 
      7
    ]
  }, 
  {
    "name": "Argon", 
    "appearance": "colorless gas exhibiting a lilac/violet glow when placed in a high voltage electric field", 
    "atomic_mass": 39.9481, 
    "boil": 87.302, 
    "category": "noble gas", 
    "color": null, 
    "density": 1.784, 
    "discovered_by": "Lord Rayleigh", 
    "melt": 83.81, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 18, 
    "period": 3, 
    "phase": "Gas", 
    "source": "https://en.wikipedia.org/wiki/Argon", 
    "spectral_img": "https://en.wikipedia.org/wiki/File:Argon_Spectrum.png", 
    "summary": "Argon is a chemical element with symbol Ar and atomic number 18. It is in group 18 of the periodic table and is a noble gas. Argon is the third most common gas in the Earth's atmosphere, at 0.934% (9,340 ppmv), making it over twice as abundant as the next most common atmospheric gas, water vapor (which averages about 4000 ppmv, but varies greatly), and 23 times as abundant as the next most common non-condensing atmospheric gas, carbon dioxide (400 ppmv), and more than 500 times as abundant as the next most common noble gas, neon (18 ppmv).", 
    "symbol": "Ar", 
    "xpos": 18, 
    "ypos": 3, 
    "shells": [
      2,
      8, 
      8
    ]
  }, 
  {
    "name": "Potassium", 
    "appearance": "silvery gray", 
    "atomic_mass": 39.09831, 
    "boil": 1032, 
    "category": "alkali metal", 
    "color": null, 
    "density": 0.862, 
    "discovered_by": "Humphry Davy", 
    "melt": 336.7, 
    "molar_heat": 29.6, 
    "named_by": null, 
    "number": 19, 
    "period": 4, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Potassium", 
    "spectral_img": "https://en.wikipedia.org/wiki/File:Potassium_Spectrum.jpg", 
    "summary": "Potassium is a chemical element with symbol K (derived from Neo-Latin, kalium) and atomic number 19. It was first isolated from potash, the ashes of plants, from which its name is derived. In the Periodic table, potassium is one of seven elements in column (group) 1 (alkali metals):they all have a single valence electron in their outer electron shell, which they readily give up to create an atom with a positive charge - a cation, and combine with anions to form salts.", 
    "symbol": "K", 
    "xpos": 1, 
    "ypos": 4, 
    "shells": [
      2,
      8, 
      8, 
      1
    ]
  }, 
  {
    "name": "Calcium", 
    "appearance": null, 
    "atomic_mass": 40.0784, 
    "boil": 1757, 
    "category": "alkaline earth metal", 
    "color": null, 
    "density": 1.55, 
    "discovered_by": "Humphry Davy", 
    "melt": 1115, 
    "molar_heat": 25.929, 
    "named_by": null, 
    "number": 20, 
    "period": 4, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Calcium", 
    "spectral_img": "https://en.wikipedia.org/wiki/File:Calcium_Spectrum.png", 
    "summary": "Calcium is a chemical element with symbol Ca and atomic number 20. Calcium is a soft gray alkaline earth metal, fifth-most-abundant element by mass in the Earth's crust. The ion Ca2+ is also the fifth-most-abundant dissolved ion in seawater by both molarity and mass, after sodium, chloride, magnesium, and sulfate.", 
    "symbol": "Ca", 
    "xpos": 2, 
    "ypos": 4, 
    "shells": [
      2,
      8, 
      8, 
      2
    ]
  }, 
  {
    "name": "Scandium", 
    "appearance": "silvery white", 
    "atomic_mass": 44.9559085, 
    "boil": 3109, 
    "category": "transition metal", 
    "color": null, 
    "density": 2.985, 
    "discovered_by": "Lars Fredrik Nilson", 
    "melt": 1814, 
    "molar_heat": 25.52, 
    "named_by": null, 
    "number": 21, 
    "period": 4, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Scandium", 
    "spectral_img": null, 
    "summary": "Scandium is a chemical element with symbol Sc and atomic number 21. A silvery-white metallic d-block element, it has historically been sometimes classified as a rare earth element, together with yttrium and the lanthanoids. It was discovered in 1879 by spectral analysis of the minerals euxenite and gadolinite from Scandinavia.", 
    "symbol": "Sc", 
    "xpos": 3, 
    "ypos": 4, 
    "shells": [
      2,
      8, 
      9, 
      2
    ]
  }, 
  {
    "name": "Titanium", 
    "appearance": "silvery grey-white metallic", 
    "atomic_mass": 47.8671, 
    "boil": 3560, 
    "category": "transition metal", 
    "color": null, 
    "density": 4.506, 
    "discovered_by": "William Gregor", 
    "melt": 1941, 
    "molar_heat": 25.06, 
    "named_by": "Martin Heinrich Klaproth", 
    "number": 22, 
    "period": 4, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Titanium", 
    "spectral_img": null, 
    "summary": "Titanium is a chemical element with symbol Ti and atomic number 22. It is a lustrous transition metal with a silver color, low density and high strength. It is highly resistant to corrosion in sea water, aqua regia and chlorine.", 
    "symbol": "Ti", 
    "xpos": 4, 
    "ypos": 4, 
    "shells": [
      2,
      8, 
      10, 
      2
    ]
  }, 
  {
    "name": "Vanadium", 
    "appearance": "blue-silver-grey metal", 
    "atomic_mass": 50.94151, 
    "boil": 3680, 
    "category": "transition metal", 
    "color": null, 
    "density": 6.0, 
    "discovered_by": "Andr\u00e9s Manuel del R\u00edo", 
    "melt": 2183, 
    "molar_heat": 24.89, 
    "named_by": "Isotopes of vanadium", 
    "number": 23, 
    "period": 4, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Vanadium", 
    "spectral_img": null, 
    "summary": "Vanadium is a chemical element with symbol V and atomic number 23. It is a hard, silvery grey, ductile and malleable transition metal. The element is found only in chemically combined form in nature, but once isolated artificially, the formation of an oxide layer stabilizes the free metal somewhat against further oxidation.", 
    "symbol": "V", 
    "xpos": 5, 
    "ypos": 4, 
    "shells": [
      2,
      8, 
      11, 
      2
    ]
  }, 
  {
    "name": "Chromium", 
    "appearance": "silvery metallic", 
    "atomic_mass": 51.99616, 
    "boil": 2944, 
    "category": "transition metal", 
    "color": null, 
    "density": 7.19, 
    "discovered_by": "Louis Nicolas Vauquelin", 
    "melt": 2180, 
    "molar_heat": 23.35, 
    "named_by": null, 
    "number": 24, 
    "period": 4, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Chromium", 
    "spectral_img": null, 
    "summary": "Chromium is a chemical element with symbol Cr and atomic number 24. It is the first element in Group 6. It is a steely-gray, lustrous, hard and brittle metal which takes a high polish, resists tarnishing, and has a high melting point.", 
    "symbol": "Cr", 
    "xpos": 6, 
    "ypos": 4, 
    "shells": [
      2,
      8, 
      13, 
      1
    ]
  }, 
  {
    "name": "Manganese", 
    "appearance": "silvery metallic", 
    "atomic_mass": 54.9380443, 
    "boil": 2334, 
    "category": "transition metal", 
    "color": null, 
    "density": 7.21, 
    "discovered_by": "Torbern Olof Bergman", 
    "melt": 1519, 
    "molar_heat": 26.32, 
    "named_by": null, 
    "number": 25, 
    "period": 4, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Manganese", 
    "spectral_img": null, 
    "summary": "Manganese is a chemical element with symbol Mn and atomic number 25. It is not found as a free element in nature; it is often found in combination with iron, and in many minerals. Manganese is a metal with important industrial metal alloy uses, particularly in stainless steels.", 
    "symbol": "Mn", 
    "xpos": 7, 
    "ypos": 4, 
    "shells": [
      2,
      8, 
      13, 
      2
    ]
  }, 
  {
    "name": "Iron", 
    "appearance": "lustrous metallic with a grayish tinge", 
    "atomic_mass": 55.8452, 
    "boil": 3134, 
    "category": "transition metal", 
    "color": null, 
    "density": 7.874, 
    "discovered_by": "5000 BC", 
    "melt": 1811, 
    "molar_heat": 25.1, 
    "named_by": null, 
    "number": 26, 
    "period": 4, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Iron", 
    "spectral_img": "https://en.wikipedia.org/wiki/File:Iron_Spectrum.jpg", 
    "summary": "Iron is a chemical element with symbol Fe (from Latin:ferrum) and atomic number 26. It is a metal in the first transition series. It is by mass the most common element on Earth, forming much of Earth's outer and inner core.", 
    "symbol": "Fe", 
    "xpos": 8, 
    "ypos": 4, 
    "shells": [
      2,
      8, 
      14, 
      2
    ]
  }, 
  {
    "name": "Cobalt", 
    "appearance": "hard lustrous gray metal", 
    "atomic_mass": 58.9331944, 
    "boil": 3200, 
    "category": "transition metal", 
    "color": "metallic gray", 
    "density": 8.9, 
    "discovered_by": "Georg Brandt", 
    "melt": 1768, 
    "molar_heat": 24.81, 
    "named_by": null, 
    "number": 27, 
    "period": 4, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Cobalt", 
    "spectral_img": null, 
    "summary": "Cobalt is a chemical element with symbol Co and atomic number 27. Like nickel, cobalt in the Earth's crust is found only in chemically combined form, save for small deposits found in alloys of natural meteoric iron. The free element, produced by reductive smelting, is a hard, lustrous, silver-gray metal.", 
    "symbol": "Co", 
    "xpos": 9, 
    "ypos": 4, 
    "shells": [
      2,
      8, 
      15, 
      2
    ]
  }, 
  {
    "name": "Nickel", 
    "appearance": "lustrous, metallic, and silver with a gold tinge", 
    "atomic_mass": 58.69344, 
    "boil": 3003, 
    "category": "transition metal", 
    "color": null, 
    "density": 8.908, 
    "discovered_by": "Axel Fredrik Cronstedt", 
    "melt": 1728, 
    "molar_heat": 26.07, 
    "named_by": null, 
    "number": 28, 
    "period": 4, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Nickel", 
    "spectral_img": null, 
    "summary": "Nickel is a chemical element with symbol Ni and atomic number 28. It is a silvery-white lustrous metal with a slight golden tinge. Nickel belongs to the transition metals and is hard and ductile.", 
    "symbol": "Ni", 
    "xpos": 10, 
    "ypos": 4, 
    "shells": [
      2,
      8, 
      16, 
      2
    ]
  }, 
  {
    "name": "Copper", 
    "appearance": "red-orange metallic luster", 
    "atomic_mass": 63.5463, 
    "boil": 2835, 
    "category": "transition metal", 
    "color": null, 
    "density": 8.96, 
    "discovered_by": "Middle East", 
    "melt": 1357.77, 
    "molar_heat": 24.44, 
    "named_by": null, 
    "number": 29, 
    "period": 4, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Copper", 
    "spectral_img": null, 
    "summary": "Copper is a chemical element with symbol Cu (from Latin:cuprum) and atomic number 29. It is a soft, malleable and ductile metal with very high thermal and electrical conductivity. A freshly exposed surface of pure copper has a reddish-orange color.", 
    "symbol": "Cu", 
    "xpos": 11, 
    "ypos": 4, 
    "shells": [
      2,
      8, 
      18, 
      1
    ]
  }, 
  {
    "name": "Zinc", 
    "appearance": "silver-gray", 
    "atomic_mass": 65.382, 
    "boil": 1180, 
    "category": "transition metal", 
    "color": null, 
    "density": 7.14, 
    "discovered_by": "India", 
    "melt": 692.68, 
    "molar_heat": 25.47, 
    "named_by": null, 
    "number": 30, 
    "period": 4, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Zinc", 
    "spectral_img": null, 
    "summary": "Zinc, in commerce also spelter, is a chemical element with symbol Zn and atomic number 30. It is the first element of group 12 of the periodic table. In some respects zinc is chemically similar to magnesium:its ion is of similar size and its only common oxidation state is +2.", 
    "symbol": "Zn", 
    "xpos": 12, 
    "ypos": 4, 
    "shells": [
      2,
      8, 
      18, 
      2
    ]
  }, 
  {
    "name": "Gallium", 
    "appearance": "silver-white", 
    "atomic_mass": 69.7231, 
    "boil": 2673, 
    "category": "post-transition metal", 
    "color": null, 
    "density": 5.91, 
    "discovered_by": "Lecoq de Boisbaudran", 
    "melt": 302.9146, 
    "molar_heat": 25.86, 
    "named_by": null, 
    "number": 31, 
    "period": 4, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Gallium", 
    "spectral_img": null, 
    "summary": "Gallium is a chemical element with symbol Ga and atomic number 31. Elemental gallium does not occur in free form in nature, but as the gallium(III) compounds that are in trace amounts in zinc ores and in bauxite. Gallium is a soft, silvery metal, and elemental gallium is a brittle solid at low temperatures, and melts at 29.76 \u00b0C (85.57 \u00b0F) (slightly above room temperature).", 
    "symbol": "Ga", 
    "xpos": 13, 
    "ypos": 4, 
    "shells": [
      2,
      8, 
      18, 
      3
    ]
  }, 
  {
    "name": "Germanium", 
    "appearance": "grayish-white", 
    "atomic_mass": 72.6308, 
    "boil": 3106, 
    "category": "metalloid", 
    "color": null, 
    "density": 5.323, 
    "discovered_by": "Clemens Winkler", 
    "melt": 1211.4, 
    "molar_heat": 23.222, 
    "named_by": null, 
    "number": 32, 
    "period": 4, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Germanium", 
    "spectral_img": null, 
    "summary": "Germanium is a chemical element with symbol Ge and atomic number 32. It is a lustrous, hard, grayish-white metalloid in the carbon group, chemically similar to its group neighbors tin and silicon. Purified germanium is a semiconductor, with an appearance most similar to elemental silicon.", 
    "symbol": "Ge", 
    "xpos": 14, 
    "ypos": 4, 
    "shells": [
      2,
      8, 
      18, 
      4
    ]
  }, 
  {
    "name": "Arsenic", 
    "appearance": "metallic grey", 
    "atomic_mass": 74.9215956, 
    "boil": null, 
    "category": "metalloid", 
    "color": null, 
    "density": 5.727, 
    "discovered_by": "Bronze Age", 
    "melt": null, 
    "molar_heat": 24.64, 
    "named_by": null, 
    "number": 33, 
    "period": 4, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Arsenic", 
    "spectral_img": null, 
    "summary": "Arsenic is a chemical element with symbol As and atomic number 33. Arsenic occurs in many minerals, usually in conjunction with sulfur and metals, and also as a pure elemental crystal. Arsenic is a metalloid.", 
    "symbol": "As", 
    "xpos": 15, 
    "ypos": 4, 
    "shells": [
      2,
      8, 
      18, 
      5
    ]
  }, 
  {
    "name": "Selenium", 
    "appearance": "black, red, and gray (not pictured) allotropes", 
    "atomic_mass": 78.9718, 
    "boil": 958, 
    "category": "polyatomic nonmetal", 
    "color": null, 
    "density": 4.81, 
    "discovered_by": "J\u00f6ns Jakob Berzelius", 
    "melt": 494, 
    "molar_heat": 25.363, 
    "named_by": null, 
    "number": 34, 
    "period": 4, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Selenium", 
    "spectral_img": null, 
    "summary": "Selenium is a chemical element with symbol Se and atomic number 34. It is a nonmetal with properties that are intermediate between those of its periodic table column-adjacent chalcogen elements sulfur and tellurium. It rarely occurs in its elemental state in nature, or as pure ore compounds.", 
    "symbol": "Se", 
    "xpos": 16, 
    "ypos": 4, 
    "shells": [
      2,
      8, 
      18, 
      6
    ]
  }, 
  {
    "name": "Bromine", 
    "appearance": null, 
    "atomic_mass": 79.904, 
    "boil": 332.0, 
    "category": "diatomic nonmetal", 
    "color": null, 
    "density": 23.1028, 
    "discovered_by": "Antoine J\u00e9r\u00f4me Balard", 
    "melt": 265.8, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 35, 
    "period": 4, 
    "phase": "Liquid", 
    "source": "https://en.wikipedia.org/wiki/Bromine", 
    "spectral_img": null, 
    "summary": "Bromine (from Ancient Greek:\u03b2\u03c1\u1ff6\u03bc\u03bf\u03c2, br\u00f3mos, meaning \"stench\") is a chemical element with symbol Br, and atomic number 35. It is a halogen. The element was isolated independently by two chemists, Carl Jacob L\u00f6wig and Antoine Jerome Balard, in 1825\u20131826.", 
    "symbol": "Br", 
    "xpos": 17, 
    "ypos": 4, 
    "shells": [
      2,
      8, 
      18, 
      7
    ]
  }, 
  {
    "name": "Krypton", 
    "appearance": "colorless gas, exhibiting a whitish glow in a high electric field", 
    "atomic_mass": 83.7982, 
    "boil": 119.93, 
    "category": "noble gas", 
    "color": null, 
    "density": 3.749, 
    "discovered_by": "William Ramsay", 
    "melt": 115.78, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 36, 
    "period": 4, 
    "phase": "Gas", 
    "source": "https://en.wikipedia.org/wiki/Krypton", 
    "spectral_img": "https://en.wikipedia.org/wiki/File:Krypton_Spectrum.jpg", 
    "summary": "Krypton (from Greek:\u03ba\u03c1\u03c5\u03c0\u03c4\u03cc\u03c2 kryptos \"the hidden one\") is a chemical element with symbol Kr and atomic number 36. It is a member of group 18 (noble gases) elements. A colorless, odorless, tasteless noble gas, krypton occurs in trace amounts in the atmosphere, is isolated by fractionally distilling liquefied air, and is often used with other rare gases in fluorescent lamps.", 
    "symbol": "Kr", 
    "xpos": 18, 
    "ypos": 4, 
    "shells": [
      2,
      8, 
      18, 
      8
    ]
  }, 
  {
    "name": "Rubidium", 
    "appearance": "grey white", 
    "atomic_mass": 85.46783, 
    "boil": 961, 
    "category": "alkali metal", 
    "color": null, 
    "density": 1.532, 
    "discovered_by": "Robert Bunsen", 
    "melt": 312.45, 
    "molar_heat": 31.06, 
    "named_by": null, 
    "number": 37, 
    "period": 5, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Rubidium", 
    "spectral_img": null, 
    "summary": "Rubidium is a chemical element with symbol Rb and atomic number 37. Rubidium is a soft, silvery-white metallic element of the alkali metal group, with an atomic mass of 85.4678. Elemental rubidium is highly reactive, with properties similar to those of other alkali metals, such as very rapid oxidation in air.", 
    "symbol": "Rb", 
    "xpos": 1, 
    "ypos": 5, 
    "shells": [
      2,
      8, 
      18, 
      8, 
      1
    ]
  }, 
  {
    "name": "Strontium", 
    "appearance": null, 
    "atomic_mass": 87.621, 
    "boil": 1650, 
    "category": "alkaline earth metal", 
    "color": null, 
    "density": 2.64, 
    "discovered_by": "William Cruickshank (chemist)", 
    "melt": 1050, 
    "molar_heat": 26.4, 
    "named_by": null, 
    "number": 38, 
    "period": 5, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Strontium", 
    "spectral_img": null, 
    "summary": "Strontium is a chemical element with symbol Sr and atomic number 38. An alkaline earth metal, strontium is a soft silver-white or yellowish metallic element that is highly reactive chemically. The metal turns yellow when it is exposed to air.", 
    "symbol": "Sr", 
    "xpos": 2, 
    "ypos": 5, 
    "shells": [
      2,
      8, 
      18, 
      8, 
      2
    ]
  }, 
  {
    "name": "Yttrium", 
    "appearance": "silvery white", 
    "atomic_mass": 88.905842, 
    "boil": 3203, 
    "category": "transition metal", 
    "color": null, 
    "density": 4.472, 
    "discovered_by": "Johan Gadolin", 
    "melt": 1799, 
    "molar_heat": 26.53, 
    "named_by": null, 
    "number": 39, 
    "period": 5, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Yttrium", 
    "spectral_img": null, 
    "summary": "Yttrium is a chemical element with symbol Y and atomic number 39. It is a silvery-metallic transition metal chemically similar to the lanthanides and it has often been classified as a \"rare earth element\". Yttrium is almost always found combined with the lanthanides in rare earth minerals and is never found in nature as a free element.", 
    "symbol": "Y", 
    "xpos": 3, 
    "ypos": 5, 
    "shells": [
      2,
      8, 
      18, 
      9, 
      2
    ]
  }, 
  {
    "name": "Zirconium", 
    "appearance": "silvery white", 
    "atomic_mass": 91.2242, 
    "boil": 4650, 
    "category": "transition metal", 
    "color": null, 
    "density": 6.52, 
    "discovered_by": "Martin Heinrich Klaproth", 
    "melt": 2128, 
    "molar_heat": 25.36, 
    "named_by": null, 
    "number": 40, 
    "period": 5, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Zirconium", 
    "spectral_img": null, 
    "summary": "Zirconium is a chemical element with symbol Zr and atomic number 40. The name of zirconium is taken from the name of the mineral zircon, the most important source of zirconium. The word zircon comes from the Persian word zargun \u0632\u0631\u06af\u0648\u0646, meaning \"gold-colored\".", 
    "symbol": "Zr", 
    "xpos": 4, 
    "ypos": 5, 
    "shells": [
      2,
      8, 
      18, 
      10, 
      2
    ]
  }, 
  {
    "name": "Niobium", 
    "appearance": "gray metallic, bluish when oxidized", 
    "atomic_mass": 92.906372, 
    "boil": 5017, 
    "category": "transition metal", 
    "color": null, 
    "density": 8.57, 
    "discovered_by": "Charles Hatchett", 
    "melt": 2750, 
    "molar_heat": 24.6, 
    "named_by": null, 
    "number": 41, 
    "period": 5, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Niobium", 
    "spectral_img": null, 
    "summary": "Niobium, formerly columbium, is a chemical element with symbol Nb (formerly Cb) and atomic number 41. It is a soft, grey, ductile transition metal, which is often found in the pyrochlore mineral, the main commercial source for niobium, and columbite. The name comes from Greek mythology:Niobe, daughter of Tantalus since it is so similar to tantalum.", 
    "symbol": "Nb", 
    "xpos": 5, 
    "ypos": 5, 
    "shells": [
      2,
      8, 
      18, 
      12, 
      1
    ]
  }, 
  {
    "name": "Molybdenum", 
    "appearance": "gray metallic", 
    "atomic_mass": 95.951, 
    "boil": 4912, 
    "category": "transition metal", 
    "color": null, 
    "density": 10.28, 
    "discovered_by": "Carl Wilhelm Scheele", 
    "melt": 2896, 
    "molar_heat": 24.06, 
    "named_by": null, 
    "number": 42, 
    "period": 5, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Molybdenum", 
    "spectral_img": null, 
    "summary": "Molybdenum is a chemical element with symbol Mo and atomic number 42. The name is from Neo-Latin molybdaenum, from Ancient Greek \u039c\u03cc\u03bb\u03c5\u03b2\u03b4\u03bf\u03c2 molybdos, meaning lead, since its ores were confused with lead ores. Molybdenum minerals have been known throughout history, but the element was discovered (in the sense of differentiating it as a new entity from the mineral salts of other metals) in 1778 by Carl Wilhelm Scheele.", 
    "symbol": "Mo", 
    "xpos": 6, 
    "ypos": 5, 
    "shells": [
      2,
      8, 
      18, 
      13, 
      1
    ]
  }, 
  {
    "name": "Technetium", 
    "appearance": "shiny gray metal", 
    "atomic_mass": 98, 
    "boil": 4538, 
    "category": "transition metal", 
    "color": null, 
    "density": 11, 
    "discovered_by": "Emilio Segr\u00e8", 
    "melt": 2430, 
    "molar_heat": 24.27, 
    "named_by": null, 
    "number": 43, 
    "period": 5, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Technetium", 
    "spectral_img": null, 
    "summary": "Technetium (/t\u025bk\u02c8ni\u02d0\u0283i\u0259m/) is a chemical element with symbol Tc and atomic number 43. It is the element with the lowest atomic number in the periodic table that has no stable isotopes:every form of it is radioactive. Nearly all technetium is produced synthetically, and only minute amounts are found in nature.", 
    "symbol": "Tc", 
    "xpos": 7, 
    "ypos": 5, 
    "shells": [
      2,
      8, 
      18, 
      13, 
      2
    ]
  }, 
  {
    "name": "Ruthenium", 
    "appearance": "silvery white metallic", 
    "atomic_mass": 101.072, 
    "boil": 4423, 
    "category": "transition metal", 
    "color": null, 
    "density": 12.45, 
    "discovered_by": "Karl Ernst Claus", 
    "melt": 2607, 
    "molar_heat": 24.06, 
    "named_by": null, 
    "number": 44, 
    "period": 5, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Ruthenium", 
    "spectral_img": null, 
    "summary": "Ruthenium is a chemical element with symbol Ru and atomic number 44. It is a rare transition metal belonging to the platinum group of the periodic table. Like the other metals of the platinum group, ruthenium is inert to most other chemicals.", 
    "symbol": "Ru", 
    "xpos": 8, 
    "ypos": 5, 
    "shells": [
      2,
      8, 
      18, 
      15, 
      1
    ]
  }, 
  {
    "name": "Rhodium", 
    "appearance": "silvery white metallic", 
    "atomic_mass": 102.905502, 
    "boil": 3968, 
    "category": "transition metal", 
    "color": null, 
    "density": 12.41, 
    "discovered_by": "William Hyde Wollaston", 
    "melt": 2237, 
    "molar_heat": 24.98, 
    "named_by": null, 
    "number": 45, 
    "period": 5, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Rhodium", 
    "spectral_img": null, 
    "summary": "Rhodium is a chemical element with symbol Rh and atomic number 45. It is a rare, silvery-white, hard, and chemically inert transition metal. It is a member of the platinum group.", 
    "symbol": "Rh", 
    "xpos": 9, 
    "ypos": 5, 
    "shells": [
      2,
      8, 
      18, 
      16, 
      1
    ]
  }, 
  {
    "name": "Palladium", 
    "appearance": "silvery white", 
    "atomic_mass": 106.421, 
    "boil": 3236, 
    "category": "transition metal", 
    "color": null, 
    "density": 12.023, 
    "discovered_by": "William Hyde Wollaston", 
    "melt": 1828.05, 
    "molar_heat": 25.98, 
    "named_by": null, 
    "number": 46, 
    "period": 5, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Palladium", 
    "spectral_img": null, 
    "summary": "Palladium is a chemical element with symbol Pd and atomic number 46. It is a rare and lustrous silvery-white metal discovered in 1803 by William Hyde Wollaston. He named it after the asteroid Pallas, which was itself named after the epithet of the Greek goddess Athena, acquired by her when she slew Pallas.", 
    "symbol": "Pd", 
    "xpos": 10, 
    "ypos": 5, 
    "shells": [
      2,
      8, 
      18, 
      18
    ]
  }, 
  {
    "name": "Silver", 
    "appearance": "lustrous white metal", 
    "atomic_mass": 107.86822, 
    "boil": 2435, 
    "category": "transition metal", 
    "color": null, 
    "density": 10.49, 
    "discovered_by": "unknown, before 5000 BC", 
    "melt": 1234.93, 
    "molar_heat": 25.35, 
    "named_by": null, 
    "number": 47, 
    "period": 5, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Silver", 
    "spectral_img": null, 
    "summary": "Silver is a chemical element with symbol Ag (Greek:\u03ac\u03c1\u03b3\u03c5\u03c1\u03bf\u03c2 \u00e1rguros, Latin:argentum, both from the Indo-European root *h\u2082er\u01f5- for \"grey\" or \"shining\") and atomic number 47. A soft, white, lustrous transition metal, it possesses the highest electrical conductivity, thermal conductivity and reflectivity of any metal. The metal occurs naturally in its pure, free form (native silver), as an alloy with gold and other metals, and in minerals such as argentite and chlorargyrite.", 
    "symbol": "Ag", 
    "xpos": 11, 
    "ypos": 5, 
    "shells": [
      2,
      8, 
      18, 
      18, 
      1
    ]
  }, 
  {
    "name": "Cadmium", 
    "appearance": "silvery bluish-gray metallic", 
    "atomic_mass": 112.4144, 
    "boil": 1040, 
    "category": "transition metal", 
    "color": null, 
    "density": 8.65, 
    "discovered_by": "Karl Samuel Leberecht Hermann", 
    "melt": 594.22, 
    "molar_heat": 26.02, 
    "named_by": "Isotopes of cadmium", 
    "number": 48, 
    "period": 5, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Cadmium", 
    "spectral_img": null, 
    "summary": "Cadmium is a chemical element with symbol Cd and atomic number 48. This soft, bluish-white metal is chemically similar to the two other stable metals in group 12, zinc and mercury. Like zinc, it prefers oxidation state +2 in most of its compounds and like mercury it shows a low melting point compared to transition metals.", 
    "symbol": "Cd", 
    "xpos": 12, 
    "ypos": 5, 
    "shells": [
      2,
      8, 
      18, 
      18, 
      2
    ]
  }, 
  {
    "name": "Indium", 
    "appearance": "silvery lustrous gray", 
    "atomic_mass": 114.8181, 
    "boil": 2345, 
    "category": "post-transition metal", 
    "color": null, 
    "density": 7.31, 
    "discovered_by": "Ferdinand Reich", 
    "melt": 429.7485, 
    "molar_heat": 26.74, 
    "named_by": null, 
    "number": 49, 
    "period": 5, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Indium", 
    "spectral_img": null, 
    "summary": "Indium is a chemical element with symbol In and atomic number 49. It is a post-transition metallic element that is rare in Earth's crust. The metal is very soft, malleable and easily fusible, with a melting point higher than sodium, but lower than lithium or tin.", 
    "symbol": "In", 
    "xpos": 13, 
    "ypos": 5, 
    "shells": [
      2,
      8, 
      18, 
      18, 
      3
    ]
  }, 
  {
    "name": "Tin", 
    "appearance": "silvery-white (beta, \u03b2) or gray (alpha, \u03b1)", 
    "atomic_mass": 118.7107, 
    "boil": 2875, 
    "category": "post-transition metal", 
    "color": null, 
    "density": 7.365, 
    "discovered_by": "unknown, before 3500 BC", 
    "melt": 505.08, 
    "molar_heat": 27.112, 
    "named_by": null, 
    "number": 50, 
    "period": 5, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Tin", 
    "spectral_img": null, 
    "summary": "Tin is a chemical element with the symbol Sn (for Latin:stannum) and atomic number 50. It is a main group metal in group 14 of the periodic table. Tin shows a chemical similarity to both neighboring group-14 elements, germanium and lead, and has two possible oxidation states, +2 and the slightly more stable +4.", 
    "symbol": "Sn", 
    "xpos": 14, 
    "ypos": 5, 
    "shells": [
      2,
      8, 
      18, 
      18, 
      4
    ]
  }, 
  {
    "name": "Antimony", 
    "appearance": "silvery lustrous gray", 
    "atomic_mass": 121.7601, 
    "boil": 1908, 
    "category": "metalloid", 
    "color": null, 
    "density": 6.697, 
    "discovered_by": "unknown, before 3000 BC", 
    "melt": 903.78, 
    "molar_heat": 25.23, 
    "named_by": null, 
    "number": 51, 
    "period": 5, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Antimony", 
    "spectral_img": null, 
    "summary": "Antimony is a chemical element with symbol Sb (from Latin:stibium) and atomic number 51. A lustrous gray metalloid, it is found in nature mainly as the sulfide mineral stibnite (Sb2S3). Antimony compounds have been known since ancient times and were used for cosmetics; metallic antimony was also known, but it was erroneously identified as lead upon its discovery.", 
    "symbol": "Sb", 
    "xpos": 15, 
    "ypos": 5, 
    "shells": [
      2,
      8, 
      18, 
      18, 
      5
    ]
  }, 
  {
    "name": "Tellurium", 
    "appearance": null, 
    "atomic_mass": 127.603, 
    "boil": 1261, 
    "category": "metalloid", 
    "color": null, 
    "density": 6.24, 
    "discovered_by": "Franz-Joseph M\u00fcller von Reichenstein", 
    "melt": 722.66, 
    "molar_heat": 25.73, 
    "named_by": null, 
    "number": 52, 
    "period": 5, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Tellurium", 
    "spectral_img": null, 
    "summary": "Tellurium is a chemical element with symbol Te and atomic number 52. It is a brittle, mildly toxic, rare, silver-white metalloid. Tellurium is chemically related to selenium and sulfur.", 
    "symbol": "Te", 
    "xpos": 16, 
    "ypos": 5, 
    "shells": [
      2,
      8, 
      18, 
      18, 
      6
    ]
  }, 
  {
    "name": "Iodine", 
    "appearance": "lustrous metallic gray, violet as a gas", 
    "atomic_mass": 126.904473, 
    "boil": 457.4, 
    "category": "diatomic nonmetal", 
    "color": null, 
    "density": 4.933, 
    "discovered_by": "Bernard Courtois", 
    "melt": 386.85, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 53, 
    "period": 5, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Iodine", 
    "spectral_img": null, 
    "summary": "Iodine is a chemical element with symbol I and atomic number 53. The name is from Greek \u1f30\u03bf\u03b5\u03b9\u03b4\u03ae\u03c2 ioeid\u0113s, meaning violet or purple, due to the color of iodine vapor. Iodine and its compounds are primarily used in nutrition, and industrially in the production of acetic acid and certain polymers.", 
    "symbol": "I", 
    "xpos": 17, 
    "ypos": 5, 
    "shells": [
      2,
      8, 
      18, 
      18, 
      7
    ]
  }, 
  {
    "name": "Xenon", 
    "appearance": "colorless gas, exhibiting a blue glow when placed in a high voltage electric field", 
    "atomic_mass": 131.2936, 
    "boil": 165.051, 
    "category": "noble gas", 
    "color": null, 
    "density": 5.894, 
    "discovered_by": "William Ramsay", 
    "melt": 161.4, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 54, 
    "period": 5, 
    "phase": "Gas", 
    "source": "https://en.wikipedia.org/wiki/Xenon", 
    "spectral_img": "https://en.wikipedia.org/wiki/File:Xenon_Spectrum.jpg", 
    "summary": "Xenon is a chemical element with symbol Xe and atomic number 54. It is a colorless, dense, odorless noble gas, that occurs in the Earth's atmosphere in trace amounts. Although generally unreactive, xenon can undergo a few chemical reactions such as the formation of xenon hexafluoroplatinate, the first noble gas compound to be synthesized.", 
    "symbol": "Xe", 
    "xpos": 18, 
    "ypos": 5, 
    "shells": [
      2,
      8, 
      18, 
      18, 
      8
    ]
  }, 
  {
    "name": "Cesium", 
    "appearance": "silvery gold", 
    "atomic_mass": 132.905451966, 
    "boil": 944, 
    "category": "alkali metal", 
    "color": null, 
    "density": 1.93, 
    "discovered_by": "Robert Bunsen", 
    "melt": 301.7, 
    "molar_heat": 32.21, 
    "named_by": null, 
    "number": 55, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Cesium", 
    "spectral_img": null, 
    "summary": "Caesium or cesium is a chemical element with symbol Cs and atomic number 55. It is a soft, silvery-gold alkali metal with a melting point of 28 \u00b0C (82 \u00b0F), which makes it one of only five elemental metals that are liquid at or near room temperature. Caesium is an alkali metal and has physical and chemical properties similar to those of rubidium and potassium.", 
    "symbol": "Cs", 
    "xpos": 1, 
    "ypos": 6, 
    "shells": [
      2,
      8, 
      18, 
      18, 
      8, 
      1
    ]
  }, 
  {
    "name": "Barium", 
    "appearance": null, 
    "atomic_mass": 137.3277, 
    "boil": 2118, 
    "category": "alkaline earth metal", 
    "color": null, 
    "density": 3.51, 
    "discovered_by": "Carl Wilhelm Scheele", 
    "melt": 1000, 
    "molar_heat": 28.07, 
    "named_by": null, 
    "number": 56, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Barium", 
    "spectral_img": null, 
    "summary": "Barium is a chemical element with symbol Ba and atomic number 56. It is the fifth element in Group 2, a soft silvery metallic alkaline earth metal. Because of its high chemical reactivity barium is never found in nature as a free element.", 
    "symbol": "Ba", 
    "xpos": 2, 
    "ypos": 6, 
    "shells": [
      2,
      8, 
      18, 
      18, 
      8, 
      2
    ]
  }, 
  {
    "name": "Lanthanum", 
    "appearance": "silvery white", 
    "atomic_mass": 138.905477, 
    "boil": 3737, 
    "category": "lanthanide", 
    "color": null, 
    "density": 6.162, 
    "discovered_by": "Carl Gustaf Mosander", 
    "melt": 1193, 
    "molar_heat": 27.11, 
    "named_by": null, 
    "number": 57, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Lanthanum", 
    "spectral_img": null, 
    "summary": "Lanthanum is a soft, ductile, silvery-white metallic chemical element with symbol La and atomic number 57. It tarnishes rapidly when exposed to air and is soft enough to be cut with a knife. It gave its name to the lanthanide series, a group of 15 similar elements between lanthanum and lutetium in the periodic table:it is also sometimes considered the first element of the 6th-period transition metals.", 
    "symbol": "La", 
    "xpos": 3, 
    "ypos": 9, 
    "shells": [
      2,
      8, 
      18, 
      18, 
      9, 
      2
    ]
  }, 
  {
    "name": "Cerium", 
    "appearance": "silvery white", 
    "atomic_mass": 140.1161, 
    "boil": 3716, 
    "category": "lanthanide", 
    "color": null, 
    "density": 6.77, 
    "discovered_by": "Martin Heinrich Klaproth", 
    "melt": 1068, 
    "molar_heat": 26.94, 
    "named_by": null, 
    "number": 58, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Cerium", 
    "spectral_img": null, 
    "summary": "Cerium is a chemical element with symbol Ce and atomic number 58. It is a soft, silvery, ductile metal which easily oxidizes in air. Cerium was named after the dwarf planet Ceres (itself named after the Roman goddess of agriculture).", 
    "symbol": "Ce", 
    "xpos": 4, 
    "ypos": 9, 
    "shells": [
      2,
      8, 
      18, 
      19, 
      9, 
      2
    ]
  }, 
  {
    "name": "Praseodymium", 
    "appearance": "grayish white", 
    "atomic_mass": 140.907662, 
    "boil": 3403, 
    "category": "lanthanide", 
    "color": null, 
    "density": 6.77, 
    "discovered_by": "Carl Auer von Welsbach", 
    "melt": 1208, 
    "molar_heat": 27.2, 
    "named_by": null, 
    "number": 59, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Praseodymium", 
    "spectral_img": null, 
    "summary": "Praseodymium is a chemical element with symbol Pr and atomic number 59. Praseodymium is a soft, silvery, malleable and ductile metal in the lanthanide group. It is valued for its magnetic, electrical, chemical, and optical properties.", 
    "symbol": "Pr", 
    "xpos": 5, 
    "ypos": 9, 
    "shells": [
      2,
      8, 
      18, 
      21, 
      8, 
      2
    ]
  }, 
  {
    "name": "Neodymium", 
    "appearance": "silvery white", 
    "atomic_mass": 144.2423, 
    "boil": 3347, 
    "category": "lanthanide", 
    "color": null, 
    "density": 7.01, 
    "discovered_by": "Carl Auer von Welsbach", 
    "melt": 1297, 
    "molar_heat": 27.45, 
    "named_by": null, 
    "number": 60, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Neodymium", 
    "spectral_img": null, 
    "summary": "Neodymium is a chemical element with symbol Nd and atomic number 60. It is a soft silvery metal that tarnishes in air. Neodymium was discovered in 1885 by the Austrian chemist Carl Auer von Welsbach.", 
    "symbol": "Nd", 
    "xpos": 6, 
    "ypos": 9, 
    "shells": [
      2,
      8, 
      18, 
      22, 
      8, 
      2
    ]
  }, 
  {
    "name": "Promethium", 
    "appearance": "metallic", 
    "atomic_mass": 145, 
    "boil": 3273, 
    "category": "lanthanide", 
    "color": null, 
    "density": 7.26, 
    "discovered_by": "Chien Shiung Wu", 
    "melt": 1315, 
    "molar_heat": null, 
    "named_by": "Isotopes of promethium", 
    "number": 61, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Promethium", 
    "spectral_img": null, 
    "summary": "Promethium, originally prometheum, is a chemical element with the symbol Pm and atomic number 61. All of its isotopes are radioactive; it is one of only two such elements that are followed in the periodic table by elements with stable forms, a distinction shared with technetium. Chemically, promethium is a lanthanide, which forms salts when combined with other elements.", 
    "symbol": "Pm", 
    "xpos": 7, 
    "ypos": 9, 
    "shells": [
      2,
      8, 
      18, 
      23, 
      8, 
      2
    ]
  }, 
  {
    "name": "Samarium", 
    "appearance": "silvery white", 
    "atomic_mass": 150.362, 
    "boil": 2173, 
    "category": "lanthanide", 
    "color": null, 
    "density": 7.52, 
    "discovered_by": "Lecoq de Boisbaudran", 
    "melt": 1345, 
    "molar_heat": 29.54, 
    "named_by": null, 
    "number": 62, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Samarium", 
    "spectral_img": null, 
    "summary": "Samarium is a chemical element with symbol Sm and atomic number 62. It is a moderately hard silvery metal that readily oxidizes in air. Being a typical member of the lanthanide series, samarium usually assumes the oxidation state +3.", 
    "symbol": "Sm", 
    "xpos": 8, 
    "ypos": 9, 
    "shells": [
      2,
      8, 
      18, 
      24, 
      8, 
      2
    ]
  }, 
  {
    "name": "Europium", 
    "appearance": null, 
    "atomic_mass": 151.9641, 
    "boil": 1802, 
    "category": "lanthanide", 
    "color": null, 
    "density": 5.264, 
    "discovered_by": "Eug\u00e8ne-Anatole Demar\u00e7ay", 
    "melt": 1099, 
    "molar_heat": 27.66, 
    "named_by": null, 
    "number": 63, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Europium", 
    "spectral_img": null, 
    "summary": "Europium is a chemical element with symbol Eu and atomic number 63. It was isolated in 1901 and is named after the continent of Europe. It is a moderately hard, silvery metal which readily oxidizes in air and water.", 
    "symbol": "Eu", 
    "xpos": 9, 
    "ypos": 9, 
    "shells": [
      2,
      8, 
      18, 
      25, 
      8, 
      2
    ]
  }, 
  {
    "name": "Gadolinium", 
    "appearance": "silvery white", 
    "atomic_mass": 157.253, 
    "boil": 3273, 
    "category": "lanthanide", 
    "color": null, 
    "density": 7.9, 
    "discovered_by": "Jean Charles Galissard de Marignac", 
    "melt": 1585, 
    "molar_heat": 37.03, 
    "named_by": null, 
    "number": 64, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Gadolinium", 
    "spectral_img": null, 
    "summary": "Gadolinium is a chemical element with symbol Gd and atomic number 64. It is a silvery-white, malleable and ductile rare-earth metal. It is found in nature only in combined (salt) form.", 
    "symbol": "Gd", 
    "xpos": 10, 
    "ypos": 9, 
    "shells": [
      2,
      8, 
      18, 
      25, 
      9, 
      2
    ]
  }, 
  {
    "name": "Terbium", 
    "appearance": "silvery white", 
    "atomic_mass": 158.925352, 
    "boil": 3396, 
    "category": "lanthanide", 
    "color": null, 
    "density": 8.23, 
    "discovered_by": "Carl Gustaf Mosander", 
    "melt": 1629, 
    "molar_heat": 28.91, 
    "named_by": null, 
    "number": 65, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Terbium", 
    "spectral_img": null, 
    "summary": "Terbium is a chemical element with symbol Tb and atomic number 65. It is a silvery-white rare earth metal that is malleable, ductile and soft enough to be cut with a knife. Terbium is never found in nature as a free element, but it is contained in many minerals, including cerite, gadolinite, monazite, xenotime and euxenite.", 
    "symbol": "Tb", 
    "xpos": 11, 
    "ypos": 9, 
    "shells": [
      2,
      8, 
      18, 
      27, 
      8, 
      2
    ]
  }, 
  {
    "name": "Dysprosium", 
    "appearance": "silvery white", 
    "atomic_mass": 162.5001, 
    "boil": 2840, 
    "category": "lanthanide", 
    "color": null, 
    "density": 8.54, 
    "discovered_by": "Lecoq de Boisbaudran", 
    "melt": 1680, 
    "molar_heat": 27.7, 
    "named_by": null, 
    "number": 66, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Dysprosium", 
    "spectral_img": null, 
    "summary": "Dysprosium is a chemical element with the symbol Dy and atomic number 66. It is a rare earth element with a metallic silver luster. Dysprosium is never found in nature as a free element, though it is found in various minerals, such as xenotime.", 
    "symbol": "Dy", 
    "xpos": 12, 
    "ypos": 9, 
    "shells": [
      2,
      8, 
      18, 
      28, 
      8, 
      2
    ]
  }, 
  {
    "name": "Holmium", 
    "appearance": "silvery white", 
    "atomic_mass": 164.930332, 
    "boil": 2873, 
    "category": "lanthanide", 
    "color": null, 
    "density": 8.79, 
    "discovered_by": "Marc Delafontaine", 
    "melt": 1734, 
    "molar_heat": 27.15, 
    "named_by": null, 
    "number": 67, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Holmium", 
    "spectral_img": null, 
    "summary": "Holmium is a chemical element with symbol Ho and atomic number 67. Part of the lanthanide series, holmium is a rare earth element. Holmium was discovered by Swedish chemist Per Theodor Cleve.", 
    "symbol": "Ho", 
    "xpos": 13, 
    "ypos": 9, 
    "shells": [
      2,
      8, 
      18, 
      29, 
      8, 
      2
    ]
  }, 
  {
    "name": "Erbium", 
    "appearance": "silvery white", 
    "atomic_mass": 167.2593, 
    "boil": 3141, 
    "category": "lanthanide", 
    "color": null, 
    "density": 9.066, 
    "discovered_by": "Carl Gustaf Mosander", 
    "melt": 1802, 
    "molar_heat": 28.12, 
    "named_by": null, 
    "number": 68, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Erbium", 
    "spectral_img": null, 
    "summary": "Erbium is a chemical element in the lanthanide series, with symbol Er and atomic number 68. A silvery-white solid metal when artificially isolated, natural erbium is always found in chemical combination with other elements on Earth. As such, it is a rare earth element which is associated with several other rare elements in the mineral gadolinite from Ytterby in Sweden, where yttrium, ytterbium, and terbium were discovered.", 
    "symbol": "Er", 
    "xpos": 14, 
    "ypos": 9, 
    "shells": [
      2,
      8, 
      18, 
      30, 
      8, 
      2
    ]
  }, 
  {
    "name": "Thulium", 
    "appearance": "silvery gray", 
    "atomic_mass": 168.934222, 
    "boil": 2223, 
    "category": "lanthanide", 
    "color": null, 
    "density": 9.32, 
    "discovered_by": "Per Teodor Cleve", 
    "melt": 1818, 
    "molar_heat": 27.03, 
    "named_by": null, 
    "number": 69, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Thulium", 
    "spectral_img": null, 
    "summary": "Thulium is a chemical element with symbol Tm and atomic number 69. It is the thirteenth and antepenultimate (third-last) element in the lanthanide series. Like the other lanthanides, the most common oxidation state is +3, seen in its oxide, halides and other compounds.", 
    "symbol": "Tm", 
    "xpos": 15, 
    "ypos": 9, 
    "shells": [
      2,
      8, 
      18, 
      31, 
      8, 
      2
    ]
  }, 
  {
    "name": "Ytterbium", 
    "appearance": null, 
    "atomic_mass": 173.0451, 
    "boil": 1469, 
    "category": "lanthanide", 
    "color": null, 
    "density": 6.9, 
    "discovered_by": "Jean Charles Galissard de Marignac", 
    "melt": 1097, 
    "molar_heat": 26.74, 
    "named_by": null, 
    "number": 70, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Ytterbium", 
    "spectral_img": null, 
    "summary": "Ytterbium is a chemical element with symbol Yb and atomic number 70. It is the fourteenth and penultimate element in the lanthanide series, which is the basis of the relative stability of its +2 oxidation state. However, like the other lanthanides, its most common oxidation state is +3, seen in its oxide, halides and other compounds.", 
    "symbol": "Yb", 
    "xpos": 16, 
    "ypos": 9, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      8, 
      2
    ]
  }, 
  {
    "name": "Lutetium", 
    "appearance": "silvery white", 
    "atomic_mass": 174.96681, 
    "boil": 3675, 
    "category": "lanthanide", 
    "color": null, 
    "density": 9.841, 
    "discovered_by": "Georges Urbain", 
    "melt": 1925, 
    "molar_heat": 26.86, 
    "named_by": null, 
    "number": 71, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Lutetium", 
    "spectral_img": null, 
    "summary": "Lutetium is a chemical element with symbol Lu and atomic number 71. It is a silvery white metal, which resists corrosion in dry, but not in moist air. It is considered the first element of the 6th-period transition metals and the last element in the lanthanide series, and is traditionally counted among the rare earths.", 
    "symbol": "Lu", 
    "xpos": 17, 
    "ypos": 9, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      9, 
      2
    ]
  }, 
  {
    "name": "Hafnium", 
    "appearance": "steel gray", 
    "atomic_mass": 178.492, 
    "boil": 4876, 
    "category": "transition metal", 
    "color": null, 
    "density": 13.31, 
    "discovered_by": "Dirk Coster", 
    "melt": 2506, 
    "molar_heat": 25.73, 
    "named_by": null, 
    "number": 72, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Hafnium", 
    "spectral_img": "https://en.wikipedia.org/wiki/File:Hafnium_spectrum_visible.png", 
    "summary": "Hafnium is a chemical element with symbol Hf and atomic number 72. A lustrous, silvery gray, tetravalent transition metal, hafnium chemically resembles zirconium and is found in zirconium minerals. Its existence was predicted by Dmitri Mendeleev in 1869, though it was not identified until 1923, making it the penultimate stable element to be discovered (rhenium was identified two years later).", 
    "symbol": "Hf", 
    "xpos": 4, 
    "ypos": 6, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      10, 
      2
    ]
  }, 
  {
    "name": "Tantalum", 
    "appearance": "gray blue", 
    "atomic_mass": 180.947882, 
    "boil": 5731, 
    "category": "transition metal", 
    "color": null, 
    "density": 16.69, 
    "discovered_by": "Anders Gustaf Ekeberg", 
    "melt": 3290, 
    "molar_heat": 25.36, 
    "named_by": null, 
    "number": 73, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Tantalum", 
    "spectral_img": "https://en.wikipedia.org/wiki/File:Tantalum_spectrum_visible.png", 
    "summary": "Tantalum is a chemical element with symbol Ta and atomic number 73. Previously known as tantalium, its name comes from Tantalus, an antihero from Greek mythology. Tantalum is a rare, hard, blue-gray, lustrous transition metal that is highly corrosion-resistant.", 
    "symbol": "Ta", 
    "xpos": 5, 
    "ypos": 6, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      11, 
      2
    ]
  }, 
  {
    "name": "Tungsten", 
    "appearance": "grayish white, lustrous", 
    "atomic_mass": 183.841, 
    "boil": 6203, 
    "category": "transition metal", 
    "color": null, 
    "density": 19.25, 
    "discovered_by": "Carl Wilhelm Scheele", 
    "melt": 3695, 
    "molar_heat": 24.27, 
    "named_by": null, 
    "number": 74, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Tungsten", 
    "spectral_img": null, 
    "summary": "Tungsten, also known as wolfram, is a chemical element with symbol W and atomic number 74. The word tungsten comes from the Swedish language tung sten, which directly translates to heavy stone. Its name in Swedish is volfram, however, in order to distinguish it from scheelite, which in Swedish is alternatively named tungsten.", 
    "symbol": "W", 
    "xpos": 6, 
    "ypos": 6, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      12, 
      2
    ]
  }, 
  {
    "name": "Rhenium", 
    "appearance": "silvery-grayish", 
    "atomic_mass": 186.2071, 
    "boil": 5869, 
    "category": "transition metal", 
    "color": null, 
    "density": 21.02, 
    "discovered_by": "Masataka Ogawa", 
    "melt": 3459, 
    "molar_heat": 25.48, 
    "named_by": "Walter Noddack", 
    "number": 75, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Rhenium", 
    "spectral_img": null, 
    "summary": "Rhenium is a chemical element with symbol Re and atomic number 75. It is a silvery-white, heavy, third-row transition metal in group 7 of the periodic table. With an estimated average concentration of 1 part per billion (ppb), rhenium is one of the rarest elements in the Earth's crust.", 
    "symbol": "Re", 
    "xpos": 7, 
    "ypos": 6, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      13, 
      2
    ]
  }, 
  {
    "name": "Osmium", 
    "appearance": "silvery, blue cast", 
    "atomic_mass": 190.233, 
    "boil": 5285, 
    "category": "transition metal", 
    "color": null, 
    "density": 22.59, 
    "discovered_by": "Smithson Tennant", 
    "melt": 3306, 
    "molar_heat": 24.7, 
    "named_by": null, 
    "number": 76, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Osmium", 
    "spectral_img": null, 
    "summary": "Osmium (from Greek osme (\u1f40\u03c3\u03bc\u03ae) meaning \"smell\") is a chemical element with symbol Os and atomic number 76. It is a hard, brittle, bluish-white transition metal in the platinum group that is found as a trace element in alloys, mostly in platinum ores. Osmium is the densest naturally occurring element, with a density of 22.59 g/cm3.", 
    "symbol": "Os", 
    "xpos": 8, 
    "ypos": 6, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      14, 
      2
    ]
  }, 
  {
    "name": "Iridium", 
    "appearance": "silvery white", 
    "atomic_mass": 192.2173, 
    "boil": 4403, 
    "category": "transition metal", 
    "color": null, 
    "density": 22.56, 
    "discovered_by": "Smithson Tennant", 
    "melt": 2719, 
    "molar_heat": 25.1, 
    "named_by": null, 
    "number": 77, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Iridium", 
    "spectral_img": null, 
    "summary": "Iridium is a chemical element with symbol Ir and atomic number 77. A very hard, brittle, silvery-white transition metal of the platinum group, iridium is generally credited with being the second densest element (after osmium) based on measured density, although calculations involving the space lattices of the elements show that iridium is denser. It is also the most corrosion-resistant metal, even at temperatures as high as 2000 \u00b0C. Although only certain molten salts and halogens are corrosive to solid iridium, finely divided iridium dust is much more reactive and can be flammable.", 
    "symbol": "Ir", 
    "xpos": 9, 
    "ypos": 6, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      15, 
      2
    ]
  }, 
  {
    "name": "Platinum", 
    "appearance": "silvery white", 
    "atomic_mass": 195.0849, 
    "boil": 4098, 
    "category": "transition metal", 
    "color": null, 
    "density": 21.45, 
    "discovered_by": "Antonio de Ulloa", 
    "melt": 2041.4, 
    "molar_heat": 25.86, 
    "named_by": null, 
    "number": 78, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Platinum", 
    "spectral_img": null, 
    "summary": "Platinum is a chemical element with symbol Pt and atomic number 78. It is a dense, malleable, ductile, highly unreactive, precious, gray-white transition metal. Its name is derived from the Spanish term platina, which is literally translated into \"little silver\".", 
    "symbol": "Pt", 
    "xpos": 10, 
    "ypos": 6, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      17, 
      1
    ]
  }, 
  {
    "name": "Gold", 
    "appearance": "metallic yellow", 
    "atomic_mass": 196.9665695, 
    "boil": 3243, 
    "category": "transition metal", 
    "color": null, 
    "density": 19.3, 
    "discovered_by": "Middle East", 
    "melt": 1337.33, 
    "molar_heat": 25.418, 
    "named_by": null, 
    "number": 79, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Gold", 
    "spectral_img": null, 
    "summary": "Gold is a chemical element with symbol Au (from Latin:aurum) and atomic number 79. In its purest form, it is a bright, slightly reddish yellow, dense, soft, malleable and ductile metal. Chemically, gold is a transition metal and a group 11 element.", 
    "symbol": "Au", 
    "xpos": 11, 
    "ypos": 6, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      18, 
      1
    ]
  }, 
  {
    "name": "Mercury", 
    "appearance": "silvery", 
    "atomic_mass": 200.5923, 
    "boil": 629.88, 
    "category": "transition metal", 
    "color": null, 
    "density": 13.534, 
    "discovered_by": "unknown, before 2000 BCE", 
    "melt": 234.321, 
    "molar_heat": 27.983, 
    "named_by": null, 
    "number": 80, 
    "period": 6, 
    "phase": "Liquid", 
    "source": "https://en.wikipedia.org/wiki/Mercury (Element)", 
    "spectral_img": null, 
    "summary": "Mercury is a chemical element with symbol Hg and atomic number 80. It is commonly known as quicksilver and was formerly named hydrargyrum (/ha\u026a\u02c8dr\u0251\u02d0rd\u0292\u0259r\u0259m/). A heavy, silvery d-block element, mercury is the only metallic element that is liquid at standard conditions for temperature and pressure; the only other element that is liquid under these conditions is bromine, though metals such as caesium, gallium, and rubidium melt just above room temperature.", 
    "symbol": "Hg", 
    "xpos": 12, 
    "ypos": 6, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      18, 
      2
    ]
  }, 
  {
    "name": "Thallium", 
    "appearance": "silvery white", 
    "atomic_mass": 204.38, 
    "boil": 1746, 
    "category": "post-transition metal", 
    "color": null, 
    "density": 11.85, 
    "discovered_by": "William Crookes", 
    "melt": 577, 
    "molar_heat": 26.32, 
    "named_by": null, 
    "number": 81, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Thallium", 
    "spectral_img": null, 
    "summary": "Thallium is a chemical element with symbol Tl and atomic number 81. This soft gray post-transition metal is not found free in nature. When isolated, it resembles tin, but discolors when exposed to air.", 
    "symbol": "Tl", 
    "xpos": 13, 
    "ypos": 6, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      18, 
      3
    ]
  }, 
  {
    "name": "Lead", 
    "appearance": "metallic gray", 
    "atomic_mass": 207.21, 
    "boil": 2022, 
    "category": "post-transition metal", 
    "color": null, 
    "density": 11.34, 
    "discovered_by": "Middle East", 
    "melt": 600.61, 
    "molar_heat": 26.65, 
    "named_by": null, 
    "number": 82, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Lead_(element)", 
    "spectral_img": null, 
    "summary": "Lead (/l\u025bd/) is a chemical element in the carbon group with symbol Pb (from Latin:plumbum) and atomic number 82. Lead is a soft, malleable and heavy post-transition metal. Metallic lead has a bluish-white color after being freshly cut, but it soon tarnishes to a dull grayish color when exposed to air.", 
    "symbol": "Pb", 
    "xpos": 14, 
    "ypos": 6, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      18, 
      4
    ]
  }, 
  {
    "name": "Bismuth", 
    "appearance": "lustrous silver", 
    "atomic_mass": 208.980401, 
    "boil": 1837, 
    "category": "post-transition metal", 
    "color": null, 
    "density": 9.78, 
    "discovered_by": "Claude Fran\u00e7ois Geoffroy", 
    "melt": 544.7, 
    "molar_heat": 25.52, 
    "named_by": null, 
    "number": 83, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Bismuth", 
    "spectral_img": null, 
    "summary": "Bismuth is a chemical element with symbol Bi and atomic number 83. Bismuth, a pentavalent post-transition metal, chemically resembles arsenic and antimony. Elemental bismuth may occur naturally, although its sulfide and oxide form important commercial ores.", 
    "symbol": "Bi", 
    "xpos": 15, 
    "ypos": 6, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      18, 
      5
    ]
  }, 
  {
    "name": "Polonium", 
    "appearance": "silvery", 
    "atomic_mass": 209, 
    "boil": 1235, 
    "category": "post-transition metal", 
    "color": null, 
    "density": 9.196, 
    "discovered_by": "Pierre Curie", 
    "melt": 527, 
    "molar_heat": 26.4, 
    "named_by": null, 
    "number": 84, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Polonium", 
    "spectral_img": null, 
    "summary": "Polonium is a chemical element with symbol Po and atomic number 84, discovered in 1898 by Marie Curie and Pierre Curie. A rare and highly radioactive element with no stable isotopes, polonium is chemically similar to bismuth and tellurium, and it occurs in uranium ores. Applications of polonium are few.", 
    "symbol": "Po", 
    "xpos": 16, 
    "ypos": 6, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      18, 
      6
    ]
  }, 
  {
    "name": "Astatine", 
    "appearance": "unknown, probably metallic", 
    "atomic_mass": 210, 
    "boil": 610, 
    "category": "metalloid", 
    "color": null, 
    "density": 26.35, 
    "discovered_by": "Dale R. Corson", 
    "melt": 575, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 85, 
    "period": 6, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Astatine", 
    "spectral_img": null, 
    "summary": "Astatine is a very rare radioactive chemical element with the chemical symbol At and atomic number 85. It occurs on Earth as the decay product of various heavier elements. All its isotopes are short-lived; the most stable is astatine-210, with a half-life of 8.1 hours.", 
    "symbol": "At", 
    "xpos": 17, 
    "ypos": 6, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      18, 
      7
    ]
  }, 
  {
    "name": "Radon", 
    "appearance": "colorless gas, occasionally glows green or red in discharge tubes", 
    "atomic_mass": 222, 
    "boil": 211.5, 
    "category": "noble gas", 
    "color": null, 
    "density": 9.73, 
    "discovered_by": "Friedrich Ernst Dorn", 
    "melt": 202, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 86, 
    "period": 6, 
    "phase": "Gas", 
    "source": "https://en.wikipedia.org/wiki/Radon", 
    "spectral_img": "https://en.wikipedia.org/wiki/File:Radon_spectrum.png", 
    "summary": "Radon is a chemical element with symbol Rn and atomic number 86. It is a radioactive, colorless, odorless, tasteless noble gas, occurring naturally as a decay product of radium. Its most stable isotope, 222Rn, has a half-life of 3.8 days.", 
    "symbol": "Rn", 
    "xpos": 18, 
    "ypos": 6, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      18, 
      8
    ]
  }, 
  {
    "name": "Francium", 
    "appearance": null, 
    "atomic_mass": 223, 
    "boil": 950, 
    "category": "alkali metal", 
    "color": null, 
    "density": 1.87, 
    "discovered_by": "Marguerite Perey", 
    "melt": 300, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 87, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Francium", 
    "spectral_img": null, 
    "summary": "Francium is a chemical element with symbol Fr and atomic number 87. It used to be known as eka-caesium and actinium K. It is the second-least electronegative element, behind only caesium. Francium is a highly radioactive metal that decays into astatine, radium, and radon.", 
    "symbol": "Fr", 
    "xpos": 1, 
    "ypos": 7, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      18, 
      8, 
      1
    ]
  }, 
  {
    "name": "Radium", 
    "appearance": "silvery white metallic", 
    "atomic_mass": 226, 
    "boil": 2010, 
    "category": "alkaline earth metal", 
    "color": null, 
    "density": 5.5, 
    "discovered_by": "Pierre Curie", 
    "melt": 1233, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 88, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Radium", 
    "spectral_img": null, 
    "summary": "Radium is a chemical element with symbol Ra and atomic number 88. It is the sixth element in group 2 of the periodic table, also known as the alkaline earth metals. Pure radium is almost colorless, but it readily combines with nitrogen (rather than oxygen) on exposure to air, forming a black surface layer of radium nitride (Ra3N2).", 
    "symbol": "Ra", 
    "xpos": 2, 
    "ypos": 7, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      18, 
      8, 
      2
    ]
  }, 
  {
    "name": "Actinium", 
    "appearance": null, 
    "atomic_mass": 227, 
    "boil": 3500, 
    "category": "actinide", 
    "color": null, 
    "density": 10, 
    "discovered_by": "Friedrich Oskar Giesel", 
    "melt": 1500, 
    "molar_heat": 27.2, 
    "named_by": null, 
    "number": 89, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Actinium", 
    "spectral_img": null, 
    "summary": "Actinium is a radioactive chemical element with symbol Ac (not to be confused with the abbreviation for an acetyl group) and atomic number 89, which was discovered in 1899. It was the first non-primordial radioactive element to be isolated. Polonium, radium and radon were observed before actinium, but they were not isolated until 1902.", 
    "symbol": "Ac", 
    "xpos": 3, 
    "ypos": 10, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      18, 
      9, 
      2
    ]
  }, 
  {
    "name": "Thorium", 
    "appearance": "silvery, often with black tarnish", 
    "atomic_mass": 232.03774, 
    "boil": 5061, 
    "category": "actinide", 
    "color": null, 
    "density": 11.724, 
    "discovered_by": "J\u00f6ns Jakob Berzelius", 
    "melt": 2023, 
    "molar_heat": 26.23, 
    "named_by": null, 
    "number": 90, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Thorium", 
    "spectral_img": null, 
    "summary": "Thorium is a chemical element with symbol Th and atomic number 90. A radioactive actinide metal, thorium is one of only two significantly radioactive elements that still occur naturally in large quantities as a primordial element (the other being uranium). It was discovered in 1828 by the Norwegian Reverend and amateur mineralogist Morten Thrane Esmark and identified by the Swedish chemist J\u00f6ns Jakob Berzelius, who named it after Thor, the Norse god of thunder.", 
    "symbol": "Th", 
    "xpos": 4, 
    "ypos": 10, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      18, 
      10, 
      2
    ]
  }, 
  {
    "name": "Protactinium", 
    "appearance": "bright, silvery metallic luster", 
    "atomic_mass": 231.035882, 
    "boil": 4300, 
    "category": "actinide", 
    "color": null, 
    "density": 15.37, 
    "discovered_by": "William Crookes", 
    "melt": 1841, 
    "molar_heat": null, 
    "named_by": "Otto Hahn", 
    "number": 91, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Protactinium", 
    "spectral_img": null, 
    "summary": "Protactinium is a chemical element with symbol Pa and atomic number 91. It is a dense, silvery-gray metal which readily reacts with oxygen, water vapor and inorganic acids. It forms various chemical compounds where protactinium is usually present in the oxidation state +5, but can also assume +4 and even +2 or +3 states.", 
    "symbol": "Pa", 
    "xpos": 5, 
    "ypos": 10, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      20, 
      9, 
      2
    ]
  }, 
  {
    "name": "Uranium", 
    "appearance": null, 
    "atomic_mass": 238.028913, 
    "boil": 4404, 
    "category": "actinide", 
    "color": null, 
    "density": 19.1, 
    "discovered_by": "Martin Heinrich Klaproth", 
    "melt": 1405.3, 
    "molar_heat": 27.665, 
    "named_by": null, 
    "number": 92, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Uranium", 
    "spectral_img": null, 
    "summary": "Uranium is a chemical element with symbol U and atomic number 92. It is a silvery-white metal in the actinide series of the periodic table. A uranium atom has 92 protons and 92 electrons, of which 6 are valence electrons.", 
    "symbol": "U", 
    "xpos": 6, 
    "ypos": 10, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      21, 
      9, 
      2
    ]
  }, 
  {
    "name": "Neptunium", 
    "appearance": "silvery metallic", 
    "atomic_mass": 237, 
    "boil": 4447, 
    "category": "actinide", 
    "color": null, 
    "density": 20.45, 
    "discovered_by": "Edwin McMillan", 
    "melt": 912, 
    "molar_heat": 29.46, 
    "named_by": null, 
    "number": 93, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Neptunium", 
    "spectral_img": null, 
    "summary": "Neptunium is a chemical element with symbol Np and atomic number 93. A radioactive actinide metal, neptunium is the first transuranic element. Its position in the periodic table just after uranium, named after the planet Uranus, led to it being named after Neptune, the next planet beyond Uranus.", 
    "symbol": "Np", 
    "xpos": 7, 
    "ypos": 10, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      22, 
      9, 
      2
    ]
  }, 
  {
    "name": "Plutonium", 
    "appearance": "silvery white, tarnishing to dark gray in air", 
    "atomic_mass": 244, 
    "boil": 3505, 
    "category": "actinide", 
    "color": null, 
    "density": 19.816, 
    "discovered_by": "Glenn T. Seaborg", 
    "melt": 912.5, 
    "molar_heat": 35.5, 
    "named_by": null, 
    "number": 94, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Plutonium", 
    "spectral_img": null, 
    "summary": "Plutonium is a transuranic radioactive chemical element with symbol Pu and atomic number 94. It is an actinide metal of silvery-gray appearance that tarnishes when exposed to air, and forms a dull coating when oxidized. The element normally exhibits six allotropes and four oxidation states.", 
    "symbol": "Pu", 
    "xpos": 8, 
    "ypos": 10, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      24, 
      8, 
      2
    ]
  }, 
  {
    "name": "Americium", 
    "appearance": "silvery white", 
    "atomic_mass": 243, 
    "boil": 2880, 
    "category": "actinide", 
    "color": null, 
    "density": 12, 
    "discovered_by": "Glenn T. Seaborg", 
    "melt": 1449, 
    "molar_heat": 62.7, 
    "named_by": null, 
    "number": 95, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Americium", 
    "spectral_img": "https://en.wikipedia.org/wiki/File:Americium_spectrum_visible.png", 
    "summary": "Americium is a radioactive transuranic chemical element with symbol Am and atomic number 95. This member of the actinide series is located in the periodic table under the lanthanide element europium, and thus by analogy was named after the Americas. Americium was first produced in 1944 by the group of Glenn T.Seaborg from Berkeley, California, at the metallurgical laboratory of University of Chicago.", 
    "symbol": "Am", 
    "xpos": 9, 
    "ypos": 10, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      25, 
      8, 
      2
    ]
  }, 
  {
    "name": "Curium", 
    "appearance": "silvery metallic, glows purple in the dark", 
    "atomic_mass": 247, 
    "boil": 3383, 
    "category": "actinide", 
    "color": null, 
    "density": 13.51, 
    "discovered_by": "Glenn T. Seaborg", 
    "melt": 1613, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 96, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Curium", 
    "spectral_img": null, 
    "summary": "Curium is a transuranic radioactive chemical element with symbol Cm and atomic number 96. This element of the actinide series was named after Marie and Pierre Curie \u2013 both were known for their research on radioactivity. Curium was first intentionally produced and identified in July 1944 by the group of Glenn T. Seaborg at the University of California, Berkeley.", 
    "symbol": "Cm", 
    "xpos": 10, 
    "ypos": 10, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      25, 
      9, 
      2
    ]
  }, 
  {
    "name": "Berkelium", 
    "appearance": "silvery", 
    "atomic_mass": 247, 
    "boil": 2900, 
    "category": "actinide", 
    "color": null, 
    "density": 14.78, 
    "discovered_by": "Lawrence Berkeley National Laboratory", 
    "melt": 1259, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 97, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Berkelium", 
    "spectral_img": null, 
    "summary": "Berkelium is a transuranic radioactive chemical element with symbol Bk and atomic number 97. It is a member of the actinide and transuranium element series. It is named after the city of Berkeley, California, the location of the University of California Radiation Laboratory where it was discovered in December 1949.", 
    "symbol": "Bk", 
    "xpos": 11, 
    "ypos": 10, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      27, 
      8, 
      2
    ]
  }, 
  {
    "name": "Californium", 
    "appearance": "silvery", 
    "atomic_mass": 251, 
    "boil": 1743, 
    "category": "actinide", 
    "color": null, 
    "density": 15.1, 
    "discovered_by": "Lawrence Berkeley National Laboratory", 
    "melt": 1173, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 98, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Californium", 
    "spectral_img": null, 
    "summary": "Californium is a radioactive metallic chemical element with symbol Cf and atomic number 98. The element was first made in 1950 at the University of California Radiation Laboratory in Berkeley, by bombarding curium with alpha particles (helium-4 ions). It is an actinide element, the sixth transuranium element to be synthesized, and has the second-highest atomic mass of all the elements that have been produced in amounts large enough to see with the unaided eye (after einsteinium).", 
    "symbol": "Cf", 
    "xpos": 12, 
    "ypos": 10, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      28, 
      8, 
      2
    ]
  }, 
  {
    "name": "Einsteinium", 
    "appearance": "silver-colored", 
    "atomic_mass": 252, 
    "boil": 1269, 
    "category": "actinide", 
    "color": null, 
    "density": 8.84, 
    "discovered_by": "Lawrence Berkeley National Laboratory", 
    "melt": 1133, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 99, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Einsteinium", 
    "spectral_img": null, 
    "summary": "Einsteinium is a synthetic element with symbol Es and atomic number 99. It is the seventh transuranic element, and an actinide. Einsteinium was discovered as a component of the debris of the first hydrogen bomb explosion in 1952, and named after Albert Einstein.", 
    "symbol": "Es", 
    "xpos": 13, 
    "ypos": 10, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      29, 
      8, 
      2
    ]
  }, 
  {
    "name": "Fermium", 
    "appearance": null, 
    "atomic_mass": 257, 
    "boil": null, 
    "category": "actinide", 
    "color": null, 
    "density": null, 
    "discovered_by": "Lawrence Berkeley National Laboratory", 
    "melt": 1800, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 100, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Fermium", 
    "spectral_img": null, 
    "summary": "Fermium is a synthetic element with symbol Fm and atomic number 100. It is a member of the actinide series. It is the heaviest element that can be formed by neutron bombardment of lighter elements, and hence the last element that can be prepared in macroscopic quantities, although pure fermium metal has not yet been prepared.", 
    "symbol": "Fm", 
    "xpos": 14, 
    "ypos": 10, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      30, 
      8, 
      2
    ]
  }, 
  {
    "name": "Mendelevium", 
    "appearance": null, 
    "atomic_mass": 258, 
    "boil": null, 
    "category": "actinide", 
    "color": null, 
    "density": null, 
    "discovered_by": "Lawrence Berkeley National Laboratory", 
    "melt": 1100, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 101, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Mendelevium", 
    "spectral_img": null, 
    "summary": "Mendelevium is a synthetic element with chemical symbol Md (formerly Mv) and atomic number 101. A metallic radioactive transuranic element in the actinide series, it is the first element that currently cannot be produced in macroscopic quantities through neutron bombardment of lighter elements. It is the antepenultimate actinide and the ninth transuranic element.", 
    "symbol": "Md", 
    "xpos": 15, 
    "ypos": 10, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      31, 
      8, 
      2
    ]
  }, 
  {
    "name": "Nobelium", 
    "appearance": null, 
    "atomic_mass": 259, 
    "boil": null, 
    "category": "actinide", 
    "color": null, 
    "density": null, 
    "discovered_by": "Joint Institute for Nuclear Research", 
    "melt": 1100, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 102, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Nobelium", 
    "spectral_img": null, 
    "summary": "Nobelium is a synthetic chemical element with symbol No and atomic number 102. It is named in honor of Alfred Nobel, the inventor of dynamite and benefactor of science. A radioactive metal, it is the tenth transuranic element and is the penultimate member of the actinide series.", 
    "symbol": "No", 
    "xpos": 16, 
    "ypos": 10, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      32, 
      8, 
      2
    ]
  }, 
  {
    "name": "Lawrencium", 
    "appearance": null, 
    "atomic_mass": 266, 
    "boil": null, 
    "category": "actinide", 
    "color": null, 
    "density": null, 
    "discovered_by": "Lawrence Berkeley National Laboratory", 
    "melt": 1900, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 103, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Lawrencium", 
    "spectral_img": null, 
    "summary": "Lawrencium is a synthetic chemical element with chemical symbol Lr (formerly Lw) and atomic number 103. It is named in honor of Ernest Lawrence, inventor of the cyclotron, a device that was used to discover many artificial radioactive elements. A radioactive metal, lawrencium is the eleventh transuranic element and is also the final member of the actinide series.", 
    "symbol": "Lr", 
    "xpos": 17, 
    "ypos": 10, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      32, 
      8, 
      3
    ]
  }, 
  {
    "name": "Rutherfordium", 
    "appearance": null, 
    "atomic_mass": 267, 
    "boil": 5800, 
    "category": "transition metal", 
    "color": null, 
    "density": 23.2, 
    "discovered_by": "Joint Institute for Nuclear Research", 
    "melt": 2400, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 104, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Rutherfordium", 
    "spectral_img": null, 
    "summary": "Rutherfordium is a chemical element with symbol Rf and atomic number 104, named in honor of physicist Ernest Rutherford. It is a synthetic element (an element that can be created in a laboratory but is not found in nature) and radioactive; the most stable known isotope, 267Rf, has a half-life of approximately 1.3 hours. In the periodic table of the elements, it is a d - block element and the second of the fourth - row transition elements.", 
    "symbol": "Rf", 
    "xpos": 4, 
    "ypos": 7, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      32, 
      10, 
      2
    ]
  }, 
  {
    "name": "Dubnium", 
    "appearance": null, 
    "atomic_mass": 268, 
    "boil": null, 
    "category": "transition metal", 
    "color": null, 
    "density": 29.3, 
    "discovered_by": "Joint Institute for Nuclear Research", 
    "melt": null, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 105, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Dubnium", 
    "spectral_img": null, 
    "summary": "Dubnium is a chemical element with symbol Db and atomic number 105. It is named after the town of Dubna in Russia (north of Moscow), where it was first produced. It is a synthetic element (an element that can be created in a laboratory but is not found in nature) and radioactive; the most stable known isotope, dubnium-268, has a half-life of approximately 28 hours.", 
    "symbol": "Db", 
    "xpos": 5, 
    "ypos": 7, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      32, 
      11, 
      2
    ]
  }, 
  {
    "name": "Seaborgium", 
    "appearance": null, 
    "atomic_mass": 269, 
    "boil": null, 
    "category": "transition metal", 
    "color": null, 
    "density": 35.0, 
    "discovered_by": "Lawrence Berkeley National Laboratory", 
    "melt": null, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 106, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Seaborgium", 
    "spectral_img": null, 
    "summary": "Seaborgium is a synthetic element with symbol Sg and atomic number 106. Its most stable isotope 271Sg has a half-life of 1.9 minutes. A more recently discovered isotope 269Sg has a potentially slightly longer half-life (ca.", 
    "symbol": "Sg", 
    "xpos": 6, 
    "ypos": 7, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      32, 
      12, 
      2
    ]
  }, 
  {
    "name": "Bohrium", 
    "appearance": null, 
    "atomic_mass": 270, 
    "boil": null, 
    "category": "transition metal", 
    "color": null, 
    "density": 37.1, 
    "discovered_by": "Gesellschaft f\u00fcr Schwerionenforschung", 
    "melt": null, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 107, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Bohrium", 
    "spectral_img": null, 
    "summary": "Bohrium is a chemical element with symbol Bh and atomic number 107. It is named after Danish physicist Niels Bohr. It is a synthetic element (an element that can be created in a laboratory but is not found in nature) and radioactive; the most stable known isotope, 270Bh, has a half-life of approximately 61 seconds.", 
    "symbol": "Bh", 
    "xpos": 7, 
    "ypos": 7, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      32, 
      13, 
      2
    ]
  }, 
  {
    "name": "Hassium", 
    "appearance": null, 
    "atomic_mass": 269, 
    "boil": null, 
    "category": "transition metal", 
    "color": null, 
    "density": 40.7, 
    "discovered_by": "Gesellschaft f\u00fcr Schwerionenforschung", 
    "melt": 126, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 108, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Hassium", 
    "spectral_img": null, 
    "summary": "Hassium is a chemical element with symbol Hs and atomic number 108, named after the German state of Hesse. It is a synthetic element (an element that can be created in a laboratory but is not found in nature) and radioactive; the most stable known isotope, 269Hs, has a half-life of approximately 9.7 seconds, although an unconfirmed metastable state, 277mHs, may have a longer half-life of about 130 seconds. More than 100 atoms of hassium have been synthesized to date.", 
    "symbol": "Hs", 
    "xpos": 8, 
    "ypos": 7, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      32, 
      14, 
      2
    ]
  }, 
  {
    "name": "Meitnerium", 
    "appearance": null, 
    "atomic_mass": 278, 
    "boil": null, 
    "category": "unknown, probably transition metal", 
    "color": null, 
    "density": 37.4, 
    "discovered_by": "Gesellschaft f\u00fcr Schwerionenforschung", 
    "melt": null, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 109, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Meitnerium", 
    "spectral_img": null, 
    "summary": "Meitnerium is a chemical element with symbol Mt and atomic number 109. It is an extremely radioactive synthetic element (an element not found in nature that can be created in a laboratory). The most stable known isotope, meitnerium-278, has a half-life of 7.6 seconds.", 
    "symbol": "Mt", 
    "xpos": 9, 
    "ypos": 7, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      32, 
      15, 
      2
    ]
  }, 
  {
    "name": "Darmstadtium", 
    "appearance": null, 
    "atomic_mass": 281, 
    "boil": null, 
    "category": "unknown, probably transition metal", 
    "color": null, 
    "density": 34.8, 
    "discovered_by": "Gesellschaft f\u00fcr Schwerionenforschung", 
    "melt": null, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 110, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Darmstadtium", 
    "spectral_img": null, 
    "summary": "Darmstadtium is a chemical element with symbol Ds and atomic number 110. It is an extremely radioactive synthetic element. The most stable known isotope, darmstadtium-281, has a half-life of approximately 10 seconds.", 
    "symbol": "Ds", 
    "xpos": 10, 
    "ypos": 7, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      32, 
      16, 
      2
    ]
  }, 
  {
    "name": "Roentgenium", 
    "appearance": null, 
    "atomic_mass": 282, 
    "boil": null, 
    "category": "unknown, probably transition metal", 
    "color": null, 
    "density": 28.7, 
    "discovered_by": "Gesellschaft f\u00fcr Schwerionenforschung", 
    "melt": null, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 111, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Roentgenium", 
    "spectral_img": null, 
    "summary": "Roentgenium is a chemical element with symbol Rg and atomic number 111. It is an extremely radioactive synthetic element (an element that can be created in a laboratory but is not found in nature); the most stable known isotope, roentgenium-282, has a half-life of 2.1 minutes. Roentgenium was first created in 1994 by the GSI Helmholtz Centre for Heavy Ion Research near Darmstadt, Germany.", 
    "symbol": "Rg", 
    "xpos": 11, 
    "ypos": 7, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      32, 
      17, 
      2
    ]
  }, 
  {
    "name": "Copernicium", 
    "appearance": null, 
    "atomic_mass": 285, 
    "boil": 3570, 
    "category": "transition metal", 
    "color": null, 
    "density": 23.7, 
    "discovered_by": "Gesellschaft f\u00fcr Schwerionenforschung", 
    "melt": null, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 112, 
    "period": 7, 
    "phase": "Gas", 
    "source": "https://en.wikipedia.org/wiki/Copernicium", 
    "spectral_img": null, 
    "summary": "Copernicium is a chemical element with symbol Cn and atomic number 112. It is an extremely radioactive synthetic element that can only be created in a laboratory. The most stable known isotope, copernicium-285, has a half-life of approximately 29 seconds, but it is possible that this copernicium isotope may have a nuclear isomer with a longer half-life, 8.9 min.", 
    "symbol": "Cn", 
    "xpos": 12, 
    "ypos": 7, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      32, 
      18, 
      2
    ]
  }, 
  {
    "name": "Nihonium", 
    "appearance": null, 
    "atomic_mass": 286, 
    "boil": 1430, 
    "category": "unknown, probably transition metal", 
    "color": null, 
    "density": 16, 
    "discovered_by": "RIKEN", 
    "melt": 700, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 113, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Ununtrium", 
    "spectral_img": null, 
    "summary": "Nihonium is a chemical element with atomic number 113. It has a symbol Nh. It is a synthetic element (an element that can be created in a laboratory but is not found in nature) and is extremely radioactive; its most stable known isotope, nihonium-286, has a half-life of 20 seconds.", 
    "symbol": "Nh", 
    "xpos": 13, 
    "ypos": 7, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      32, 
      18, 
      3
    ]
  }, 
  {
    "name": "Flerovium", 
    "appearance": null, 
    "atomic_mass": 289, 
    "boil": 420, 
    "category": "post-transition metal", 
    "color": null, 
    "density": 14, 
    "discovered_by": "Joint Institute for Nuclear Research", 
    "melt": 340, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 114, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Flerovium", 
    "spectral_img": null, 
    "summary": "Flerovium is a superheavy artificial chemical element with symbol Fl and atomic number 114. It is an extremely radioactive synthetic element. The element is named after the Flerov Laboratory of Nuclear Reactions of the Joint Institute for Nuclear Research in Dubna, Russia, where the element was discovered in 1998.", 
    "symbol": "Fl", 
    "xpos": 14, 
    "ypos": 7, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      32, 
      18, 
      4
    ]
  }, 
  {
    "name": "Moscovium", 
    "appearance": null, 
    "atomic_mass": 289, 
    "boil": 1400, 
    "category": "unknown, probably post-transition metal", 
    "color": null, 
    "density": 13.5, 
    "discovered_by": "Joint Institute for Nuclear Research", 
    "melt": 670, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 115, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Ununpentium", 
    "spectral_img": null, 
    "summary": "Moscovium is the name of a synthetic superheavy element in the periodic table that has the symbol Mc and has the atomic number 115. It is an extremely radioactive element; its most stable known isotope, moscovium-289, has a half-life of only 220 milliseconds. It is also known as eka-bismuth or simply element 115.", 
    "symbol": "Mc", 
    "xpos": 15, 
    "ypos": 7, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      32, 
      18, 
      5
    ]
  }, 
  {
    "name": "Livermorium", 
    "appearance": null, 
    "atomic_mass": 293, 
    "boil": 1085, 
    "category": "unknown, probably post-transition metal", 
    "color": null, 
    "density": 12.9, 
    "discovered_by": "Joint Institute for Nuclear Research", 
    "melt": 709, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 116, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Livermorium", 
    "spectral_img": null, 
    "summary": "Livermorium is a synthetic superheavy element with symbol Lv and atomic number 116. It is an extremely radioactive element that has only been created in the laboratory and has not been observed in nature. The element is named after the Lawrence Livermore National Laboratory in the United States, which collaborated with the Joint Institute for Nuclear Research in Dubna, Russia to discover livermorium in 2000.", 
    "symbol": "Lv", 
    "xpos": 16, 
    "ypos": 7, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      32, 
      18, 
      6
    ]
  }, 
  {
    "name": "Tennessine", 
    "appearance": null, 
    "atomic_mass": 294, 
    "boil": 883, 
    "category": "unknown, probably metalloid", 
    "color": null, 
    "density": 7.17, 
    "discovered_by": "Joint Institute for Nuclear Research", 
    "melt": 723, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 117, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Tennessine",
    "spectral_img": null, 
    "summary": "Tennessine is a superheavy artificial chemical element with an atomic number of 117 and a symbol of Ts. Also known as eka-astatine or element 117, it is the second-heaviest known element and penultimate element of the 7th period of the periodic table. As of 2016, fifteen tennessine atoms have been observed:six when it was first synthesized in 2010, seven in 2012, and two in 2014.", 
    "symbol": "Ts", 
    "xpos": 17, 
    "ypos": 7, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      32, 
      18, 
      7
    ]
  }, 
  {
    "name": "Oganesson", 
    "appearance": null, 
    "atomic_mass": 294, 
    "boil": 350, 
    "category": "unknown, predicted to be noble gas", 
    "color": null, 
    "density": 4.95, 
    "discovered_by": "Joint Institute for Nuclear Research", 
    "melt": null, 
    "molar_heat": null, 
    "named_by": null, 
    "number": 118, 
    "period": 7, 
    "phase": "Solid", 
    "source": "https://en.wikipedia.org/wiki/Oganesson",
    "spectral_img": null, 
    "summary": "Oganesson is IUPAC's name for the transactinide element with the atomic number 118 and element symbol Og. It is also known as eka-radon or element 118, and on the periodic table of the elements it is a p-block element and the last one of the 7th period. Oganesson is currently the only synthetic member of group 18.", 
    "symbol": "Og", 
    "xpos": 18, 
    "ypos": 7, 
    "shells": [
      2,
      8, 
      18, 
      32, 
      32, 
      18, 
      8
    ]
  },
  {
    "name": "Ununennium",
    "appearance": null,
    "atomic_mass": 315,
    "boil": 630,
    "category": "unknown, but predicted to be an alkali metal",
    "color": null,
    "density": 3,
    "discovered_by": "GSI Helmholtz Centre for Heavy Ion Research",
    "melt": null,
    "molar_heat": null,
    "named_by": null,
    "number": 119,
    "period": 8,
    "phase": "Solid",
    "source": "https://en.wikipedia.org/wiki/Ununennium",
    "spectral_img": null,
    "summary": "Ununennium, also known as eka-francium or simply element 119, is the hypothetical chemical element with symbol Uue and atomic number 119. Ununennium and Uue are the temporary systematic IUPAC name and symbol respectively, until a permanent name is decided upon. In the periodic table of the elements, it is expected to be an s-block element, an alkali metal, and the first element in the eighth period.",
    "symbol": "Uue",
    "xpos": 1,
    "ypos": 8,
    "shells": [
      2,
      8,
      18,
      32,
      32,
      18,
      8,
      1
    ]
  }
]

for (let elem of elements) {
  window[elem.symbol] = elem
  elem.atomicMass = elem.atomic_mass
  elem.getConfiguration = (long) => getConfiguration(elem.number, long)
  elem.getDSpacing = (plane, d) => {
    d = d || elem.dSpacings[plane] || 0
    d /= angstrom
    console.log(`d spacing: ${d.toFixed(2)} angstroms`)
    return d * angstrom
  }
}
Cu.workFunction = 7.53e-19
Ca.workFunction = 4.60e-19
Sn.workFunction = 7.08e-19
Na.workFunction = 3.89e-19
Hf.workFunction = 6.25e-19
Sm.workFunction = 4.33e-19
Fe.dSpacings = {}
Fe.dSpacings.ioo = 2.87 * angstrom

// compoundsList
const water = H2O = comp('H2O')
water.gasCapacity = 36.21015 // joules per mol-kelvin
water.liquidCapacity = 75.37476 // joules per mol-kelvin, 4.184 joules per gram-kelvin
water.solidCapacity = 37.65135 // joules per mol-kelvin
water.enthalpy = -2.858e5 // joules per mol
water.entropy = 70 // joules per mol-kelvin
water.triplePoint = new State(6.105e-1, sTP, 273.16)
water.criticalPoint = new State(218 * atm, sTP, zeroC + 374)
water.fusion = 6.00890325e3 // joules per mol
water.vaporization = 4.065e4
water.freezingDepression = 1.853 // degrees C per molal
const carbonDioxide = CO2 = comp('CO2')
carbonDioxide.triplePoint = new State(5.177708e2, sTP, zeroC - 56.6)
carbonDioxide.criticalPoint = new State(73 * atm, sTP, zeroC + 31)
const methane = CH4 = comp('CH4')
const cuprite = Cu2O = comp('Cu2O')
const pyrite = FeS2 = comp('FeS2')
const ferricSulfate = Fe2O12S3 = comp('Fe2(SO4)3')
const iron3Oxide = Fe2O3 = comp('Fe2O3')
iron3Oxide.enthalpy = -8.26e5
const salt = sodiumChloride = NaCl = comp('NaCl')
salt.enthalpy = -4.0727e5
const ammoniumChloride = NH3Cl = comp('NH3Cl')
ammoniumChloride.enthalpy = -3.1455e5
ammoniumChloride.entropy = 94.85
const bariumChloride = BaCl2 = comp('BaCl2')
bariumChloride.enthalpy = -8.550e5
bariumChloride.entropy = 123.7
const ammonium = NH4 = comp('NH4')
ammonium.charge = 1
const ammonia = NH3 = comp('NH3')
ammonia.enthalpy = -4.59e4
ammonia.entropy = 192.8
ammonia.Kb = 1.8e-5
const aceticAcid = CH3COOH = comp('CH3COOH')
aceticAcid.Ka = 1.8e-5
const acetate = CH3COO = comp('CH3COO')
acetate.charge = -1
const borate = BO3 = comp('BO3')
const bromate = BrO3 = comp('BrO3')
const carbonate = CO3 = comp('CO3')
const chlorate = ClO3 = comp('ClO3')
const chromate = CrO4 = comp('CrO4')
const cyanide = CN = comp('CN')
const dichromate = Cr2O7 = comp('Cr2O7')
const hydroxide = OH = comp('OH')
const iodate = IO3 = comp('IO3')
const nitrate = NO3 = comp('NO3')
const phosphate = PO4 = comp('PO4')
const sulfate = SO4 = comp('SO4')
const glucose = C6H12O6 = comp('C6H12O6')
const sucrose = C12H22O11 = comp('C12H22O11')
const adrenaline = C9H13NO3 = comp('C9H13NO3')

// Strong acids
const hydrochloricAcid = HCl = comp('HCl')
hydrochloricAcid.enthalpy = -1.672e5
const sulfuricAcid = H2SO4 = comp('H2SO4')
const hydrobromicAcid = HBr = comp('HBr')
const hydroiodicAcid = HI = comp('HI')
const nitricAcid = HNO3 = comp('HNO3')
const perchloricAcid = HClO4 = comp('HClO4')
const chloricAcid = HClO3 = comp('HClO3')

// Strong bases
const lye = sodiumHydroxide = NaOH = comp('NaOH')
lye.enthalpy = -4.6915e5
const lithiumHydroxide = LiOH = comp('LiOH')
const potassiumHydroxide = KOH = comp('KOH')
const cesiumHydroxide = CsOH = comp('CsOH')
const rubidiumHydroxide = comp('Rb(OH)2')
const strontiumHydroxide = comp('Sr(OH)2')
const bariumHydroxide = comp('Ba(OH)2')
bariumHydroxide.enthalpy = -9.982e5
bariumHydroxide.entropy = 302
