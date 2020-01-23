const mech = {};

// BRITTLE
mech.youngsModulus = (options) => {
  const {
    changeInStress,
    changeInStrain
  } = options;
  return changeInStress / changeInStrain;
};

mech.theoreticalCleavageStrength = (options) => {
  const {
    planeSpacing,
    youngsModulus,
    surfaceEnergy,
    d,
    K
  } = options;
  const ouptput = {}
  
  if (planeSpacing && youngsModulus) {
    if (surfaceEnergy) {
      output.surfaceEnergy = surfaceEnergy;
      output.strength = Math.sqrt((youngsModulus, surfaceEnergy) / planeSpacing);
    }
    if (surfaceEnergy && K) {
      d = (surfaceEnergy * Math.PI) / K;
    }
    if (d) {
      output.d = d;
      output.K = (youngsModulus * d) / (planeSpacing * Math.PI);
      output.surfaceEnergy = (output.K * d) / Math.PI;
      output.strength = Math.sqrt((youngsModulus, output.surfaceEnergy) / planeSpacing);
      output.stressFunction = (strain) => K * Math.sin(Math.PI / d) * strain * planeSpacing;
    }
  }
  return output;
};

// Table 1.4

// DUCTILE
mech.shearStress = (options) => {
  const {
    k,
    displacement,
    burgersVector,
    planeSpacing,
    shearModulus,
    surfaceEnergy
  } = options;
  output = {};

  if (k) {
    output.k = k;
    output.stress = (displacement) => k * Math.sin((displacement * Math.PI * 2) / burgersVector);
  } else if (shearModulus) {
    output.shearModuls = shearModulus;
    if (surfaceEnergy) {
      output.stress = shearModulus * surfaceEnergy;
    } else if (planeSpacing) {
      output.stressFunction = (x) => shearModulus * x / planeSpacing;
      if (displacement) {
	output.stress = output.stressFunction(displacement);
      }
      if (burgersVector) {
	output.k = (shearModulus * burgersVector) / (planeSpacing * Math.PI * 2);
	output.maxStress = output.stressFunction(burgersVector / 4);
      }
    }
  }
  return output;
}
