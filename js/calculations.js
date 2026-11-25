const NutriCalc = {
  // Función de distribución normal acumulada (Aproximación Abramowitz & Stegun) -> Percentil 0.1 a 99.9
  zToPercentile(z) {
    if (z === null || isNaN(z)) return null;
    const sign = z < 0 ? -1 : 1;
    const x = Math.abs(z) / Math.sqrt(2);
    const t = 1 / (1 + 0.3275911 * x);
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const erf = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    const cdf = 0.5 * (1 + sign * erf);
    const pct = cdf * 100;
    if (pct < 0.1) return "< 0.1";
    if (pct > 99.9) return "> 99.9";
    return pct.toFixed(1);
  },

  // Cálculo Z-Score LMS oficial de la OMS
  calcLmsZ(value, lms) {
    if (!value || value <= 0 || !lms) return null;
    const { L, M, S } = lms;
    if (Math.abs(L) < 1e-6) {
      return Math.log(value / M) / S;
    }
    return (Math.pow(value / M, L) - 1) / (L * S);
  },

  // Interpolación lineal sobre nodos LMS OMS
  interpolateLMS(x, table) {
    if (x < table[0][0] || x > table[table.length - 1][0]) return null;
    for (let i = 0; i < table.length - 1; i++) {
      const [x0, L0, M0, S0] = table[i];
      const [x1, L1, M1, S1] = table[i + 1];
      if (x >= x0 && x <= x1) {
        const t = x1 === x0 ? 0 : (x - x0) / (x1 - x0);
        return {
          L: L0 + t * (L1 - L0),
          M: M0 + t * (M1 - M0),
          S: S0 + t * (S1 - S0)
        };
      }
    }
    return null;
  },

  // Tablas de referencia OMS (LMS)
  WHO_LMS: {
    lengthHeightForAge: {
      M: [
        [0, 1, 49.8842, 0.03795], [3, 1, 61.4292, 0.03281], [6, 1, 67.6236, 0.03165],
        [12, 1, 75.7488, 0.03175], [18, 1, 82.2587, 0.03285], [24, 1, 87.8161, 0.03412],
        [36, 1, 96.0835, 0.03797], [48, 1, 103.3273, 0.04057], [60, 1, 110.0000, 0.04248],
        [72, 1, 115.9509, 0.04393], [84, 1, 121.7338, 0.04515], [96, 1, 127.2726, 0.04628],
        [108, 1, 132.5724, 0.04736], [120, 1, 137.7755, 0.04843], [132, 1, 143.1337, 0.04945],
        [144, 1, 149.0823, 0.05017], [156, 1, 156.0431, 0.05004], [168, 1, 163.1790, 0.04868],
        [180, 1, 168.9886, 0.04664], [192, 1, 172.9277, 0.04474], [204, 1, 175.1583, 0.04340],
        [216, 1, 176.1430, 0.04258], [228, 1, 176.5432, 0.04215]
      ],
      F: [
        [0, 1, 49.1477, 0.03790], [3, 1, 59.8029, 0.03394], [6, 1, 65.7311, 0.03348],
        [12, 1, 74.0150, 0.03418], [18, 1, 80.7079, 0.03538], [24, 1, 86.4153, 0.03686],
        [36, 1, 95.0515, 0.03940], [48, 1, 102.7312, 0.04156], [60, 1, 109.4233, 0.04321],
        [72, 1, 115.1244, 0.04453], [84, 1, 120.8065, 0.04574], [96, 1, 126.5562, 0.04684],
        [108, 1, 132.4939, 0.04775], [120, 1, 138.6458, 0.04825], [132, 1, 144.9789, 0.04799],
        [144, 1, 151.2392, 0.04673], [156, 1, 156.4046, 0.04481], [168, 1, 159.7824, 0.04296],
        [180, 1, 161.6531, 0.04158], [192, 1, 162.5396, 0.04068], [204, 1, 162.9415, 0.04015],
        [216, 1, 163.1128, 0.03987], [228, 1, 163.1753, 0.03974]
      ]
    },
    weightForAge: {
      M: [
        [0, 0.3487, 3.3464, 0.14602], [3, 0.1738, 6.3762, 0.11727], [6, 0.0895, 7.9340, 0.11269],
        [12, -0.0258, 9.6479, 0.11172], [18, -0.0846, 10.9385, 0.11316], [24, -0.1235, 12.1515, 0.11578],
        [36, -0.1756, 14.3429, 0.12268], [48, -0.2140, 16.3489, 0.13060], [60, -0.2449, 18.3366, 0.13917],
        [72, -0.2890, 20.5112, 0.14925], [84, -0.3462, 22.9056, 0.16101], [96, -0.4090, 25.4328, 0.17431],
        [108, -0.4673, 28.1257, 0.18868], [120, -0.5067, 31.1588, 0.20312]
      ],
      F: [
        [0, 0.3809, 3.2322, 0.14171], [3, 0.1124, 5.8458, 0.12186], [6, 0.0273, 7.2970, 0.12055],
        [12, -0.0684, 8.9481, 0.12268], [18, -0.1206, 10.2315, 0.12619], [24, -0.1563, 11.4775, 0.13020],
        [36, -0.2055, 13.8503, 0.13918], [48, -0.2392, 16.0697, 0.14895], [60, -0.2644, 18.2193, 0.15913],
        [72, -0.3125, 20.1715, 0.17042], [84, -0.3694, 22.3712, 0.18315], [96, -0.4220, 25.0258, 0.19655],
        [108, -0.4578, 28.2041, 0.20911], [120, -0.4648, 31.8943, 0.21912]
      ]
    },
    weightForLengthHeight: {
      M: [
        [45, -0.3521, 2.4410, 0.09182], [55, -0.3521, 4.5446, 0.08527], [65, -0.3521, 7.1296, 0.08152],
        [75, -0.3521, 9.4832, 0.07938], [85, -0.3521, 11.6634, 0.07943], [95, -0.3521, 14.0842, 0.08184],
        [105, -0.3521, 16.8420, 0.08589], [115, -0.3521, 20.2356, 0.09132], [120, -0.3521, 22.2564, 0.09450]
      ],
      F: [
        [45, -0.3833, 2.4607, 0.09029], [55, -0.3833, 4.4622, 0.08543], [65, -0.3833, 6.9538, 0.08302],
        [75, -0.3833, 9.1936, 0.08164], [85, -0.3833, 11.3519, 0.08225], [95, -0.3833, 13.7918, 0.08521],
        [105, -0.3833, 16.5902, 0.08982], [115, -0.3833, 20.0118, 0.09585], [120, -0.3833, 22.0785, 0.09925]
      ]
    },
    headCircForAge: {
      M: [
        [0, 1, 34.4618, 0.03686], [3, 1, 40.5135, 0.02975], [6, 1, 43.3306, 0.02821],
        [12, 1, 46.0689, 0.02736], [18, 1, 47.4170, 0.02711], [24, 1, 48.2735, 0.02705],
        [36, 1, 49.4764, 0.02716], [48, 1, 50.2547, 0.02741], [60, 1, 50.7445, 0.02770]
      ],
      F: [
        [0, 1, 33.8787, 0.03496], [3, 1, 39.5328, 0.02953], [6, 1, 42.1997, 0.02836],
        [12, 1, 44.8981, 0.02778], [18, 1, 46.2450, 0.02762], [24, 1, 47.1753, 0.02757],
        [36, 1, 48.5117, 0.02765], [48, 1, 49.3490, 0.02784], [60, 1, 49.8984, 0.02808]
      ]
    },
    muacForAge: {
      M: [
        [3, 0.3999, 13.4577, 0.08379], [6, 0.3121, 14.1972, 0.08012], [12, 0.2145, 14.6143, 0.07855],
        [18, 0.1450, 14.8321, 0.07932], [24, 0.0912, 15.1645, 0.08115], [36, 0.0054, 15.7210, 0.08642],
        [48, -0.0680, 16.1924, 0.09285], [60, -0.1350, 16.6412, 0.10012]
      ],
      F: [
        [3, 0.3412, 13.0214, 0.08642], [6, 0.2580, 13.7845, 0.08312], [12, 0.1654, 14.2190, 0.08195],
        [18, 0.1012, 14.5120, 0.08310], [24, 0.0520, 14.9140, 0.08542], [36, -0.0245, 15.5680, 0.09145],
        [48, -0.0890, 16.1240, 0.09850], [60, -0.1480, 16.6780, 0.10620]
      ]
    },
    subscapularForAge: {
      M: [
        [3, -0.1950, 8.1240, 0.1985], [6, -0.2120, 7.4520, 0.2015], [12, -0.2380, 6.7240, 0.2080],
        [18, -0.2590, 6.3850, 0.2145], [24, -0.2780, 6.1420, 0.2215], [36, -0.3120, 5.8450, 0.2360],
        [48, -0.3450, 5.6210, 0.2510], [60, -0.3780, 5.4680, 0.2665]
      ],
      F: [
        [3, -0.1820, 8.3850, 0.2010], [6, -0.2010, 7.6840, 0.2045], [12, -0.2290, 6.9120, 0.2115],
        [18, -0.2510, 6.5840, 0.2185], [24, -0.2710, 6.3650, 0.2260], [36, -0.3050, 6.1240, 0.2410],
        [48, -0.3380, 5.9850, 0.2565], [60, -0.3710, 5.9120, 0.2720]
      ]
    },
    tricepsForAge: {
      M: [
        [3, 0.0850, 10.2450, 0.1845], [6, 0.0420, 10.3120, 0.1875], [12, -0.0150, 9.8450, 0.1920],
        [18, -0.0580, 9.4820, 0.1965], [24, -0.0950, 9.1850, 0.2015], [36, -0.1580, 8.7420, 0.2115],
        [48, -0.2120, 8.3850, 0.2215], [60, -0.2620, 8.0640, 0.2320]
      ],
      F: [
        [3, 0.0720, 10.1240, 0.1865], [6, 0.0280, 10.2150, 0.1895], [12, -0.0280, 9.7840, 0.1945],
        [18, -0.0710, 9.5240, 0.1995], [24, -0.1080, 9.3650, 0.2045], [36, -0.1680, 9.1420, 0.2145],
        [48, -0.2210, 8.9850, 0.2245], [60, -0.2710, 8.8640, 0.2350]
      ]
    }
  },

  calcularPediatricoOMS(data, sexo) {
    const sexKey = sexo === "F" ? "F" : "M";
    const ped = data.pediatrico || {};
    const meses = parseFloat(ped.edadMeses);
    const peso = parseFloat(data.peso) || 0;
    const talla = parseFloat(data.talla) || 0;
    const cefalica = parseFloat(ped.cefalica) || parseFloat(data.perimetrosExtra?.cefalico) || 0;
    const brazo = parseFloat(ped.brazo) || parseFloat(data.brazo_rel) || 0;
    const subescapular = parseFloat(data.pliegues?.subescapular) || 0;
    const triceps = parseFloat(data.pliegues?.triceps) || 0;

    const formatIndicator = (val, unit, z, dxFn) => {
      if (!val || val <= 0 || z === null || isNaN(z)) {
        return {
          valTxt: val > 0 ? `${val} ${unit}` : "Sin dato",
          zTxt: "—",
          pctTxt: "—",
          dx: val > 0 ? "Fuera de rango OMS para este indicador" : "Falta captura"
        };
      }
      const pct = this.zToPercentile(z);
      return {
        valTxt: `${val} ${unit}`,
        zTxt: (z >= 0 ? "+" : "") + z.toFixed(2) + " DE",
        pctTxt: `P${pct}`,
        dx: dxFn(z)
      };
    };

    let zTallaEdad = null;
    if (!isNaN(meses) && talla > 0) {
      const lms = this.interpolateLMS(meses, this.WHO_LMS.lengthHeightForAge[sexKey]);
      zTallaEdad = this.calcLmsZ(talla, lms);
    }
    const tallaEdad = formatIndicator(talla, "cm", zTallaEdad, (z) => {
      if (z < -3) return "Talla baja severa (< -3 DE)";
      if (z < -2) return "Talla baja (< -2 DE)";
      if (z <= 2) return "Longitud / Estatura adecuada";
      return "Talla alta (> +2 DE)";
    });

    let zPesoEdad = null;
    if (!isNaN(meses) && peso > 0) {
      const lms = this.interpolateLMS(meses, this.WHO_LMS.weightForAge[sexKey]);
      zPesoEdad = this.calcLmsZ(peso, lms);
    }
    const pesoEdad = formatIndicator(peso, "kg", zPesoEdad, (z) => {
      if (z < -3) return "Bajo peso severo (< -3 DE)";
      if (z < -2) return "Bajo peso (< -2 DE)";
      if (z <= 1) return "Peso adecuado para la edad";
      if (z <= 2) return "Posible riesgo de sobrepeso";
      return "Peso elevado para la edad (> +2 DE)";
    });

    let zPesoTalla = null;
    if (talla > 0 && peso > 0) {
      const lms = this.interpolateLMS(talla, this.WHO_LMS.weightForLengthHeight[sexKey]);
      zPesoTalla = this.calcLmsZ(peso, lms);
    }
    const pesoTalla = formatIndicator(
      peso > 0 && talla > 0 ? `${peso} kg / ${talla}` : 0,
      "cm",
      zPesoTalla,
      (z) => {
        if (z < -3) return "Emaciación severa (< -3 DE)";
        if (z < -2) return "Emaciación (< -2 DE)";
        if (z <= 1) return "Peso normal para la longitud/estatura";
        if (z <= 2) return "Riesgo de sobrepeso (+1 a +2 DE)";
        if (z <= 3) return "Sobrepeso (+2 a +3 DE)";
        return "Obesidad (> +3 DE)";
      }
    );

    let zCefalica = null;
    if (!isNaN(meses) && cefalica > 0) {
      const lms = this.interpolateLMS(meses, this.WHO_LMS.headCircForAge[sexKey]);
      zCefalica = this.calcLmsZ(cefalica, lms);
    }
    const cefalicaEdad = formatIndicator(cefalica, "cm", zCefalica, (z) => {
      if (z < -2) return "Microcefalia (< -2 DE)";
      if (z <= 2) return "Perímetro cefálico normal (-2 a +2 DE)";
      return "Macrocefalia (> +2 DE)";
    });

    let zBrazo = null;
    if (!isNaN(meses) && brazo > 0) {
      const lms = this.interpolateLMS(meses, this.WHO_LMS.muacForAge[sexKey]);
      zBrazo = this.calcLmsZ(brazo, lms);
    }
    const brazoEdad = formatIndicator(brazo, "cm", zBrazo, (z) => {
      if (z < -3) return "Desnutrición aguda severa (< -3 DE)";
      if (z < -2) return "Desnutrición aguda moderada (< -2 DE)";
      if (z <= 2) return "Reserva muscular braquial normal";
      return "Perímetro braquial elevado (> +2 DE)";
    });

    let zSubescapular = null;
    if (!isNaN(meses) && subescapular > 0) {
      const lms = this.interpolateLMS(meses, this.WHO_LMS.subscapularForAge[sexKey]);
      zSubescapular = this.calcLmsZ(subescapular, lms);
    }
    const subescapularEdad = formatIndicator(subescapular, "mm", zSubescapular, (z) => {
      if (z < -2) return "Adiposidad troncal baja (< -2 DE)";
      if (z <= 1) return "Pliegue subescapular normal";
      if (z <= 2) return "Riesgo de adiposidad troncal elevada";
      return "Adiposidad troncal elevada (> +2 DE)";
    });

    let zTriceps = null;
    if (!isNaN(meses) && triceps > 0) {
      const lms = this.interpolateLMS(meses, this.WHO_LMS.tricepsForAge[sexKey]);
      zTriceps = this.calcLmsZ(triceps, lms);
    }
    const tricepsEdad = formatIndicator(triceps, "mm", zTriceps, (z) => {
      if (z < -2) return "Adiposidad periférica baja (< -2 DE)";
      if (z <= 1) return "Pliegue tricipital normal";
      if (z <= 2) return "Riesgo de adiposidad periférica elevada";
      return "Adiposidad periférica elevada (> +2 DE)";
    });

    return {
      tallaEdad,
      pesoEdad,
      pesoTalla,
      cefalicaEdad,
      brazoEdad,
      subescapularEdad,
      tricepsEdad
    };
  },

  // Fórmula de Watson para Agua Corporal Total (Adultos)
  calcularWatson(peso, tallaCm, edad, sexo) {
    const p = parseFloat(peso) || 0;
    const h = parseFloat(tallaCm) || 0;
    const a = parseFloat(edad) || 0;
    if (p <= 0 || h <= 0) return { litros: null, pct: null };

    let litros = 0;
    if (sexo === "M") {
      litros = 2.447 - (0.09516 * a) + (0.1074 * h) + (0.3362 * p);
    } else {
      litros = -2.097 + (0.1069 * h) + (0.2466 * p);
    }
    litros = Math.max(0, litros);
    const pct = (litros / p) * 100;
    return { litros, pct };
  },

  siriPctGrasa(densidad) {
    if (!densidad || densidad <= 0) return null;
    return (495 / densidad) - 450;
  },

  calcularAntropometria(data, sexo, edad = 30) {
    const peso = parseFloat(data.peso) || 0;
    const tallaCm = parseFloat(data.talla) || 0;
    const tallaM = tallaCm / 100;
    const muneca = parseFloat(data.muneca) || parseFloat(data.perimetrosExtra?.muneca) || 0;
    const cintura = parseFloat(data.cintura) || parseFloat(data.per_cintura_isak) || 0;
    const cinturaUmbilical = parseFloat(data.cintura_umbilical) || 0;
    const cadera = parseFloat(data.cadera) || parseFloat(data.per_cadera_isak) || 0;
    const brazoRel = parseFloat(data.brazo_rel) || 0;
    const brazoFlex = parseFloat(data.brazo_flex) || 0;
    const pantorrillaPer = parseFloat(data.pantorrilla_per) || 0;

    const p = data.pliegues || {};
    const triceps = parseFloat(p.triceps) || 0;
    const subescapular = parseFloat(p.subescapular) || 0;
    const biceps = parseFloat(p.biceps) || 0;
    const cresta = parseFloat(p.cresta) || 0;
    const supraespinal = parseFloat(p.supraespinal) || 0;
    const abdominal = parseFloat(p.abdominal) || 0;
    const muslo = parseFloat(p.muslo) || 0;
    const pantorrilla = parseFloat(p.pantorrilla) || 0;

    const d = data.diametros || {};
    const humero = parseFloat(d.humero) || 0;
    const femur = parseFloat(d.femur) || 0;

    // 1. IMC
    const imc = tallaM > 0 ? peso / (tallaM * tallaM) : 0;
    let imcDx = "Sin datos";
    if (imc > 0) {
      if (imc < 18.5) imcDx = "Bajo peso";
      else if (imc < 25) imcDx = "Normopeso";
      else if (imc < 30) imcDx = "Sobrepeso";
      else if (imc < 35) imcDx = "Obesidad Grado I";
      else if (imc < 40) imcDx = "Obesidad Grado II";
      else imcDx = "Obesidad Grado III";
    }

    // 2. ICC
    const cinturaRef = cintura > 0 ? cintura : cinturaUmbilical;
    const icc = cadera > 0 && cinturaRef > 0 ? cinturaRef / cadera : 0;
    let iccDx = "Sin datos";
    if (icc > 0) {
      const limite = sexo === "F" ? 0.85 : 0.90;
      iccDx = icc >= limite ? "Riesgo elevado" : "Riesgo normal";
    }

    // 3. ICT
    const ict = tallaCm > 0 && cinturaRef > 0 ? cinturaRef / tallaCm : 0;
    let ictDx = "Sin datos";
    if (ict > 0) {
      ictDx = ict >= 0.5 ? "Riesgo abdominal (>0.50)" : "Saludable (<0.50)";
    }

    // 4. Complexión ósea
    const complexionVal = muneca > 0 && tallaCm > 0 ? tallaCm / muneca : 0;
    let complexionDx = "Sin datos";
    if (complexionVal > 0) {
      if (sexo === "F") {
        complexionDx = complexionVal > 11 ? "Pequeña" : complexionVal >= 10.1 ? "Mediana" : "Grande";
      } else {
        complexionDx = complexionVal > 10.4 ? "Pequeña" : complexionVal >= 9.6 ? "Mediana" : "Grande";
      }
    }

    // 5. Sumatorias ISAK
    const sum6 = triceps + subescapular + supraespinal + abdominal + muslo + pantorrilla;
    const sum8 = sum6 + biceps + cresta;

    // 6. Fórmulas de % Grasa Corporal
    const formulas = {};

    formulas.yuhasz = sum6 > 0
      ? (sexo === "F" ? (0.1548 * sum6) + 3.58 : (0.1051 * sum6) + 2.585)
      : null;

    const sum4Dw = biceps + triceps + subescapular + cresta;
    if (sum4Dw > 0) {
      const logS4 = Math.log10(sum4Dw);
      let dens = null;
      if (sexo === "M") {
        if (edad < 20) dens = 1.1620 - 0.0630 * logS4;
        else if (edad < 30) dens = 1.1631 - 0.0632 * logS4;
        else if (edad < 40) dens = 1.1422 - 0.0544 * logS4;
        else if (edad < 50) dens = 1.1620 - 0.0700 * logS4;
        else dens = 1.1715 - 0.0779 * logS4;
      } else {
        if (edad < 20) dens = 1.1549 - 0.0678 * logS4;
        else if (edad < 30) dens = 1.1599 - 0.0717 * logS4;
        else if (edad < 40) dens = 1.1423 - 0.0632 * logS4;
        else if (edad < 50) dens = 1.1333 - 0.0612 * logS4;
        else dens = 1.1339 - 0.0645 * logS4;
      }
      formulas.durnin = this.siriPctGrasa(dens);
    } else {
      formulas.durnin = null;
    }

    const sum4Faulkner = triceps + subescapular + supraespinal + abdominal;
    formulas.faulkner = sum4Faulkner > 0 ? (sum4Faulkner * 0.153) + 5.783 : null;

    formulas.carter = sum4Faulkner > 0
      ? (sexo === "F" ? (sum4Faulkner * 0.144) + 7.93 : (sum4Faulkner * 0.105) + 7.85)
      : null;

    const sum4Withers = triceps + subescapular + cresta + muslo;
    if (sum4Withers > 0) {
      const densW = sexo === "M"
        ? 1.2106 - 0.0008 * sum4Withers - 0.0005 * edad
        : 1.2010 - 0.0007 * sum4Withers - 0.0006 * edad;
      formulas.withers = this.siriPctGrasa(densW);
    } else {
      formulas.withers = null;
    }

    if (sexo === "M") {
      const s3m = subescapular + abdominal + muslo;
      if (s3m > 0) {
        const densJp3m = 1.10938 - (0.0008267 * s3m) + (0.0000016 * s3m * s3m) - (0.0002574 * edad);
        formulas.jp3 = this.siriPctGrasa(densJp3m);
      } else formulas.jp3 = null;
    } else {
      const s3f = triceps + supraespinal + muslo;
      if (s3f > 0) {
        const densJp3f = 1.0994921 - (0.0009929 * s3f) + (0.0000023 * s3f * s3f) - (0.0001392 * edad);
        formulas.jp3 = this.siriPctGrasa(densJp3f);
      } else formulas.jp3 = null;
    }

    if (sexo === "M") {
      const s2m = subescapular + muslo;
      if (s2m > 0) {
        const densSwm = 1.1043 - (0.001327 * muslo) - (0.001310 * subescapular);
        formulas.sloan = this.siriPctGrasa(densSwm);
      } else formulas.sloan = null;
    } else {
      const s2f = triceps + cresta;
      if (s2f > 0) {
        const densSwf = 1.0764 - (0.00081 * cresta) - (0.00088 * triceps);
        formulas.sloan = this.siriPctGrasa(densSwf);
      } else formulas.sloan = null;
    }

    const validPctValues = Object.values(formulas).filter(v => typeof v === "number" && !isNaN(v) && v > 0);
    const avgPctGrasa = validPctValues.length > 0
      ? validPctValues.reduce((a, b) => a + b, 0) / validPctValues.length
      : 0;

    const masaGrasaKg = peso > 0 && avgPctGrasa > 0 ? (peso * avgPctGrasa) / 100 : 0;
    const mlgKg = peso > 0 && masaGrasaKg > 0 ? Math.max(0, peso - masaGrasaKg) : 0;
    const mlgPct = peso > 0 && mlgKg > 0 ? (mlgKg / peso) * 100 : 0;
    const imlg = tallaM > 0 && mlgKg > 0 ? mlgKg / (tallaM * tallaM) : 0;

    let imlgDx = "kg / m² de MLG";
    if (imlg > 0) {
      if (sexo === "M") {
        imlgDx = imlg < 17 ? "MLG baja" : imlg <= 20 ? "Rango muscular normal" : "Alta masa libre de grasa";
      } else {
        imlgDx = imlg < 14.5 ? "MLG baja" : imlg <= 17.5 ? "Rango muscular normal" : "Alta masa libre de grasa";
      }
    }

    const aguaBiaPct = parseFloat(data.bia?.agua) || 0;
    let pctAguaEstimado = 0;
    let actLitros = 0;
    let actFuente = "Sin datos";

    if (mlgKg > 0) {
      actLitros = mlgKg * 0.732;
      pctAguaEstimado = peso > 0 ? (actLitros / peso) * 100 : 0;
      actFuente = "Estimado (73.2% de MLG)";
    } else if (aguaBiaPct > 0 && peso > 0) {
      pctAguaEstimado = aguaBiaPct;
      actLitros = (peso * aguaBiaPct) / 100;
      actFuente = "Desde BIA";
    } else if (avgPctGrasa > 0 && peso > 0) {
      pctAguaEstimado = Math.max(0, (100 - avgPctGrasa) * 0.732);
      actLitros = (peso * pctAguaEstimado) / 100;
      actFuente = "Estimado desde % grasa";
    }

    let actDx = "Referencia: 50-65%";
    if (pctAguaEstimado > 0) {
      if (pctAguaEstimado < 48) actDx = "Por debajo del rango típico";
      else if (pctAguaEstimado > 65) actDx = "Hidratación / MLG elevada";
      else actDx = "Dentro de rango habitual";
    }

    const watson = this.calcularWatson(peso, tallaCm, edad, sexo);
    const watsonLitrosFormatted = watson.litros !== null ? watson.litros.toFixed(1) + " L" : "—";
    const watsonPctFormatted = watson.pct !== null ? `% ACT Watson: ${watson.pct.toFixed(1)}%` : "% ACT Watson: —";

    const cmb = brazoRel > 0 ? brazoRel - (Math.PI * (triceps / 10)) : 0;

    // Somatotipo Heath-Carter
    const sum3Endo = triceps + subescapular + supraespinal;
    let endomorfia = null;
    if (sum3Endo > 0 && tallaCm > 0) {
      const xEndo = sum3Endo * (170.18 / tallaCm);
      endomorfia = (-0.7182) + (0.0435 * xEndo) - (0.000102 * xEndo * xEndo) + (0.0000008 * Math.pow(xEndo, 3));
      endomorfia = Math.max(0.5, endomorfia);
    }

    let mesomorfia = null;
    if (humero > 0 && femur > 0 && brazoFlex > 0 && pantorrillaPer > 0 && tallaCm > 0) {
      const brazoCorr = brazoFlex - (triceps / 10);
      const pantCorr = pantorrillaPer - (pantorrilla / 10);
      mesomorfia = (0.858 * humero) + (0.601 * femur) + (0.188 * brazoCorr) + (0.161 * pantCorr) - (0.131 * tallaCm) + 4.5;
      mesomorfia = Math.max(0.5, mesomorfia);
    }

    let ectomorfia = null;
    if (peso > 0 && tallaCm > 0) {
      const hwr = tallaCm / Math.cbrt(peso);
      if (hwr >= 40.75) ectomorfia = (0.732 * hwr) - 28.58;
      else if (hwr > 38.25) ectomorfia = (0.463 * hwr) - 17.63;
      else ectomorfia = 0.1;
      ectomorfia = Math.max(0.1, ectomorfia);
    }

    let somClasif = "Incompleto";
    let somCoords = "Completa pliegues, diámetros y perímetros";
    if (endomorfia !== null && mesomorfia !== null && ectomorfia !== null) {
      const e = endomorfia, m = mesomorfia, ec = ectomorfia;
      somCoords = `(${e.toFixed(1)} - ${m.toFixed(1)} - ${ec.toFixed(1)})`;

      if (Math.abs(e - m) <= 1 && Math.abs(e - ec) <= 1 && Math.abs(m - ec) <= 1) {
        somClasif = "Central";
      } else if (e > m + 0.5 && e > ec + 0.5) {
        somClasif = "Endomorfo";
      } else if (m > e + 0.5 && m > ec + 0.5) {
        somClasif = "Mesomorfo";
      } else if (ec > e + 0.5 && ec > m + 0.5) {
        somClasif = "Ectomorfo";
      } else if (e > ec && m > ec) {
        somClasif = "Endo-Mesomorfo";
      } else if (m > e && ec > e) {
        somClasif = "Meso-Ectomorfo";
      } else {
        somClasif = "Balanceado / Mixto";
      }
    }

    const fmtPct = (val) => (typeof val === "number" && !isNaN(val) ? val.toFixed(1) + "%" : "—");
    const pediatricoOMS = this.calcularPediatricoOMS(data, sexo);

    return {
      imc: imc ? imc.toFixed(1) : "—",
      imcDx,
      icc: icc ? icc.toFixed(2) : "—",
      iccDx,
      ict: ict ? ict.toFixed(2) : "—",
      ictDx,
      complexionVal: complexionVal ? complexionVal.toFixed(1) : "—",
      complexionDx,
      sum6: sum6 ? sum6.toFixed(1) + " mm" : "—",
      sum8: sum8 ? sum8.toFixed(1) + " mm" : "—",
      formulasFormatted: {
        yuhasz: fmtPct(formulas.yuhasz),
        durnin: fmtPct(formulas.durnin),
        faulkner: fmtPct(formulas.faulkner),
        carter: fmtPct(formulas.carter),
        withers: fmtPct(formulas.withers),
        jp3: fmtPct(formulas.jp3),
        sloan: fmtPct(formulas.sloan)
      },
      avgPctGrasaFormatted: avgPctGrasa > 0 ? avgPctGrasa.toFixed(1) + "%" : "—",
      masaGrasaKgFormatted: masaGrasaKg > 0 ? masaGrasaKg.toFixed(1) + " kg" : "—",
      mlgKgFormatted: mlgKg > 0 ? mlgKg.toFixed(1) + " kg" : "—",
      mlgPctFormatted: mlgPct > 0 ? `% MLG: ${mlgPct.toFixed(1)}%` : "% MLG: —",
      imlgFormatted: imlg > 0 ? imlg.toFixed(1) : "—",
      imlgDx,
      actLitrosFormatted: actLitros > 0 ? actLitros.toFixed(1) + " L" : "—",
      actFuente,
      actPctFormatted: pctAguaEstimado > 0 ? pctAguaEstimado.toFixed(1) + "%" : "—",
      actDx,
      watsonLitrosFormatted,
      watsonPctFormatted,
      masasTexto: masaGrasaKg > 0 ? `MG: ${masaGrasaKg.toFixed(1)} kg | MLG: ${mlgKg.toFixed(1)} kg` : "—",
      cmb: cmb > 0 ? cmb.toFixed(1) + " cm" : "—",
      somatotipo: {
        endo: endomorfia !== null ? endomorfia.toFixed(1) : "—",
        meso: mesomorfia !== null ? mesomorfia.toFixed(1) : "—",
        ecto: ectomorfia !== null ? ectomorfia.toFixed(1) : "—",
        clasif: somClasif,
        coords: somCoords
      },
      pediatricoOMS
    };
  },

  calcularBioquimica(glucosa, insulina, colesterol, hdl) {
    const g = parseFloat(glucosa) || 0;
    const ins = parseFloat(insulina) || 0;
    const col = parseFloat(colesterol) || 0;
    const h = parseFloat(hdl) || 0;

    const homa = g > 0 && ins > 0 ? (g * ins) / 405 : 0;
    let homaDx = "";
    if (homa > 0) {
      homaDx = homa >= 2.5 ? "(Resistencia a insulina probable)" : "(Sensibilidad normal)";
    }

    const atero = col > 0 && h > 0 ? col / h : 0;
    let ateroDx = "";
    if (atero > 0) {
      ateroDx = atero > 4.5 ? "(Riesgo cardiovascular elevado)" : "(Riesgo controlado)";
    }

    return {
      homa: homa ? homa.toFixed(2) : "—",
      homaDx,
      atero: atero ? atero.toFixed(2) : "—",
      ateroDx
    };
  },

  calcularSueno(horaDormir, horaDespertar) {
    if (!horaDormir || !horaDespertar) return { horas: "—", dx: "Sin horario" };
    const [h1, m1] = horaDormir.split(":").map(Number);
    const [h2, m2] = horaDespertar.split(":").map(Number);

    let minDormir = h1 * 60 + m1;
    let minDespertar = h2 * 60 + m2;
    if (minDespertar <= minDormir) minDespertar += 24 * 60;

    const totalHoras = (minDespertar - minDormir) / 60;
    let dx = "Rango óptimo (7-9 hrs)";
    if (totalHoras < 7) dx = "Déficit de sueño (<7 hrs)";
    else if (totalHoras > 9.5) dx = "Sueño prolongado (>9.5 hrs)";

    return {
      horas: totalHoras.toFixed(1) + " hrs",
      dx
    };
  }
};