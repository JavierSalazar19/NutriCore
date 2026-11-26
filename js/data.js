const FOOD_GROUPS = [
  "Verduras y hortalizas",
  "Frutas frescas",
  "Cereales integrales y tubérculos",
  "Cereales refinados / pan dulce",
  "Leguminosas (frijol, lenteja, garbanzo)",
  "Carnes magras / aves / pescado",
  "Carnes rojas / embutidos",
  "Huevo y lácteos",
  "Grasas saludables (aguacate, nueces, oliva)",
  "Bebidas azucaradas / refrescos",
  "Comida rápida / ultraprocesados"
];

const FREQ_OPTIONS = [
  "Diario",
  "4-6 veces/sem",
  "1-3 veces/sem",
  "Ocasional",
  "Nunca"
];

function createEmptyAhfStruct(notas = "") {
  return {
    trigliceridemia: { marcado: false, detalle: "", familiar: "" },
    hipercolesterolemia: { marcado: false, detalle: "", familiar: "" },
    diabetesTipo1: { marcado: false, detalle: "", familiar: "" },
    diabetesTipo2: { marcado: false, detalle: "", familiar: "" },
    hipertensionArterial: { marcado: false, detalle: "", familiar: "" },
    cancer: { marcado: false, detalle: "", familiar: "" },
    enfermedadCardiovascular: { marcado: false, detalle: "", familiar: "" },
    enfermedadAutoinmune: { marcado: false, detalle: "", familiar: "" },
    enfermedadRenal: { marcado: false, detalle: "", familiar: "" },
    enfermedadMental: { marcado: false, detalle: "", familiar: "" },
    enfermedadNeurologica: { marcado: false, detalle: "", familiar: "" },
    enfermedadTiroidea: { marcado: false, detalle: "", familiar: "" },
    otras: { marcado: false, detalle: "", familiar: "" },
    notas
  };
}

let PATIENTS_DB = [
  {
    id: "pac-001",
    nombre: "Ana Sofía Mendoza",
    edad: 29,
    sexo: "F",
    objetivo: "Recomposición corporal y control de inflamación abdominal",
    tutor: null,
    antecedentes: {
      fechaNacimiento: "1997-04-18",
      telefono: "644 210 8834",
      correo: "anasofia.mendoza@ejemplo.com",
      ocupacion: "Diseñadora gráfica / Freelance",
      estadoCivil: "Soltera",
      etnia: "Mestiza",
      religion: "Católica",
      escolaridad: "Licenciatura / Ingeniería",
      seguridadSocial: "IMSS",
      nivelSocioeconomico: "Medio",
      domicilio: "Col. Centro, Ciudad Obregón, Son.",
      contactoEmergencia: "Patricia Mendoza (Madre) - 644 190 4421",
      personales: {
        enfermedadesDiagnosticadas: "Sensibilidad gastrointestinal funcional / distensión abdominal",
        enfermedadesAnteriores: "Gastritis aguda (2022), varicela en infancia",
        pesoFormaCorporal: "Ninguno actualmente; usó té verde/quemador sin cafeína hace 2 años",
        cirugiasPrevias: "Apendicectomía (2013)",
        hospitalizaciones: "Hospitalización breve por apendicectomía (2013)",
        alergiasAlimentarias: "Ninguna diagnosticada",
        intoleranciasAlimentarias: "Lactosa en grandes cantidades",
        tratamientoMedicoActual: "Ningún fármaco prescrito actualmente",
        suplementosActuales: "Vitamina D3 (2000 UI/día), probiótico",
        interaccionFarmacoNutrimento: "Sin interacciones farmacológicas activas"
      },
      patologicosPersonales: "Sin enfermedades crónicas diagnosticadas. Cirugía de apendicectomía a los 16 años.",
      noPatologicosPersonales: "Horario laboral mixto, exposición moderada a pantallas, esquema de vacunación completo.",
      heredofamiliares: "Madre con hipotiroidismo; abuelo materno con DM2; padre aparentemente sano.",
      ahf: {
        ...createEmptyAhfStruct("Madre con hipotiroidismo; abuelo materno con DM2."),
        diabetesTipo2: { marcado: true, detalle: "", familiar: "Abuelo materno" },
        enfermedadTiroidea: { marcado: true, detalle: "Hipotiroidismo", familiar: "Madre" }
      },
      ginecologicos: {
        menarquia: 12,
        regularidad: "Regular (21-35 días)",
        dolor: "Moderado",
        embarazos: 0,
        abortos: 0,
        enfermedades: "Ninguna diagnosticada",
        anticonceptivos: "Ninguno"
      }
    },
    antropometria: {
      isakMode: "restricted",
      pediatrico: {
        habilitado: false,
        edadMeses: null,
        posicion: "estatura",
        cefalica: null,
        brazo: null
      },
      peso: 68.5,
      talla: 163,
      talla_sentado: 86.5,
      envergadura: 165.0,
      muneca: 15.2,
      cintura: 76.0,
      cintura_umbilical: 81.5,
      cadera: 101.5,
      brazo_rel: 28.5,
      brazo_flex: 29.8,
      per_cintura_isak: 76.0,
      per_cadera_isak: 101.5,
      pantorrilla_per: 36.2,
      diametros: {
        biacromial: 36.5,
        biiliocrestideo: 27.8,
        humero: 6.1,
        femur: 8.9,
        torax_trans: 25.4,
        torax_ap: 17.8,
        muneca_estilo: 5.0
      },
      perimetrosExtra: {
        cefalico: 55.2,
        cuello: 32.5,
        torax: 86.0,
        antebrazo: 24.2,
        muneca: 15.2,
        muslo_sup: 59.5,
        muslo_per: 56.0,
        tobillo: 21.5
      },
      longitudesExtra: {
        acromio_radial: 30.2,
        radial_estilo: 23.4,
        mano: 17.1,
        iliospinale: 91.5,
        trocanterion: 82.0,
        trocanter_tibial: 39.0,
        tibial: 38.5,
        tibial_medial: 37.8,
        pie: 23.2
      },
      pliegues: {
        triceps: 18.5,
        subescapular: 15.0,
        biceps: 9.5,
        cresta: 21.0,
        supraespinal: 16.5,
        abdominal: 24.0,
        muslo: 26.5,
        pantorrilla: 14.0,
        antebrazo: 7.5,
        muslo_medial: 25.0
      },
      bia: {
        grasa: 28.4,
        musculo: 24.8,
        agua: 51.2,
        visceral: 6,
        osea: 2.3,
        tmb: 1410,
        extras: [
          { parametro: "Ángulo de fase (50 kHz)", valor: "5.8", unidad: "°" },
          { parametro: "Agua extracelular (ECW)", valor: "38.2", unidad: "%" }
        ]
      }
    },
    bioquimica: {
      fecha: "2026-11-10",
      glucosa: 92,
      insulina: 11.4,
      hba1c: 5.4,
      colesterol: 188,
      ldl: 112,
      hdl: 48,
      trigliceridos: 138,
      hb: 13.4,
      tsh: 2.35,
      vitd: 24.5,
      urico: 4.8,
      creatinina: 0.78
    },
    clinica: {
      sintomasGI: ["Distensión abdominal", "Gases / Flatulencia"],
      signosFisicos: ["Fatiga / astenia crónica"],
      patologias: "Sin patologías crónicas diagnosticadas.",
      heredo: "Madre con hipotiroidismo, abuelo materno con DM2.",
      alergias: "Sensibilidad leve a lácteos enteros",
      medicamentos: [
        { nombre: "Vitamina D3", dosis: "2000 UI en desayuno", nota: "Suplementación reciente" }
      ],
      bristol: "Tipo 5 — Bolas blandas con bordes definidos",
      armstrong: "Grado 0 — Sin edema apreciable",
      armstrongNota: "Sin edema en extremidades"
    },
    dietetica: {
      frecuencia: {
        "Verduras y hortalizas": "4-6 veces/sem",
        "Frutas frescas": "Diario",
        "Cereales integrales y tubérculos": "1-3 veces/sem",
        "Cereales refinados / pan dulce": "4-6 veces/sem",
        "Leguminosas (frijol, lenteja, garbanzo)": "1-3 veces/sem",
        "Carnes magras / aves / pescado": "4-6 veces/sem",
        "Carnes rojas / embutidos": "1-3 veces/sem",
        "Huevo y lácteos": "Diario",
        "Grasas saludables (aguacate, nueces, oliva)": "1-3 veces/sem",
        "Bebidas azucaradas / refrescos": "1-3 veces/sem",
        "Comida rápida / ultraprocesados": "1-3 veces/sem"
      },
      r24h: [
        { tiempo: "Desayuno", hora: "08:30", alimentos: "2 huevos revueltos con jamón, 2 tortillas de maíz, café con leche", cantidad: "1 plato mediano + 1 taza" },
        { tiempo: "Comida", hora: "14:30", alimentos: "Pechuga asada, arroz blanco, frijoles de la olla, agua de sabor", cantidad: "150g pollo, 1 taza arroz, 1 vaso" },
        { tiempo: "Cena", hora: "21:00", alimentos: "Quesadillas de tortilla de harina con queso manchego", cantidad: "2 piezas" }
      ]
    },
    estiloVida: {
      dormir: "23:45",
      despertar: "06:45",
      calidadSueno: 6,
      faf: "1.375",
      ejercicioTipo: "Entrenamiento funcional / fuerza ligera",
      ejercicioDias: 3,
      ejercicioMin: 50,
      aguaLitros: 1.5,
      alcohol: "Ocasional social",
      tabaco: "No",
      cafeina: "2 tazas de café por la mañana"
    }
  },
  {
    id: "pac-002",
    nombre: "Carlos Eduardo Ruiz",
    edad: 38,
    sexo: "M",
    objetivo: "Reducción de grasa visceral y control de triglicéridos / glucosa",
    tutor: null,
    antecedentes: {
      fechaNacimiento: "1988-08-25",
      telefono: "644 455 9012",
      correo: "carlos.ruiz@ejemplo.com",
      ocupacion: "Supervisor de logística",
      estadoCivil: "Casado",
      etnia: "Mestiza",
      religion: "Católica",
      escolaridad: "Preparatoria / Bachillerato",
      seguridadSocial: "IMSS",
      nivelSocioeconomico: "Medio",
      domicilio: "Fracc. Las Fuentes, Ciudad Obregón, Son.",
      contactoEmergencia: "Valeria Ruiz (Esposa) - 644 455 9099",
      personales: {
        enfermedadesDiagnosticadas: "Prediabetes y dislipidemia mixta",
        enfermedadesAnteriores: "Sin enfermedades graves previas",
        pesoFormaCorporal: "Ninguno",
        cirugiasPrevias: "Ninguna",
        hospitalizaciones: "Ninguna",
        alergiasAlimentarias: "Ninguna conocida",
        intoleranciasAlimentarias: "Refiere malestar con comidas muy grasosas de noche",
        tratamientoMedicoActual: "Metformina 850 mg con la cena",
        suplementosActuales: "Ninguno",
        interaccionFarmacoNutrimento: "Metformina: vigilar niveles/absorción de Vitamina B12 y tomar con alimentos"
      },
      patologicosPersonales: "Prediabetes y dislipidemia mixta de reciente diagnóstico.",
      noPatologicosPersonales: "Jornada extensa con comidas frecuentes fuera de casa.",
      heredofamiliares: "Padre con DM2 e hipertensión arterial; madre con dislipidemia.",
      ahf: {
        ...createEmptyAhfStruct("Padre con DM2 e hipertensión arterial; madre con hipercolesterolemia."),
        hipercolesterolemia: { marcado: true, detalle: "", familiar: "Madre" },
        diabetesTipo2: { marcado: true, detalle: "", familiar: "Padre" },
        hipertensionArterial: { marcado: true, detalle: "", familiar: "Padre" }
      },
      ginecologicos: {
        menarquia: null,
        regularidad: "",
        dolor: "",
        embarazos: null,
        abortos: null,
        enfermedades: "",
        anticonceptivos: ""
      }
    },
    antropometria: {
      isakMode: "restricted",
      pediatrico: {
        habilitado: false,
        edadMeses: null,
        posicion: "estatura",
        cefalica: null,
        brazo: null
      },
      peso: 94.2,
      talla: 176,
      talla_sentado: 92.0,
      envergadura: 180.0,
      muneca: 17.8,
      cintura: 103.0,
      cintura_umbilical: 106.5,
      cadera: 105.0,
      brazo_rel: 34.5,
      brazo_flex: 36.0,
      per_cintura_isak: 103.0,
      per_cadera_isak: 105.0,
      pantorrilla_per: 39.5,
      diametros: {
        biacromial: 41.5,
        biiliocrestideo: 29.5,
        humero: 7.2,
        femur: 9.8,
        torax_trans: 30.2,
        torax_ap: 22.0,
        muneca_estilo: 5.8
      },
      perimetrosExtra: {
        cefalico: 58.0,
        cuello: 41.0,
        torax: 104.0,
        antebrazo: 29.0,
        muneca: 17.8,
        muslo_sup: 62.0,
        muslo_per: 59.0,
        tobillo: 23.5
      },
      longitudesExtra: {
        acromio_radial: 33.0,
        radial_estilo: 25.5,
        mano: 19.0,
        iliospinale: 98.0,
        trocanterion: 88.5,
        trocanter_tibial: 42.0,
        tibial: 41.5,
        tibial_medial: 40.8,
        pie: 26.0
      },
      pliegues: {
        triceps: 16.0,
        subescapular: 26.5,
        biceps: 10.5,
        cresta: 29.0,
        supraespinal: 24.0,
        abdominal: 34.5,
        muslo: 19.0,
        pantorrilla: 13.5,
        antebrazo: 8.0,
        muslo_medial: 18.0
      },
      bia: {
        grasa: 29.8,
        musculo: 36.2,
        agua: 50.1,
        visceral: 14,
        osea: 3.1,
        tmb: 1920,
        extras: [
          { parametro: "Grasa visceral (cm²)", valor: "148", unidad: "cm²" }
        ]
      }
    },
    bioquimica: {
      fecha: "2026-11-14",
      glucosa: 108,
      insulina: 18.2,
      hba1c: 5.9,
      colesterol: 224,
      ldl: 142,
      hdl: 38,
      trigliceridos: 215,
      hb: 15.6,
      tsh: 1.9,
      vitd: 28.0,
      urico: 6.9,
      creatinina: 0.95
    },
    clinica: {
      sintomasGI: ["Reflujo / Pirosis"],
      signosFisicos: ["Acantosis nigricans", "Fatiga / astenia crónica"],
      patologias: "Prediabetes y dislipidemia mixta recién detectada.",
      heredo: "Padre con DM2 e hipertensión arterial.",
      alergias: "Ninguna conocida",
      medicamentos: [
        { nombre: "Metformina", dosis: "850 mg con la cena", nota: "Vigilar absorción de Vitamina B12" }
      ],
      bristol: "Tipo 3 — Forma de salchicha con grietas en superficie",
      armstrong: "Grado 1 — Depresión leve (<2 mm), desaparición rápida",
      armstrongNota: "Leve edema maleolar por bipedestación prolongada"
    },
    dietetica: {
      frecuencia: {
        "Verduras y hortalizas": "1-3 veces/sem",
        "Frutas frescas": "1-3 veces/sem",
        "Cereales integrales y tubérculos": "Ocasional",
        "Cereales refinados / pan dulce": "Diario",
        "Leguminosas (frijol, lenteja, garbanzo)": "1-3 veces/sem",
        "Carnes magras / aves / pescado": "1-3 veces/sem",
        "Carnes rojas / embutidos": "4-6 veces/sem",
        "Huevo y lácteos": "4-6 veces/sem",
        "Grasas saludables (aguacate, nueces, oliva)": "Ocasional",
        "Bebidas azucaradas / refrescos": "Diario",
        "Comida rápida / ultraprocesados": "4-6 veces/sem"
      },
      r24h: [
        { tiempo: "Desayuno", hora: "09:30", alimentos: "Torta de pierna con refresco de cola", cantidad: "1 pieza grande + 600 ml" },
        { tiempo: "Comida", hora: "15:30", alimentos: "Carne asada, tortillas de harina, guacamole, cerveza", cantidad: "250g carne, 4 tortillas, 1 lata" },
        { tiempo: "Cena", hora: "22:00", alimentos: "Pan dulce con café con azúcar", cantidad: "2 piezas + 1 taza" }
      ]
    },
    estiloVida: {
      dormir: "00:30",
      despertar: "06:30",
      calidadSueno: 5,
      faf: "1.2",
      ejercicioTipo: "Sin actividad estructurada",
      ejercicioDias: 0,
      ejercicioMin: 0,
      aguaLitros: 1.0,
      alcohol: "Fines de semana",
      tabaco: "Ocasional",
      cafeina: "3 tazas de café + 1 refresco de cola"
    }
  },
  {
    id: "pac-003",
    nombre: "Mateo Gael Ortega",
    edad: 3,
    sexo: "M",
    objetivo: "Control de crecimiento pediátrico y diversificación alimentaria",
    tutor: {
      nombre: "Fernanda Ortega Robles",
      parentesco: "Madre",
      telefono: "644 312 7780"
    },
    antecedentes: {
      fechaNacimiento: "2023-11-15",
      telefono: "644 312 7780",
      correo: "fernanda.ortega@ejemplo.com",
      ocupacion: "Preescolar / Estancia infantil",
      estadoCivil: "Soltero(a)",
      etnia: "Mestiza",
      religion: "No aplica / Sin registro",
      escolaridad: "Preescolar",
      seguridadSocial: "IMSS",
      nivelSocioeconomico: "Medio",
      domicilio: "Col. Villa California, Ciudad Obregón, Son.",
      contactoEmergencia: "Fernanda Ortega Robles (Madre) - 644 312 7780",
      personales: {
        enfermedadesDiagnosticadas: "Ninguna",
        enfermedadesAnteriores: "Resfriados comunes estacionales sin complicaciones",
        pesoFormaCorporal: "No aplica",
        cirugiasPrevias: "Ninguna",
        hospitalizaciones: "Ninguna",
        alergiasAlimentarias: "Ninguna conocida",
        intoleranciasAlimentarias: "Ninguna conocida",
        tratamientoMedicoActual: "Ninguno",
        suplementosActuales: "Ninguno",
        interaccionFarmacoNutrimento: "No aplica"
      },
      patologicosPersonales: "Nacido a término (39 SDG), peso al nacer 3.25 kg. Sin alergias ni hospitalizaciones.",
      noPatologicosPersonales: "Cartilla de vacunación completa al corriente.",
      heredofamiliares: "Abuelo paterno con hipertensión; padres aparentemente sanos.",
      ahf: {
        ...createEmptyAhfStruct("Abuelo paterno con hipertensión arterial."),
        hipertensionArterial: { marcado: true, detalle: "", familiar: "Abuelo paterno" }
      },
      ginecologicos: {
        menarquia: null,
        regularidad: "",
        dolor: "",
        embarazos: null,
        abortos: null,
        enfermedades: "",
        anticonceptivos: ""
      }
    },
    antropometria: {
      isakMode: "restricted",
      pediatrico: {
        habilitado: true,
        edadMeses: 36,
        posicion: "estatura",
        cefalica: 49.8,
        brazo: 16.4
      },
      peso: 14.6,
      talla: 96.5,
      cintura: 51.0,
      cintura_umbilical: 52.0,
      cadera: 54.0,
      brazo_rel: 16.4,
      pliegues: {
        triceps: 9.2,
        subescapular: 6.4
      },
      bia: { extras: [] },
      diametros: {},
      perimetrosExtra: { cefalico: 49.8 },
      longitudesExtra: {}
    },
    bioquimica: {},
    clinica: {
      sintomasGI: [],
      signosFisicos: [],
      patologias: "Sano, control pediátrico de rutina.",
      heredo: "Abuelo paterno con HTA.",
      alergias: "Ninguna conocida",
      medicamentos: [],
      bristol: "Tipo 4 — Lisa y blanda (patrón ideal)",
      armstrong: "Grado 0 — Sin edema apreciable",
      armstrongNota: "Sin edema"
    },
    dietetica: {
      frecuencia: {
        "Verduras y hortalizas": "4-6 veces/sem",
        "Frutas frescas": "Diario",
        "Cereales integrales y tubérculos": "Diario",
        "Leguminosas (frijol, lenteja, garbanzo)": "4-6 veces/sem",
        "Carnes magras / aves / pescado": "4-6 veces/sem",
        "Huevo y lácteos": "Diario"
      },
      r24h: [
        { tiempo: "Desayuno", hora: "08:00", alimentos: "Avena cocida con leche entera y plátano picado", cantidad: "1 tazón pequeño" },
        { tiempo: "Comida", hora: "13:30", alimentos: "Caldo de pollo con zanahoria, calabacita y 1 tortilla", cantidad: "1 plato infantil" }
      ]
    },
    estiloVida: {
      dormir: "20:30",
      despertar: "07:00",
      calidadSueno: 9,
      faf: "1.55",
      ejercicioTipo: "Juego activo al aire libre",
      ejercicioDias: 7,
      ejercicioMin: 90,
      aguaLitros: 0.9,
      alcohol: "Nulo",
      tabaco: "No",
      cafeina: "Ninguna"
    }
  }
];