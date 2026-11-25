let currentPatientId = PATIENTS_DB[0].id;
let activeIsakMode = "restricted"; // 'restricted' (21) | 'full' (43)

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initIsakSwitch();
  initFreqTableStructure();
  populatePatientSelector();
  loadPatientIntoForm(currentPatientId);
  bindEvents();
});

// 1. Navegación por pestañas (A a F)
function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      tabPanels.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });
}

// 2. Switch Perfil Restringido (21) vs Completo (43) ISAK
function initIsakSwitch() {
  const buttons = document.querySelectorAll(".isak-mode-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      setIsakMode(btn.dataset.isak);
    });
  });
}

function setIsakMode(mode) {
  activeIsakMode = mode === "full" ? "full" : "restricted";
  document.querySelectorAll(".isak-mode-btn").forEach(btn => {
    const isSelected = btn.dataset.isak === activeIsakMode;
    btn.classList.toggle("btn-primary", isSelected);
    btn.classList.toggle("btn-outline", !isSelected);
    btn.classList.toggle("active", isSelected);
  });

  const fullContainer = document.getElementById("isakFullContainer");
  if (activeIsakMode === "full") {
    fullContainer.classList.remove("hidden");
  } else {
    fullContainer.classList.add("hidden");
  }
}

// 3. Generar filas de Frecuencia de Consumo
function initFreqTableStructure() {
  const tbody = document.getElementById("freqTableBody");
  tbody.innerHTML = FOOD_GROUPS.map((group, idx) => `
    <tr>
      <td><strong>${group}</strong></td>
      ${FREQ_OPTIONS.map(opt => `
        <td>
          <input type="radio" name="freq_${idx}" value="${opt}" data-group="${group}" />
        </td>
      `).join("")}
    </tr>
  `).join("");
}

// 4. Selector de Pacientes
function populatePatientSelector() {
  const select = document.getElementById("patientSelect");
  select.innerHTML = PATIENTS_DB.map(p =>
    `<option value="${p.id}">${p.nombre} (${p.edad} años)</option>`
  ).join("");
  select.value = currentPatientId;
}

function updatePatientBanner(p) {
  document.getElementById("pName").textContent = p.nombre;
  let metaText = `${p.sexo === "F" ? "Femenino" : "Masculino"} • ${p.edad} años • Objetivo: ${p.objetivo || "—"}`;
  if (p.tutor && p.tutor.nombre) {
    metaText += ` | Tutor (${p.tutor.parentesco}): ${p.tutor.nombre} (${p.tutor.telefono})`;
  }
  document.getElementById("pMeta").textContent = metaText;
}

function calculateMonthsFromBirthDate(birthDateStr) {
  if (!birthDateStr) return null;
  const birth = new Date(birthDateStr);
  if (isNaN(birth.getTime())) return null;
  const now = new Date();
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) months -= 1;
  return Math.max(0, months);
}

// 5. Cargar datos de un paciente
function loadPatientIntoForm(patientId) {
  const p = PATIENTS_DB.find(item => item.id === patientId);
  if (!p) return;

  updatePatientBanner(p);

  // A. Antecedentes
  const antInfo = p.antecedentes || {};
  setVal("ant_nombre", p.nombre);
  setVal("ant_fecha_nac", antInfo.fechaNacimiento);
  setVal("ant_edad", p.edad);
  setVal("ant_sexo", p.sexo);
  setVal("ant_telefono", antInfo.telefono);
  setVal("ant_correo", antInfo.correo);
  setVal("ant_ocupacion", antInfo.ocupacion);
  setVal("ant_estado_civil", antInfo.estadoCivil);
  setVal("ant_domicilio", antInfo.domicilio);
  setVal("ant_emergencia", antInfo.contactoEmergencia);
  setVal("ant_objetivo", p.objetivo);
  setVal("ant_patologicos", antInfo.patologicosPersonales);
  setVal("ant_no_patologicos", antInfo.noPatologicosPersonales);
  setVal("ant_heredofamiliares", antInfo.heredofamiliares);

  // B. Antropometría (ISAK 21/43 + BIA + Pediátrica OMS)
  const a = p.antropometria || { pliegues: {}, bia: {}, diametros: {}, perimetrosExtra: {}, longitudesExtra: {}, pediatrico: {} };
  setIsakMode(a.isakMode || "restricted");

  // Pediátrico
  const ped = a.pediatrico || {};
  const isPed = typeof ped.habilitado === "boolean" ? ped.habilitado : (p.edad <= 18);
  document.getElementById("ped_habilitado").checked = isPed;
  const mesesAuto = ped.edadMeses ?? calculateMonthsFromBirthDate(antInfo.fechaNacimiento) ?? (p.edad * 12);
  setVal("ped_edad_meses", mesesAuto);
  setVal("ped_posicion", ped.posicion || (mesesAuto < 24 ? "longitud" : "estatura"));
  setVal("ped_cefalica", ped.cefalica ?? a.perimetrosExtra?.cefalico);
  setVal("ped_brazo", ped.brazo ?? a.brazo_rel);

  setVal("ant_peso", a.peso);
  setVal("ant_talla", a.talla);
  setVal("isak_talla_sentado", a.talla_sentado);
  setVal("isak_envergadura", a.envergadura);
  setVal("ant_muneca", a.muneca);
  setVal("ant_cintura", a.cintura);
  setVal("ant_cintura_umbilical", a.cintura_umbilical);
  setVal("ant_cadera", a.cadera);
  setVal("ant_brazo_rel", a.brazo_rel);
  setVal("ant_brazo_flex", a.brazo_flex);
  setVal("per_cintura_isak", a.per_cintura_isak ?? a.cintura);
  setVal("per_cadera_isak", a.per_cadera_isak ?? a.cadera);
  setVal("ant_pantorrilla_per", a.pantorrilla_per);

  // Diámetros
  setVal("d_biacromial", a.diametros?.biacromial);
  setVal("d_biiliocrestideo", a.diametros?.biiliocrestideo);
  setVal("d_humero", a.diametros?.humero);
  setVal("d_femur", a.diametros?.femur);
  setVal("d_torax_trans", a.diametros?.torax_trans);
  setVal("d_torax_ap", a.diametros?.torax_ap);
  setVal("d_muneca_estilo", a.diametros?.muneca_estilo);

  // Perímetros extra
  setVal("per_cefalico", a.perimetrosExtra?.cefalico ?? ped.cefalica);
  setVal("per_cuello", a.perimetrosExtra?.cuello);
  setVal("per_torax", a.perimetrosExtra?.torax);
  setVal("per_antebrazo", a.perimetrosExtra?.antebrazo);
  setVal("per_muneca", a.perimetrosExtra?.muneca ?? a.muneca);
  setVal("per_muslo_sup", a.perimetrosExtra?.muslo_sup);
  setVal("ant_muslo_per", a.perimetrosExtra?.muslo_per ?? a.muslo_per);
  setVal("per_tobillo", a.perimetrosExtra?.tobillo);

  // Longitudes extra
  setVal("lon_acromio_radial", a.longitudesExtra?.acromio_radial);
  setVal("lon_radial_estilo", a.longitudesExtra?.radial_estilo);
  setVal("lon_mano", a.longitudesExtra?.mano);
  setVal("alt_iliospinale", a.longitudesExtra?.iliospinale);
  setVal("alt_trocanterion", a.longitudesExtra?.trocanterion);
  setVal("lon_trocanter_tibial", a.longitudesExtra?.trocanter_tibial);
  setVal("alt_tibial", a.longitudesExtra?.tibial);
  setVal("alt_tibial_medial", a.longitudesExtra?.tibial_medial);
  setVal("lon_pie", a.longitudesExtra?.pie);

  // Pliegues
  setVal("p_triceps", a.pliegues?.triceps);
  setVal("p_subescapular", a.pliegues?.subescapular);
  setVal("p_biceps", a.pliegues?.biceps);
  setVal("p_cresta", a.pliegues?.cresta);
  setVal("p_supraespinal", a.pliegues?.supraespinal);
  setVal("p_abdominal", a.pliegues?.abdominal);
  setVal("p_muslo", a.pliegues?.muslo);
  setVal("p_pantorrilla", a.pliegues?.pantorrilla);
  setVal("p_antebrazo", a.pliegues?.antebrazo);
  setVal("p_muslo_medial", a.pliegues?.muslo_medial);

  // BIA + extras
  setVal("bia_grasa", a.bia?.grasa);
  setVal("bia_musculo", a.bia?.musculo);
  setVal("bia_agua", a.bia?.agua);
  setVal("bia_visceral", a.bia?.visceral);
  setVal("bia_osea", a.bia?.osea);
  setVal("bia_tmb", a.bia?.tmb);
  renderBiaExtraTable(a.bia?.extras || []);

  // C. Bioquímica
  const b = p.bioquimica || {};
  setVal("lab_fecha", b.fecha);
  setVal("lab_glucosa", b.glucosa);
  setVal("lab_insulina", b.insulina);
  setVal("lab_hba1c", b.hba1c);
  setVal("lab_colesterol", b.colesterol);
  setVal("lab_ldl", b.ldl);
  setVal("lab_hdl", b.hdl);
  setVal("lab_trigliceridos", b.trigliceridos);
  setVal("lab_hb", b.hb);
  setVal("lab_tsh", b.tsh);
  setVal("lab_vitd", b.vitd);
  setVal("lab_urico", b.urico);
  setVal("lab_creatinina", b.creatinina);

  // D. Clínica
  const cli = p.clinica || { sintomasGI: [], signosFisicos: [], medicamentos: [] };
  document.querySelectorAll("#giSymptomsList input").forEach(cb => {
    cb.checked = (cli.sintomasGI || []).includes(cb.value);
  });
  document.querySelectorAll("#physicalSignsList input").forEach(cb => {
    cb.checked = (cli.signosFisicos || []).includes(cb.value);
  });
  setVal("cli_patologias", cli.patologias);
  setVal("cli_heredo", cli.heredo);
  setVal("cli_alergias", cli.alergias);
  renderMedsTable(cli.medicamentos || []);

  document.querySelectorAll('input[name="cli_bristol"]').forEach(radio => {
    radio.checked = (radio.value === cli.bristol);
  });
  document.querySelectorAll('input[name="cli_armstrong"]').forEach(radio => {
    radio.checked = (radio.value === cli.armstrong);
  });
  setVal("cli_armstrong_nota", cli.armstrongNota);

  // E. Dietética
  const diet = p.dietetica || { frecuencia: {}, r24h: [] };
  FOOD_GROUPS.forEach((group, idx) => {
    const selectedOpt = diet.frecuencia?.[group];
    const radios = document.querySelectorAll(`input[name="freq_${idx}"]`);
    radios.forEach(r => r.checked = (r.value === selectedOpt));
  });
  renderR24Table(diet.r24h || []);

  // F. Estilos de Vida
  const e = p.estiloVida || {};
  setVal("est_dormir", e.dormir);
  setVal("est_despertar", e.despertar);
  setVal("est_sueno_calidad", e.calidadSueno);
  setVal("est_faf", e.faf || "1.2");
  setVal("est_ejercicio_tipo", e.ejercicioTipo);
  setVal("est_ejercicio_dias", e.ejercicioDias);
  setVal("est_ejercicio_min", e.ejercicioMin);
  setVal("est_agua", e.aguaLitros);
  setVal("est_alcohol", e.alcohol || "Nulo");
  setVal("est_tabaco", e.tabaco || "No");
  setVal("est_cafeina", e.cafeina);

  runAllLiveCalculations();
}

function setVal(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value ?? "";
}

function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}

function getCheckedRadioValue(name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  return checked ? checked.value : null;
}

function toggleGuardianFields() {
  const edad = parseInt(getVal("np_edad"), 10);
  const guardianBox = document.getElementById("guardianSection");
  const tutorNombre = document.getElementById("np_tutor_nombre");
  const tutorParentesco = document.getElementById("np_tutor_parentesco");
  const tutorTelefono = document.getElementById("np_tutor_telefono");

  const isMinor = !isNaN(edad) && edad <= 17 && edad >= 0;

  if (isMinor) {
    guardianBox.classList.remove("hidden");
    tutorNombre.required = true;
    tutorParentesco.required = true;
    tutorTelefono.required = true;
  } else {
    guardianBox.classList.add("hidden");
    tutorNombre.required = false;
    tutorParentesco.required = false;
    tutorTelefono.required = false;
    tutorNombre.value = "";
    tutorParentesco.value = "";
    tutorTelefono.value = "";
  }
}

// 6. Cálculos en tiempo real
function runAllLiveCalculations() {
  const p = PATIENTS_DB.find(item => item.id === currentPatientId);
  const sexoActivo = getVal("ant_sexo") || p.sexo || "F";
  const edadActiva = parseInt(getVal("ant_edad"), 10);
  const edadFinal = !isNaN(edadActiva) ? edadActiva : (p.edad || 30);
  const nombreActivo = getVal("ant_nombre").trim() || p.nombre;
  const objetivoActivo = getVal("ant_objetivo").trim() || p.objetivo;

  updatePatientBanner({
    ...p,
    nombre: nombreActivo,
    edad: edadFinal,
    sexo: sexoActivo,
    objetivo: objetivoActivo
  });

  // Visibilidad del módulo pediátrico
  const pedChecked = document.getElementById("ped_habilitado").checked;
  const pedContent = document.getElementById("pediatricContent");
  if (pedChecked) {
    pedContent.classList.remove("hidden");
  } else {
    pedContent.classList.add("hidden");
  }

  const antData = collectAntropometriaFromUI();
  const res = NutriCalc.calcularAntropometria(antData, sexoActivo, edadFinal);

  // Render Pediátrico OMS
  const oms = res.pediatricoOMS;
  setPedRow("talla_edad", oms.tallaEdad);
  setPedRow("peso_edad", oms.pesoEdad);
  setPedRow("peso_talla", oms.pesoTalla);
  setPedRow("cefalica", oms.cefalicaEdad);
  setPedRow("brazo", oms.brazoEdad);
  setPedRow("subescapular", oms.subescapularEdad);
  setPedRow("triceps", oms.tricepsEdad);

  // Índices básicos
  document.getElementById("res_imc").textContent = res.imc;
  document.getElementById("res_imc_dx").textContent = res.imcDx;
  document.getElementById("res_icc").textContent = res.icc;
  document.getElementById("res_icc_dx").textContent = res.iccDx;
  document.getElementById("res_ict").textContent = res.ict;
  document.getElementById("res_ict_dx").textContent = res.ictDx;
  document.getElementById("res_complexion").textContent = res.complexionVal;
  document.getElementById("res_complexion_dx").textContent = res.complexionDx;

  // Sumatorias, masas, IMLG y Agua Corporal (MLG/BIA + Watson)
  document.getElementById("res_sum6").textContent = res.sum6;
  document.getElementById("res_sum8").textContent = res.sum8;
  document.getElementById("res_masa_grasa").textContent = res.masaGrasaKgFormatted;
  document.getElementById("res_grasa_prom").textContent = `Prom. % grasa: ${res.avgPctGrasaFormatted}`;
  document.getElementById("res_mlg").textContent = res.mlgKgFormatted;
  document.getElementById("res_mlg_pct").textContent = res.mlgPctFormatted;
  document.getElementById("res_imlg").textContent = res.imlgFormatted;
  document.getElementById("res_imlg_dx").textContent = res.imlgDx;
  document.getElementById("res_act_litros").textContent = res.actLitrosFormatted;
  document.getElementById("res_act_fuente").textContent = res.actFuente;
  document.getElementById("res_act_pct").textContent = res.actPctFormatted;
  document.getElementById("res_act_dx").textContent = res.actDx;
  document.getElementById("res_watson_litros").textContent = res.watsonLitrosFormatted;
  document.getElementById("res_watson_pct").textContent = res.watsonPctFormatted;
  document.getElementById("res_cmb").textContent = res.cmb;

  // Fórmulas individuales
  document.getElementById("f_yuhasz").textContent = res.formulasFormatted.yuhasz;
  document.getElementById("f_durnin").textContent = res.formulasFormatted.durnin;
  document.getElementById("f_faulkner").textContent = res.formulasFormatted.faulkner;
  document.getElementById("f_carter").textContent = res.formulasFormatted.carter;
  document.getElementById("f_withers").textContent = res.formulasFormatted.withers;
  document.getElementById("f_jp3").textContent = res.formulasFormatted.jp3;
  document.getElementById("f_sloan").textContent = res.formulasFormatted.sloan;
  document.getElementById("f_promedio_dup").textContent = res.avgPctGrasaFormatted;

  // Somatotipo
  document.getElementById("som_endo").textContent = res.somatotipo.endo;
  document.getElementById("som_meso").textContent = res.somatotipo.meso;
  document.getElementById("som_ecto").textContent = res.somatotipo.ecto;
  document.getElementById("som_clasif").textContent = res.somatotipo.clasif;
  document.getElementById("som_coords").textContent = res.somatotipo.coords;

  // Banner KPIs
  document.getElementById("topImc").textContent = `${res.imc} (${res.imcDx})`;
  document.getElementById("topGrasa").textContent = res.avgPctGrasaFormatted;
  document.getElementById("topSomato").textContent = res.somatotipo.clasif;

  // Bioquímica
  document.querySelectorAll(".lab-input").forEach(updateLabBadge);
  const bioRes = NutriCalc.calcularBioquimica(
    getVal("lab_glucosa"),
    getVal("lab_insulina"),
    getVal("lab_colesterol"),
    getVal("lab_hdl")
  );
  document.getElementById("res_homa").textContent = bioRes.homa;
  document.getElementById("res_homa_dx").textContent = bioRes.homaDx;
  document.getElementById("res_atero").textContent = bioRes.atero;
  document.getElementById("res_atero_dx").textContent = bioRes.ateroDx;

  // Sueño
  const suenoRes = NutriCalc.calcularSueno(getVal("est_dormir"), getVal("est_despertar"));
  document.getElementById("res_sueno_horas").textContent = suenoRes.horas;
  document.getElementById("res_sueno_dx").textContent = suenoRes.dx;
}

function setPedRow(key, obj) {
  document.getElementById(`ped_val_${key}`).textContent = obj.valTxt;
  document.getElementById(`ped_z_${key}`).textContent = obj.zTxt;
  document.getElementById(`ped_p_${key}`).textContent = obj.pctTxt;
  document.getElementById(`ped_dx_${key}`).textContent = obj.dx;
}

function updateLabBadge(input) {
  const tag = document.getElementById(`tag_${input.id}`);
  if (!tag) return;
  const val = parseFloat(input.value);
  const min = parseFloat(input.dataset.min);
  const max = parseFloat(input.dataset.max);

  tag.className = "status-tag";
  if (isNaN(val)) {
    tag.textContent = "Sin dato";
  } else if (val < min) {
    tag.textContent = `Bajo (<${min})`;
    tag.classList.add("status-low");
  } else if (val > max) {
    tag.textContent = `Elevado (>${max})`;
    tag.classList.add("status-high");
  } else {
    tag.textContent = "En rango óptimo";
    tag.classList.add("status-ok");
  }
}

// 7. Tablas dinámicas (BIA Extra, Fármacos y R24H)
function renderBiaExtraTable(extras = []) {
  const tbody = document.getElementById("biaExtraTableBody");
  tbody.innerHTML = extras.map(item => `
    <tr>
      <td><input type="text" class="bia-ex-param" value="${item.parametro || ""}" placeholder="Ej. Ángulo de fase" /></td>
      <td><input type="text" class="bia-ex-val" value="${item.valor || ""}" placeholder="Ej. 6.2" /></td>
      <td><input type="text" class="bia-ex-unit" value="${item.unidad || ""}" placeholder="Ej. ° / kg / %" /></td>
      <td><button type="button" class="btn-danger-icon" onclick="this.closest('tr').remove()">&times;</button></td>
    </tr>
  `).join("");
}

function renderMedsTable(meds = []) {
  const tbody = document.getElementById("medsTableBody");
  tbody.innerHTML = meds.map(m => `
    <tr>
      <td><input type="text" class="med-nombre" value="${m.nombre}" placeholder="Fármaco / Suplemento" /></td>
      <td><input type="text" class="med-dosis" value="${m.dosis}" placeholder="Dosis / Horario" /></td>
      <td><input type="text" class="med-nota" value="${m.nota}" placeholder="Nota clínica" /></td>
      <td><button type="button" class="btn-danger-icon" onclick="this.closest('tr').remove()">&times;</button></td>
    </tr>
  `).join("");
}

function renderR24Table(rows = []) {
  const tbody = document.getElementById("r24TableBody");
  tbody.innerHTML = rows.map(r => `
    <tr>
      <td><input type="text" class="r24-tiempo" value="${r.tiempo}" placeholder="Ej. Colación" /></td>
      <td><input type="time" class="r24-hora" value="${r.hora}" /></td>
      <td><input type="text" class="r24-alimentos" value="${r.alimentos}" placeholder="Descripción de alimentos" /></td>
      <td><input type="text" class="r24-cantidad" value="${r.cantidad}" placeholder="Porciones" /></td>
      <td><button type="button" class="btn-danger-icon" onclick="this.closest('tr').remove()">&times;</button></td>
    </tr>
  `).join("");
}

// 8. Recolectar Antropometría (21/43 ISAK + BIA + Pediátrica OMS)
function collectAntropometriaFromUI() {
  const biaExtras = Array.from(document.querySelectorAll("#biaExtraTableBody tr")).map(tr => ({
    parametro: tr.querySelector(".bia-ex-param").value.trim(),
    valor: tr.querySelector(".bia-ex-val").value.trim(),
    unidad: tr.querySelector(".bia-ex-unit").value.trim()
  })).filter(x => x.parametro || x.valor);

  return {
    isakMode: activeIsakMode,
    pediatrico: {
      habilitado: document.getElementById("ped_habilitado").checked,
      edadMeses: parseFloat(getVal("ped_edad_meses")) ?? null,
      posicion: getVal("ped_posicion"),
      cefalica: parseFloat(getVal("ped_cefalica")) || null,
      brazo: parseFloat(getVal("ped_brazo")) || null
    },
    peso: parseFloat(getVal("ant_peso")) || null,
    talla: parseFloat(getVal("ant_talla")) || null,
    talla_sentado: parseFloat(getVal("isak_talla_sentado")) || null,
    envergadura: parseFloat(getVal("isak_envergadura")) || null,
    muneca: parseFloat(getVal("ant_muneca")) || parseFloat(getVal("per_muneca")) || null,
    cintura: parseFloat(getVal("ant_cintura")) || parseFloat(getVal("per_cintura_isak")) || null,
    cintura_umbilical: parseFloat(getVal("ant_cintura_umbilical")) || null,
    cadera: parseFloat(getVal("ant_cadera")) || parseFloat(getVal("per_cadera_isak")) || null,
    brazo_rel: parseFloat(getVal("ant_brazo_rel")) || parseFloat(getVal("ped_brazo")) || null,
    brazo_flex: parseFloat(getVal("ant_brazo_flex")) || null,
    per_cintura_isak: parseFloat(getVal("per_cintura_isak")) || null,
    per_cadera_isak: parseFloat(getVal("per_cadera_isak")) || null,
    pantorrilla_per: parseFloat(getVal("ant_pantorrilla_per")) || null,
    diametros: {
      biacromial: parseFloat(getVal("d_biacromial")) || null,
      biiliocrestideo: parseFloat(getVal("d_biiliocrestideo")) || null,
      humero: parseFloat(getVal("d_humero")) || null,
      femur: parseFloat(getVal("d_femur")) || null,
      torax_trans: parseFloat(getVal("d_torax_trans")) || null,
      torax_ap: parseFloat(getVal("d_torax_ap")) || null,
      muneca_estilo: parseFloat(getVal("d_muneca_estilo")) || null
    },
    perimetrosExtra: {
      cefalico: parseFloat(getVal("per_cefalico")) || parseFloat(getVal("ped_cefalica")) || null,
      cuello: parseFloat(getVal("per_cuello")) || null,
      torax: parseFloat(getVal("per_torax")) || null,
      antebrazo: parseFloat(getVal("per_antebrazo")) || null,
      muneca: parseFloat(getVal("per_muneca")) || null,
      muslo_sup: parseFloat(getVal("per_muslo_sup")) || null,
      muslo_per: parseFloat(getVal("ant_muslo_per")) || null,
      tobillo: parseFloat(getVal("per_tobillo")) || null
    },
    longitudesExtra: {
      acromio_radial: parseFloat(getVal("lon_acromio_radial")) || null,
      radial_estilo: parseFloat(getVal("lon_radial_estilo")) || null,
      mano: parseFloat(getVal("lon_mano")) || null,
      iliospinale: parseFloat(getVal("alt_iliospinale")) || null,
      trocanterion: parseFloat(getVal("alt_trocanterion")) || null,
      trocanter_tibial: parseFloat(getVal("lon_trocanter_tibial")) || null,
      tibial: parseFloat(getVal("alt_tibial")) || null,
      tibial_medial: parseFloat(getVal("alt_tibial_medial")) || null,
      pie: parseFloat(getVal("lon_pie")) || null
    },
    pliegues: {
      triceps: parseFloat(getVal("p_triceps")) || null,
      subescapular: parseFloat(getVal("p_subescapular")) || null,
      biceps: parseFloat(getVal("p_biceps")) || null,
      cresta: parseFloat(getVal("p_cresta")) || null,
      supraespinal: parseFloat(getVal("p_supraespinal")) || null,
      abdominal: parseFloat(getVal("p_abdominal")) || null,
      muslo: parseFloat(getVal("p_muslo")) || null,
      pantorrilla: parseFloat(getVal("p_pantorrilla")) || null,
      antebrazo: parseFloat(getVal("p_antebrazo")) || null,
      muslo_medial: parseFloat(getVal("p_muslo_medial")) || null
    },
    bia: {
      grasa: parseFloat(getVal("bia_grasa")) || null,
      musculo: parseFloat(getVal("bia_musculo")) || null,
      agua: parseFloat(getVal("bia_agua")) || null,
      visceral: parseFloat(getVal("bia_visceral")) || null,
      osea: parseFloat(getVal("bia_osea")) || null,
      tmb: parseFloat(getVal("bia_tmb")) || null,
      extras: biaExtras
    }
  };
}

function buildFullEvaluationPayload() {
  const p = PATIENTS_DB.find(item => item.id === currentPatientId);
  const nombre = getVal("ant_nombre").trim() || p.nombre;
  const edad = parseInt(getVal("ant_edad"), 10);
  const edadFinal = !isNaN(edad) ? edad : p.edad;
  const sexo = getVal("ant_sexo") || p.sexo;
  const objetivo = getVal("ant_objetivo").trim() || p.objetivo;

  const antecedentes = {
    fechaNacimiento: getVal("ant_fecha_nac"),
    telefono: getVal("ant_telefono").trim(),
    correo: getVal("ant_correo").trim(),
    ocupacion: getVal("ant_ocupacion").trim(),
    estadoCivil: getVal("ant_estado_civil"),
    domicilio: getVal("ant_domicilio").trim(),
    contactoEmergencia: getVal("ant_emergencia").trim(),
    patologicosPersonales: getVal("ant_patologicos").trim(),
    noPatologicosPersonales: getVal("ant_no_patologicos").trim(),
    heredofamiliares: getVal("ant_heredofamiliares").trim()
  };

  const ant = collectAntropometriaFromUI();
  const calcAnt = NutriCalc.calcularAntropometria(ant, sexo, edadFinal);

  const frecuencia = {};
  FOOD_GROUPS.forEach((group, idx) => {
    const checked = document.querySelector(`input[name="freq_${idx}"]:checked`);
    frecuencia[group] = checked ? checked.value : null;
  });

  const medicamentos = Array.from(document.querySelectorAll("#medsTableBody tr")).map(tr => ({
    nombre: tr.querySelector(".med-nombre").value,
    dosis: tr.querySelector(".med-dosis").value,
    nota: tr.querySelector(".med-nota").value
  }));

  const r24h = Array.from(document.querySelectorAll("#r24TableBody tr")).map(tr => ({
    tiempo: tr.querySelector(".r24-tiempo").value,
    hora: tr.querySelector(".r24-hora").value,
    alimentos: tr.querySelector(".r24-alimentos").value,
    cantidad: tr.querySelector(".r24-cantidad").value
  }));

  return {
    paciente_id: p.id,
    paciente_nombre: nombre,
    edad: edadFinal,
    sexo,
    objetivo,
    tutor: p.tutor || null,
    antecedentes,
    fecha_consulta: new Date().toISOString(),
    antropometria: ant,
    indices_calculados: calcAnt,
    bioquimica: {
      fecha: getVal("lab_fecha"),
      glucosa: parseFloat(getVal("lab_glucosa")) || null,
      insulina: parseFloat(getVal("lab_insulina")) || null,
      hba1c: parseFloat(getVal("lab_hba1c")) || null,
      colesterol: parseFloat(getVal("lab_colesterol")) || null,
      ldl: parseFloat(getVal("lab_ldl")) || null,
      hdl: parseFloat(getVal("lab_hdl")) || null,
      trigliceridos: parseFloat(getVal("lab_trigliceridos")) || null,
      hb: parseFloat(getVal("lab_hb")) || null,
      tsh: parseFloat(getVal("lab_tsh")) || null,
      vitd: parseFloat(getVal("lab_vitd")) || null,
      urico: parseFloat(getVal("lab_urico")) || null,
      creatinina: parseFloat(getVal("lab_creatinina")) || null
    },
    clinica: {
      sintomasGI: Array.from(document.querySelectorAll("#giSymptomsList input:checked")).map(i => i.value),
      signosFisicos: Array.from(document.querySelectorAll("#physicalSignsList input:checked")).map(i => i.value),
      patologias: getVal("cli_patologias"),
      heredo: getVal("cli_heredo"),
      alergias: getVal("cli_alergias"),
      medicamentos,
      bristol: getCheckedRadioValue("cli_bristol"),
      armstrong: getCheckedRadioValue("cli_armstrong"),
      armstrongNota: getVal("cli_armstrong_nota").trim()
    },
    dietetica: { frecuencia, r24h },
    estiloVida: {
      dormir: getVal("est_dormir"),
      despertar: getVal("est_despertar"),
      calidadSueno: parseInt(getVal("est_sueno_calidad")) || null,
      faf: getVal("est_faf"),
      ejercicioTipo: getVal("est_ejercicio_tipo"),
      ejercicioDias: parseInt(getVal("est_ejercicio_dias")) || 0,
      ejercicioMin: parseInt(getVal("est_ejercicio_min")) || 0,
      aguaLitros: parseFloat(getVal("est_agua")) || null,
      alcohol: getVal("est_alcohol"),
      tabaco: getVal("est_tabaco"),
      cafeina: getVal("est_cafeina")
    }
  };
}

// 9. Eventos
function bindEvents() {
  document.getElementById("patientSelect").addEventListener("change", (e) => {
    currentPatientId = e.target.value;
    loadPatientIntoForm(currentPatientId);
  });

  document.getElementById("ant_fecha_nac").addEventListener("change", () => {
    const meses = calculateMonthsFromBirthDate(getVal("ant_fecha_nac"));
    if (meses !== null) {
      setVal("ped_edad_meses", meses);
      setVal("ant_edad", Math.floor(meses / 12));
      document.getElementById("ped_habilitado").checked = meses <= 228;
    }
    runAllLiveCalculations();
  });

  document.querySelectorAll(".calc-trigger, .lab-input, .sleep-trigger").forEach(el => {
    el.addEventListener("input", runAllLiveCalculations);
    el.addEventListener("change", runAllLiveCalculations);
  });

  document.getElementById("np_edad").addEventListener("input", toggleGuardianFields);
  document.getElementById("np_edad").addEventListener("change", toggleGuardianFields);

  document.getElementById("btnAddBiaExtra").addEventListener("click", () => {
    document.getElementById("biaExtraTableBody").insertAdjacentHTML("beforeend", `
      <tr>
        <td><input type="text" class="bia-ex-param" placeholder="Ej. Ángulo de fase" /></td>
        <td><input type="text" class="bia-ex-val" placeholder="Ej. 6.2" /></td>
        <td><input type="text" class="bia-ex-unit" placeholder="Ej. ° / kg / %" /></td>
        <td><button type="button" class="btn-danger-icon" onclick="this.closest('tr').remove()">&times;</button></td>
      </tr>
    `);
  });

  document.getElementById("btnAddMed").addEventListener("click", () => {
    document.getElementById("medsTableBody").insertAdjacentHTML("beforeend", `
      <tr>
        <td><input type="text" class="med-nombre" placeholder="Fármaco / Suplemento" /></td>
        <td><input type="text" class="med-dosis" placeholder="Dosis / Horario" /></td>
        <td><input type="text" class="med-nota" placeholder="Nota clínica" /></td>
        <td><button type="button" class="btn-danger-icon" onclick="this.closest('tr').remove()">&times;</button></td>
      </tr>
    `);
  });

  document.getElementById("btnAddR24").addEventListener("click", () => {
    document.getElementById("r24TableBody").insertAdjacentHTML("beforeend", `
      <tr>
        <td><input type="text" class="r24-tiempo" placeholder="Ej. Colación" /></td>
        <td><input type="time" class="r24-hora" /></td>
        <td><input type="text" class="r24-alimentos" placeholder="Alimentos y preparación" /></td>
        <td><input type="text" class="r24-cantidad" placeholder="Porciones" /></td>
        <td><button type="button" class="btn-danger-icon" onclick="this.closest('tr').remove()">&times;</button></td>
      </tr>
    `);
  });

  document.getElementById("btnGenerateReport").addEventListener("click", () => {
    const payload = buildFullEvaluationPayload();
    const tutorLine = payload.tutor
      ? `<br/><strong>Tutor responsable:</strong> ${payload.tutor.nombre} (${payload.tutor.parentesco}) — Tel: ${payload.tutor.telefono}`
      : "";

    const armstrongTexto = payload.clinica.armstrong
      ? `${payload.clinica.armstrong}${payload.clinica.armstrongNota ? ` (${payload.clinica.armstrongNota})` : ""}`
      : "No evaluada";

    const idxAnt = payload.indices_calculados;
    const som = idxAnt.somatotipo;
    const oms = idxAnt.pediatricoOMS;

    const pedBlock = payload.antropometria.pediatrico.habilitado ? `
      <div class="report-block">
        <strong>Estándares OMS Pediátricos (${payload.antropometria.pediatrico.edadMeses ?? "—"} meses):</strong><br/>
        • Talla/Edad: ${oms.tallaEdad.zTxt} (${oms.tallaEdad.pctTxt}) — ${oms.tallaEdad.dx}<br/>
        • Peso/Edad: ${oms.pesoEdad.zTxt} (${oms.pesoEdad.pctTxt}) — ${oms.pesoEdad.dx}<br/>
        • Peso/Longitud-Estatura: ${oms.pesoTalla.zTxt} (${oms.pesoTalla.pctTxt}) — ${oms.pesoTalla.dx}<br/>
        • Perímetro Cefálico/Edad: ${oms.cefalicaEdad.zTxt} (${oms.cefalicaEdad.pctTxt}) | Brazo MUAC/Edad: ${oms.brazoEdad.zTxt} (${oms.brazoEdad.pctTxt})<br/>
        • Pliegue Subescapular/Edad: ${oms.subescapularEdad.zTxt} (${oms.subescapularEdad.pctTxt}) | Pliegue Tríceps/Edad: ${oms.tricepsEdad.zTxt} (${oms.tricepsEdad.pctTxt})
      </div>
    ` : "";

    const summaryHTML = `
      <div class="report-block">
        <strong>Paciente:</strong> ${payload.paciente_nombre} (${payload.edad} años • ${payload.sexo === "F" ? "Femenino" : "Masculino"}) | Tel: ${payload.antecedentes.telefono || "—"} | Ocupación: ${payload.antecedentes.ocupacion || "—"}${tutorLine}<br/>
        <strong>Antecedentes AHF:</strong> ${payload.antecedentes.heredofamiliares || "Sin registro"}<br/>
        <strong>Antropometría (${payload.antropometria.isakMode === "full" ? "ISAK 43" : "ISAK 21"}):</strong> Peso ${payload.antropometria.peso ?? "—"} kg | Cintura umbilical: ${payload.antropometria.cintura_umbilical ?? "—"} cm | IMC ${idxAnt.imc} (${idxAnt.imcDx})<br/>
        <strong>Composición:</strong> ${idxAnt.masasTexto} | IMLG: ${idxAnt.imlgFormatted} | ACT: ${idxAnt.actLitrosFormatted} (${idxAnt.actPctFormatted}) | Watson: ${idxAnt.watsonLitrosFormatted} (${idxAnt.watsonPctFormatted}) | Σ6: ${idxAnt.sum6} | Σ8: ${idxAnt.sum8}<br/>
        <strong>Somatotipo:</strong> ${som.clasif} ${som.coords}
      </div>
      ${pedBlock}
      <div class="report-block">
        <strong>Bioquímica destacada:</strong> Glucosa ${payload.bioquimica.glucosa ?? "—"} mg/dL | Triglicéridos ${payload.bioquimica.trigliceridos ?? "—"} mg/dL | HDL ${payload.bioquimica.hdl ?? "—"} mg/dL | HOMA-IR: ${document.getElementById("res_homa").textContent}
      </div>
      <div class="report-block">
        <strong>Clínica:</strong> Síntomas GI: ${payload.clinica.sintomasGI.join(", ") || "Ninguno"} | Signos: ${payload.clinica.signosFisicos.join(", ") || "Ninguno"}<br/>
        <strong>Escala de Bristol:</strong> ${payload.clinica.bristol || "No registrada"} | <strong>Escala de Armstrong:</strong> ${armstrongTexto}
      </div>
      <div class="report-block">
        <strong>Estilo de vida:</strong> Sueño ${document.getElementById("res_sueno_horas").textContent} | FAF: ${payload.estiloVida.faf} | Agua: ${payload.estiloVida.aguaLitros ?? "—"} L/día
      </div>
    `;
    document.getElementById("reportSummaryBody").innerHTML = summaryHTML;
    document.getElementById("jsonOutput").textContent = JSON.stringify(payload, null, 2);
    document.getElementById("reportModal").classList.remove("hidden");
  });

  document.getElementById("btnCloseModal").addEventListener("click", () => {
    document.getElementById("reportModal").classList.add("hidden");
  });

  document.getElementById("btnConfirmSave").addEventListener("click", () => {
    const payload = buildFullEvaluationPayload();
    const idx = PATIENTS_DB.findIndex(p => p.id === currentPatientId);
    if (idx !== -1) {
      PATIENTS_DB[idx].nombre = payload.paciente_nombre;
      PATIENTS_DB[idx].edad = payload.edad;
      PATIENTS_DB[idx].sexo = payload.sexo;
      PATIENTS_DB[idx].objetivo = payload.objetivo;
      PATIENTS_DB[idx].antecedentes = payload.antecedentes;
      PATIENTS_DB[idx].antropometria = payload.antropometria;
      PATIENTS_DB[idx].bioquimica = payload.bioquimica;
      PATIENTS_DB[idx].clinica = payload.clinica;
      PATIENTS_DB[idx].dietetica = payload.dietetica;
      PATIENTS_DB[idx].estiloVida = payload.estiloVida;
      populatePatientSelector();
    }
    document.getElementById("reportModal").classList.add("hidden");
    alert("Evaluación antropométrica y estándares OMS guardados en la sesión actual.");
  });

  document.getElementById("btnPrintReport").addEventListener("click", () => window.print());

  document.getElementById("btnNewPatient").addEventListener("click", () => {
    document.getElementById("newPatientModal").classList.remove("hidden");
    toggleGuardianFields();
  });

  document.getElementById("btnCloseNewPatient").addEventListener("click", () => {
    document.getElementById("newPatientModal").classList.add("hidden");
  });

  document.getElementById("newPatientForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const edad = parseInt(getVal("np_edad"), 10);
    const newId = "pac-" + Date.now();

    const tutorData = edad <= 17 ? {
      nombre: getVal("np_tutor_nombre").trim(),
      parentesco: getVal("np_tutor_parentesco"),
      telefono: getVal("np_tutor_telefono").trim()
    } : null;

    PATIENTS_DB.push({
      id: newId,
      nombre: getVal("np_nombre").trim(),
      edad,
      sexo: getVal("np_sexo"),
      objetivo: getVal("np_objetivo").trim(),
      tutor: tutorData,
      antecedentes: {
        contactoEmergencia: tutorData ? `${tutorData.nombre} (${tutorData.parentesco}) - ${tutorData.telefono}` : ""
      },
      antropometria: {
        isakMode: "restricted",
        pediatrico: { habilitado: edad <= 18, edadMeses: edad * 12, posicion: edad < 2 ? "longitud" : "estatura" },
        pliegues: {},
        bia: { extras: [] },
        diametros: {},
        perimetrosExtra: {},
        longitudesExtra: {}
      },
      bioquimica: {},
      clinica: { sintomasGI: [], signosFisicos: [], medicamentos: [] },
      dietetica: { frecuencia: {}, r24h: [] },
      estiloVida: { faf: "1.2" }
    });

    currentPatientId = newId;
    populatePatientSelector();
    loadPatientIntoForm(newId);
    document.getElementById("newPatientModal").classList.add("hidden");
    e.target.reset();
    toggleGuardianFields();
  });
}