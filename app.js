const VERSION = "FuelStache v0.6.13";
const VE_SERVICE_SECONDS_PER_PERCENT = 0.4;
const SAVED_VALUES_KEY = "fuelstache_saved_values_v1";
const SAVED_STRATEGIES_KEY = "fuelstache_saved_strategies_v1";

const elements = {
  trackSelect: document.getElementById("trackSelect"),
  carSelect: document.getElementById("carSelect"),
  dbStatus: document.getElementById("dbStatus"),
  raceMinutesInput: document.getElementById("raceMinutesInput"),
  raceBufferInput: document.getElementById("raceBufferInput"),
  qualiMinutesInput: document.getElementById("qualiMinutesInput"),
  qualiBufferInput: document.getElementById("qualiBufferInput"),
  multiplierSelect: document.getElementById("multiplierSelect"),
  avgLapTimeInput: document.getElementById("avgLapTimeInput"),
  fuelPerLapInput: document.getElementById("fuelPerLapInput"),
  nrgPerLapInput: document.getElementById("nrgPerLapInput"),
  tyreDegInput: document.getElementById("tyreDegInput"),
  tyreThresholdInput: document.getElementById("tyreThresholdInput"),
  tankInput: document.getElementById("tankInput"),
  licoPercentInput: document.getElementById("licoPercentInput"),
  saveStrategyBtn: document.getElementById("saveStrategyBtn"),
  reloadSavedBtn: document.getElementById("reloadSavedBtn"),
  saveVisibleBtn: document.getElementById("saveVisibleBtn"),
  saveStatus: document.getElementById("saveStatus"),
  errorMessage: document.getElementById("errorMessage"),
  dbInfo: document.getElementById("dbInfo"),
  confidenceWarning: document.getElementById("confidenceWarning"),
  summaryStrip: document.getElementById("summaryStrip"),
  results: document.getElementById("results"),
  strategyOutput: document.getElementById("strategyOutput")
};

let selectedEntry = null;
let manualStopLapOverride = null;

function initApp() {
  if (!window.FUELSTACHE_DB && typeof FUELSTACHE_DB === "undefined") {
    showError("No DB info found. Check that data.js is in the same folder and loads before app.js.");
    return;
  }

  populateTrackDropdown();
  wireEvents();
  loadSelectedDbEntry();
  elements.dbStatus.textContent = `${VERSION}: database loaded with ${FUELSTACHE_DB.rows.length} entries.`;
  elements.dbStatus.classList.add("ok");
}

function populateTrackDropdown() {
  fillSelect(elements.trackSelect, FUELSTACHE_DB.getTracks());
  if (FUELSTACHE_DB.getTracks().includes("Interlagos")) {
    elements.trackSelect.value = "Interlagos";
  }
  populateCarDropdown(elements.trackSelect.value);
}

function populateCarDropdown(track) {
  const cars = FUELSTACHE_DB.getCarsForTrack(track);
  fillSelect(elements.carSelect, cars);
  if (cars.includes("Ferrari 296 LMGT3")) {
    elements.carSelect.value = "Ferrari 296 LMGT3";
  }
}

function fillSelect(select, values) {
  select.innerHTML = values
    .map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`)
    .join("");
}

function wireEvents() {
  elements.trackSelect.addEventListener("change", () => {
    resetManualStopLap();
    populateCarDropdown(elements.trackSelect.value);
    loadSelectedDbEntry();
  });

  elements.carSelect.addEventListener("change", () => {
    resetManualStopLap();
    loadSelectedDbEntry();
  });

  [
    elements.raceMinutesInput,
    elements.raceBufferInput,
    elements.qualiMinutesInput,
    elements.qualiBufferInput,
    elements.multiplierSelect,
    elements.avgLapTimeInput,
    elements.fuelPerLapInput,
    elements.nrgPerLapInput,
    elements.tyreDegInput,
    elements.tyreThresholdInput,
    elements.tankInput,
    elements.licoPercentInput
  ].forEach(input => input.addEventListener("input", recalculate));

  elements.multiplierSelect.addEventListener("change", () => {
    resetManualStopLap();
    recalculate();
  });
  elements.saveStrategyBtn.addEventListener("click", saveCurrentStrategy);
  elements.reloadSavedBtn.addEventListener("click", reloadSavedValues);
  elements.saveVisibleBtn.addEventListener("click", saveVisibleValues);

  elements.strategyOutput.addEventListener("input", event => {
    if (event.target.id === "manualStopLapInput") {
      event.target.dataset.dirty = "true";
      if (event.target.dataset.keyboardEdit === "true") return;
      commitManualStopLap(event.target);
    }
  });

  elements.strategyOutput.addEventListener("focusin", event => {
    if (event.target.id === "manualStopLapInput") {
      event.target.dataset.initialValue = event.target.value;
      event.target.dataset.dirty = "false";
    }
  });

  elements.strategyOutput.addEventListener("focusout", event => {
    if (event.target.id === "manualStopLapInput" && event.target.dataset.dirty === "true") {
      commitManualStopLap(event.target);
    }
  });

  elements.strategyOutput.addEventListener("keydown", event => {
    if (event.target.id !== "manualStopLapInput") return;
    if (event.key === "Enter") {
      commitManualStopLap(event.target);
      event.target.blur();
      return;
    }
    if (isManualStopTextEditKey(event.key)) {
      event.target.dataset.keyboardEdit = "true";
      event.target.dataset.dirty = "true";
    }
  });
}

function resetManualStopLap() {
  manualStopLapOverride = null;
}

function commitManualStopLap(input) {
  manualStopLapOverride = toOptionalNumber(input.value);
  input.dataset.dirty = "false";
  input.dataset.keyboardEdit = "false";
  recalculate();
}

function isManualStopTextEditKey(key) {
  return key.length === 1 || ["Backspace", "Delete"].includes(key);
}

function comboKey() {
  return `${elements.trackSelect.value}|||${elements.carSelect.value}`;
}

function loadSelectedDbEntry() {
  selectedEntry = FUELSTACHE_DB.getEntry(elements.trackSelect.value, elements.carSelect.value);

  if (!selectedEntry) {
    renderDbInfo(null);
    showError("No DB entry found for the selected track and car.");
    recalculate();
    return;
  }

  elements.fuelPerLapInput.value = selectedEntry.fuelPerLapL || "";
  elements.nrgPerLapInput.value = selectedEntry.nrgPerLapPct || "";
  elements.tyreDegInput.value = selectedEntry.tyreDegPerLapPct || "";
  elements.avgLapTimeInput.value = selectedEntry.avgLapTime || "";
  elements.tankInput.value = selectedEntry.tankLiters || 120;
  applySavedValues(false);

  renderDbInfo(selectedEntry);
  recalculate();
}

function saveVisibleValues() {
  const savedValues = readStoredObject(SAVED_VALUES_KEY);
  savedValues[comboKey()] = {
    avgLapTime: elements.avgLapTimeInput.value,
    fuelPerLapL: elements.fuelPerLapInput.value,
    nrgPerLapPct: elements.nrgPerLapInput.value,
    tyreDegPerLapPct: elements.tyreDegInput.value,
    tankLiters: elements.tankInput.value
  };
  writeStoredObject(SAVED_VALUES_KEY, savedValues);
  setSaveStatus("Visible values saved for this car/track.");
}

function reloadSavedValues() {
  const loaded = applySavedValues(true);
  if (loaded) recalculate();
}

function applySavedValues(showMessage) {
  const savedValues = readStoredObject(SAVED_VALUES_KEY);
  const saved = savedValues[comboKey()];

  if (!saved) {
    if (showMessage) setSaveStatus("No saved visible values for this car/track.");
    return false;
  }

  elements.avgLapTimeInput.value = saved.avgLapTime || elements.avgLapTimeInput.value;
  elements.fuelPerLapInput.value = saved.fuelPerLapL || elements.fuelPerLapInput.value;
  elements.nrgPerLapInput.value = saved.nrgPerLapPct || elements.nrgPerLapInput.value;
  elements.tyreDegInput.value = saved.tyreDegPerLapPct || elements.tyreDegInput.value;
  elements.tankInput.value = saved.tankLiters || elements.tankInput.value;

  if (showMessage) setSaveStatus("Saved visible values reloaded.");
  return true;
}

function saveCurrentStrategy() {
  const inputs = readInputs();
  const error = validateInputs(inputs);
  if (error) {
    setSaveStatus(`Cannot save: ${error}`);
    return;
  }

  const result = calculateStrategy(inputs);
  if (result.manualStopError) {
    setSaveStatus(`Cannot save: ${result.manualStopError}`);
    return;
  }

  const strategies = readStoredArray(SAVED_STRATEGIES_KEY);
  strategies.unshift({
    savedAt: new Date().toISOString(),
    track: inputs.track,
    car: inputs.car,
    raceMinutes: inputs.raceMinutes,
    raceBufferLaps: inputs.raceBufferLaps,
    qualiMinutes: inputs.qualiMinutes,
    qualiBufferLaps: inputs.qualiBufferLaps,
    multiplier: inputs.multiplier,
    raceLaps: result.raceLaps,
    stops: result.plannedStopLaps,
    startFuelLiters: result.startFuelLiters,
    postStopFuelRatio: result.suggestedFuelRatio
  });
  writeStoredObject(SAVED_STRATEGIES_KEY, strategies.slice(0, 20));
  setSaveStatus("Strategy saved in this browser.");
}

function readStoredObject(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch (error) {
    return {};
  }
}

function readStoredArray(key) {
  const value = readStoredObject(key);
  return Array.isArray(value) ? value : [];
}

function writeStoredObject(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function setSaveStatus(message) {
  elements.saveStatus.textContent = message;
}

function readInputs() {
  return {
    track: elements.trackSelect.value,
    car: elements.carSelect.value,
    raceMinutes: toNumber(elements.raceMinutesInput.value),
    raceBufferLaps: toNumber(elements.raceBufferInput.value),
    qualiMinutes: toNumber(elements.qualiMinutesInput.value),
    qualiBufferLaps: toNumber(elements.qualiBufferInput.value),
    multiplier: toNumber(elements.multiplierSelect.value, 1),
    avgLapTime: elements.avgLapTimeInput.value.trim(),
    fuelPerLapL: toNumber(elements.fuelPerLapInput.value),
    nrgPerLapPct: toNumber(elements.nrgPerLapInput.value),
    tyreDegPerLapPct: toNumber(elements.tyreDegInput.value),
    tyreThresholdPct: toNumber(elements.tyreThresholdInput.value),
    tankLiters: toNumber(elements.tankInput.value),
    manualStopLap: manualStopLapOverride,
    licoPercent: toNumber(elements.licoPercentInput.value)
  };
}

function validateInputs(inputs) {
  if (!selectedEntry) return "Select a track and car with DB data.";
  if (inputs.raceMinutes <= 0) return "Race duration must be above 0.";
  if (inputs.raceBufferLaps < 0) return "Race buffer cannot be below 0.";
  if (inputs.qualiMinutes < 0) return "Quali duration cannot be below 0.";
  if (inputs.qualiBufferLaps < 0) return "Quali buffer cannot be below 0.";
  if (![1, 2, 3].includes(inputs.multiplier)) return "Multiplier must be Real / x1, x2, or x3.";
  if (lapTimeToSeconds(inputs.avgLapTime) <= 0) return "Average lap time must use m:ss.xxx format, for example 1:37.091.";
  if (inputs.fuelPerLapL <= 0) return "Fuel per lap must be above 0.";
  if (inputs.nrgPerLapPct <= 0) return "NRG per lap must be above 0.";
  if (inputs.tyreDegPerLapPct <= 0) return "Tyre degradation per lap must be above 0.";
  if (inputs.tankLiters <= 0) return "Tank size must be above 0.";
  if (inputs.tyreThresholdPct < 0 || inputs.tyreThresholdPct > 100) return "Tyre threshold must be between 0 and 100.";
  if (inputs.licoPercent < 0 || inputs.licoPercent > 15) return "LiCo percentage must be between 0 and 15.";
  return "";
}

function recalculate() {
  const inputs = readInputs();
  const error = validateInputs(inputs);

  if (error) {
    showError(error);
    renderSummary(null);
    renderResults(null);
    renderStrategyPlan(null);
    return;
  }

  const result = calculateStrategy(inputs);

  if (result.manualStopError) {
    showError(result.manualStopError);
    renderSummary(result);
    renderResults(result);
    renderStrategyPlan(result);
    return;
  }

  clearError();
  renderSummary(result);
  renderResults(result);
  renderStrategyPlan(result);
}

function calculateStrategy(inputs) {
  const averageLapSeconds = lapTimeToSeconds(inputs.avgLapTime);
  const effectiveFuelPerLapL = inputs.fuelPerLapL * inputs.multiplier;
  const effectiveNrgPerLapPct = inputs.nrgPerLapPct * inputs.multiplier;
  const effectiveTyreDegPerLapPct = inputs.tyreDegPerLapPct * inputs.multiplier;
  const raceLaps = calculateSessionLaps(inputs.raceMinutes, averageLapSeconds);
  const qualiLaps = calculateSessionLaps(inputs.qualiMinutes, averageLapSeconds);
  const calculationInputs = {
    ...inputs,
    raceLaps,
    fuelPerLapL: effectiveFuelPerLapL,
    nrgPerLapPct: effectiveNrgPerLapPct,
    tyreDegPerLapPct: effectiveTyreDegPerLapPct
  };
  const fuelTankRangeLaps = inputs.tankLiters / effectiveFuelPerLapL;
  const nrgRangeLaps = 100 / effectiveNrgPerLapPct;
  const finalStintBufferNrgPct = inputs.raceBufferLaps * effectiveNrgPerLapPct;
  const tyreRangeLaps = (100 - inputs.tyreThresholdPct) / effectiveTyreDegPerLapPct;
  const stintCapacityLaps = Math.min(fuelTankRangeLaps, nrgRangeLaps, tyreRangeLaps);
  const finalStintCapacityLaps = stintCapacityLaps;
  const limiter = getLimiter(fuelTankRangeLaps, nrgRangeLaps, tyreRangeLaps);
  const finalLimiter = limiter;
  const fuelNeededLiters = (raceLaps + inputs.raceBufferLaps) * effectiveFuelPerLapL;
  const qualiFuelLiters = (qualiLaps + inputs.qualiBufferLaps) * effectiveFuelPerLapL;
  const nrgNeededPct = raceLaps * effectiveNrgPerLapPct;
  const tyreAtFinishPct = Math.max(0, 100 - raceLaps * effectiveTyreDegPerLapPct);
  let autoPlan = calculateAutoStopPlan(raceLaps, stintCapacityLaps, finalStintCapacityLaps);
  const licoPlan = calculateLicoPlan(inputs, raceLaps, fuelTankRangeLaps, nrgRangeLaps, tyreRangeLaps);
  if (autoPlan.stopNeeded && licoPlan.possibleNoStop) {
    autoPlan = { stopNeeded: false, stopLaps: [], licoClearedStop: true };
  }
  const manualStopError = validateManualStop(inputs.manualStopLap, raceLaps, stintCapacityLaps, finalStintCapacityLaps);
  const rangeMatchedFuelRatio = calculateRangeMatchedFuelRatio(calculationInputs);
  const suggestedFuelRatio = calculateSuggestedFuelRatio(calculationInputs);
  const manualStopActive = inputs.manualStopLap !== null && !manualStopError && !autoPlan.licoClearedStop;
  const manualStopIgnoredByLico = inputs.manualStopLap !== null && Boolean(autoPlan.licoClearedStop);
  const chosenStopLaps = manualStopActive ? [inputs.manualStopLap] : autoPlan.stopLaps;
  const strategyPlan = buildStrategyPlan(calculationInputs, chosenStopLaps, limiter, finalLimiter, suggestedFuelRatio);
  const startStint = strategyPlan.find(item => item.type === "stint");
  const startFuelLiters = startStint ? startStint.fuelLiters : 0;
  const startFuelRatio = startFuelLiters / 100;

  return {
    raceLaps,
    qualiLaps,
    fuelNeededLiters,
    qualiFuelLiters,
    effectiveFuelPerLapL,
    effectiveNrgPerLapPct,
    effectiveTyreDegPerLapPct,
    fuelTankRangeLaps,
    nrgRangeLaps,
    finalStintBufferNrgPct,
    tyreRangeLaps,
    stintCapacityLaps,
    finalStintCapacityLaps,
    limiter,
    finalLimiter,
    nrgNeededPct,
    licoPercent: inputs.licoPercent,
    licoPlan,
    licoClearedStop: Boolean(autoPlan.licoClearedStop),
    tyreAtFinishPct,
    stopNeeded: autoPlan.stopNeeded,
    calculatedStopLap: autoPlan.stopLaps[0] || null,
    autoStopLaps: autoPlan.stopLaps,
    autoStopCount: autoPlan.stopLaps.length,
    plannedStopLaps: chosenStopLaps,
    plannedStopCount: chosenStopLaps.length,
    manualStopError,
    manualStopActive,
    manualStopIgnoredByLico,
    rangeMatchedFuelRatio,
    suggestedFuelRatio,
    startFuelLiters,
    startFuelRatio,
    strategyPlan
  };
}

function calculateRangeMatchedFuelRatio(inputs) {
  if (!inputs || inputs.fuelPerLapL <= 0 || inputs.nrgPerLapPct <= 0 || inputs.tankLiters <= 0) return 0;
  const nrgRangeLaps = 100 / inputs.nrgPerLapPct;
  const fullTankFuelRangeLaps = inputs.tankLiters / inputs.fuelPerLapL;
  return nrgRangeLaps / fullTankFuelRangeLaps;
}

function calculateSuggestedFuelRatio(inputs) {
  if (!inputs || inputs.fuelPerLapL <= 0 || inputs.nrgPerLapPct <= 0) return 0;
  return Math.min(1, inputs.fuelPerLapL / inputs.nrgPerLapPct);
}

function calculateAutoStopPlan(raceLaps, stintCapacityLaps, finalStintCapacityLaps) {
  if (raceLaps <= finalStintCapacityLaps) {
    return { stopNeeded: false, stopLaps: [] };
  }

  const regularStintLaps = Math.floor(stintCapacityLaps);
  if (regularStintLaps < 1) {
    return { stopNeeded: true, stopLaps: [] };
  }

  const stopLaps = [];
  let completedLaps = 0;

  while (raceLaps - completedLaps > finalStintCapacityLaps && stopLaps.length < 20) {
    completedLaps += regularStintLaps;
    if (completedLaps <= 0 || completedLaps >= raceLaps) break;
    stopLaps.push(completedLaps);
  }

  return { stopNeeded: stopLaps.length > 0, stopLaps };
}

function validateManualStop(manualStopLap, raceLaps, stintCapacityLaps, finalStintCapacityLaps) {
  if (manualStopLap === null) return "";
  if (manualStopLap <= 0) return "Manual stop lap cannot be 0 or lower.";
  if (manualStopLap >= raceLaps) return "Manual stop lap must be before the race finish.";
  if (manualStopLap > Math.floor(stintCapacityLaps)) {
    return `Manual stop ignored: lap ${manualStopLap} is longer than the first stint can run. Use lap ${Math.floor(stintCapacityLaps)} or earlier.`;
  }
  if (raceLaps - manualStopLap > Math.floor(finalStintCapacityLaps)) {
    return `Manual stop ignored: lap ${manualStopLap} leaves too long a final stint. Use lap ${raceLaps - Math.floor(finalStintCapacityLaps)} or later.`;
  }
  return "";
}

function getLimiter(fuelRange, nrgRange, tyreRange) {
  const shortest = Math.min(fuelRange, nrgRange, tyreRange);
  if (shortest === fuelRange) return "Fuel";
  if (shortest === nrgRange) return "NRG/VE";
  return "Tyres";
}

function buildStrategyPlan(inputs, stopLaps, limiter, finalLimiter, suggestedFuelRatio) {
  const boundaries = [0, ...stopLaps, calculateRaceLaps(inputs)];
  const plan = [];
  let veAtStart = 100;

  for (let index = 0; index < boundaries.length - 1; index++) {
    const startLap = boundaries[index];
    const endLap = boundaries[index + 1];
    const stintLaps = endLap - startLap;
    const isFinal = index === boundaries.length - 2;
    const bufferLaps = isFinal ? inputs.raceBufferLaps : 0;
    const veUsed = stintLaps * inputs.nrgPerLapPct;
    const veAtEnd = Math.max(0, veAtStart - veUsed);
    const tyreAtEnd = Math.max(0, 100 - stintLaps * inputs.tyreDegPerLapPct);
    const fuelLiters = (stintLaps + bufferLaps) * inputs.fuelPerLapL;
    const stintFuelRatio = index === 0 ? fuelLiters / 100 : suggestedFuelRatio;

    plan.push({
      type: "stint",
      number: index + 1,
      startLap: startLap + 1,
      endLap,
      stintLaps,
      bufferLaps,
      veAtStart,
      veAtEnd,
      tyreAtEnd,
      fuelLiters,
      fuelRatio: stintFuelRatio,
      limiter: isFinal ? finalLimiter : limiter
    });

    if (!isFinal) {
      const nextStartLap = boundaries[index + 1];
      const nextEndLap = boundaries[index + 2];
      const nextStintLaps = nextEndLap - nextStartLap;
      const nextIsFinal = index + 1 === boundaries.length - 2;
      const nextBufferLaps = nextIsFinal ? inputs.raceBufferLaps : 0;
      const targetVeAtExit = Math.min(100, (nextStintLaps + nextBufferLaps) * inputs.nrgPerLapPct);
      const veAdded = Math.max(0, targetVeAtExit - veAtEnd);
      const tyresChanged = tyreAtEnd <= inputs.tyreThresholdPct ? 4 : 0;
      const tyreServiceSeconds = getTyreServiceSeconds(tyresChanged);

      plan.push({
        type: "stop",
        number: index + 1,
        stopLap: endLap,
        veAtEntry: veAtEnd,
        veAdded,
        veAtExit: targetVeAtExit,
        nextStintLaps,
        nextBufferLaps,
        nextFuelLiters: (nextStintLaps + nextBufferLaps) * inputs.fuelPerLapL,
        fuelRatio: suggestedFuelRatio,
        tyresChanged,
        serviceSeconds: veAdded * VE_SERVICE_SECONDS_PER_PERCENT + tyreServiceSeconds,
        limiterForNextStint: nextIsFinal ? finalLimiter : limiter
      });

      veAtStart = targetVeAtExit;
    }
  }

  return plan;
}

function calculateRaceLaps(inputs) {
  if (Number.isFinite(inputs.raceLaps)) return inputs.raceLaps;
  return Math.ceil((inputs.raceMinutes * 60) / lapTimeToSeconds(inputs.avgLapTime));
}

function calculateSessionLaps(minutes, averageLapSeconds) {
  if (minutes <= 0) return 0;
  return Math.ceil((minutes * 60) / averageLapSeconds);
}

function calculateLicoPlan(inputs, raceLaps, fuelTankRangeLaps, nrgRangeLaps, tyreRangeLaps) {
  const fuelRequiredLaps = raceLaps + inputs.raceBufferLaps;
  const nrgRequiredLaps = raceLaps + inputs.raceBufferLaps;
  const fuelShortfallPct = fuelRequiredLaps > fuelTankRangeLaps
    ? ((fuelRequiredLaps - fuelTankRangeLaps) / fuelRequiredLaps) * 100
    : 0;
  const nrgShortfallPct = nrgRequiredLaps > nrgRangeLaps
    ? ((nrgRequiredLaps - nrgRangeLaps) / nrgRequiredLaps) * 100
    : 0;
  const tyreBlocks = raceLaps > tyreRangeLaps;
  const neededLicoPct = Math.max(fuelShortfallPct, nrgShortfallPct);
  return {
    possibleNoStop: !tyreBlocks && neededLicoPct > 0 && neededLicoPct <= inputs.licoPercent,
    fuelShortfallPct,
    nrgShortfallPct,
    neededLicoPct,
    tyreBlocks
  };
}

function getTyreServiceSeconds(tyresChanged) {
  if (tyresChanged === 0) return 0;
  if (tyresChanged <= 2) return 5;
  return 12;
}

function renderDbInfo(entry) {
  if (!entry) {
    elements.dbInfo.innerHTML = "";
    elements.confidenceWarning.textContent = "No data entry selected.";
    return;
  }

  elements.dbInfo.innerHTML = definitionRows([
    ["Track", entry.track],
    ["Car", entry.car],
    ["Fuel/lap", `${formatNumber(entry.fuelPerLapL, 3)} L`],
    ["NRG/lap", `${formatNumber(entry.nrgPerLapPct, 3)}%`],
    ["Tyre deg/lap", `${formatNumber(entry.tyreDegPerLapPct, 3)}%`],
    ["Usable laps", entry.usableLaps],
    ["Confidence", entry.confidence],
    ["Source file", entry.sourceFile || "Not listed"],
    ["Tank assumed", `${entry.tankLiters} L`],
    ["Worst tyre", entry.worstTyre || "Not listed"],
    ["Average tyre deg", entry.avgTyreDegPerLapPct === null ? "Not listed" : `${formatNumber(entry.avgTyreDegPerLapPct, 3)}%`]
  ]);

  elements.confidenceWarning.textContent = FUELSTACHE_DB.getConfidenceWarning(entry);
}

function renderResults(result) {
  if (!result) {
    elements.results.innerHTML = "";
    return;
  }

  const raceBufferLaps = readInputs().raceBufferLaps;
  const resultRows = [
    ["Race laps", result.raceLaps],
    ["Quali laps", result.qualiLaps],
    ["Fuel needed", `${formatNumber(result.fuelNeededLiters, 1)} L`],
    ["Quali fuel", `${formatNumber(result.qualiFuelLiters, 1)} L`],
    ["Multiplier", `x${readInputs().multiplier}`],
    ["Fuel/lap used", `${formatNumber(result.effectiveFuelPerLapL, 3)} L`],
    ["NRG/lap used", `${formatNumber(result.effectiveNrgPerLapPct, 3)}%`],
    ["Tyre deg used", `${formatNumber(result.effectiveTyreDegPerLapPct, 3)}%`],
    ["Full tank range", `${formatNumber(result.fuelTankRangeLaps, 2)} laps`],
    ["NRG/VE range", `${formatNumber(result.nrgRangeLaps, 2)} laps`],
    ["Final NRG plan", bufferPlanText(result.finalStintCapacityLaps, raceBufferLaps)],
    ["Tyre range", `${formatNumber(result.tyreRangeLaps, 2)} laps`],
    ["Stint capacity", `${formatNumber(result.stintCapacityLaps, 2)} laps`],
    ["Final stint capacity", `${formatNumber(result.finalStintCapacityLaps, 2)} laps`],
    ["Limiter", result.limiter],
    ["Final limiter", result.finalLimiter],
    ["Start fuel", `${formatNumber(result.startFuelLiters, 1)} L`],
    ["Start fuel ratio", formatNumber(result.startFuelRatio, 3)],
    ["Post-stop fuel ratio", formatNumber(result.suggestedFuelRatio, 3)],
    ["Range-match ratio", formatNumber(result.rangeMatchedFuelRatio, 3)],
    ["Ratio note", "Suggested uses fuel/lap divided by NRG/lap; range-match shows the theoretical 100% VE vs tank range point."],
    ["Stop needed", result.licoClearedStop ? "No, cleared by LiCo" : (result.stopNeeded ? "Yes" : "No")],
    ["Planned stops", result.plannedStopLaps.length ? result.plannedStopLaps.join(", ") : "None"],
    ["Manual stop", manualStopStatusText(result)],
    ["LiCo setting", `${formatNumber(result.licoPercent, 0)}%`],
    ["LiCo needed", `${formatNumber(result.licoPlan.neededLicoPct, 1)}%`],
    ["NRG needed", `${formatNumber(result.nrgNeededPct, 1)}%`],
    ["Tyre at finish", `${formatNumber(result.tyreAtFinishPct, 1)}%`]
  ];

  if (raceBufferLaps > 0) {
    resultRows.splice(11, 0, ["Final buffer VE", `${formatNumber(result.finalStintBufferNrgPct, 1)}%`]);
  }

  elements.results.innerHTML = definitionRows(resultRows);
}

function renderSummary(result) {
  if (!result) {
    elements.summaryStrip.innerHTML = "";
    return;
  }

  const stopClass = result.manualStopError ? "warn" : (result.stopNeeded ? "warn" : "good");
  const tyreClass = result.tyreAtFinishPct <= 30 ? "danger" : result.tyreAtFinishPct <= 45 ? "warn" : "good";
  const inputs = readInputs();

  elements.summaryStrip.innerHTML = [
    summaryCard("Race laps", result.raceLaps, fuelSummaryText(result.fuelNeededLiters, inputs.raceBufferLaps), ""),
    summaryCard("Quali", result.qualiLaps, fuelSummaryText(result.qualiFuelLiters, inputs.qualiBufferLaps), ""),
    summaryCard("Strategy", result.licoClearedStop ? "No stop + LiCo" : (result.plannedStopCount ? `${result.plannedStopCount} stop${result.plannedStopCount === 1 ? "" : "s"}` : "No stop"), result.plannedStopLaps.length ? `laps ${result.plannedStopLaps.join(", ")}` : "race to finish", stopClass),
    summaryCard("Limiter", result.limiter, `${formatNumber(result.stintCapacityLaps, 1)} lap stint`, ""),
    summaryCard("Start fuel", `${formatNumber(result.startFuelLiters, 1)} L`, `ratio ${formatNumber(result.startFuelRatio, 3)}`, ""),
    summaryCard("Stop ratio", formatNumber(result.suggestedFuelRatio, 3), "after pit stops", ""),
    summaryCard("Tyre finish", `${formatNumber(result.tyreAtFinishPct, 1)}%`, bufferVeText(result.finalStintBufferNrgPct), tyreClass)
  ].join("");
}

function summaryCard(label, value, detail, className) {
  return `<article class="summary-card ${className}">
    <strong>${escapeHtml(label)}</strong>
    <b>${escapeHtml(value)}</b>
    <span>${escapeHtml(detail)}</span>
  </article>`;
}

function manualStopStatusText(result) {
  if (result.manualStopIgnoredByLico) return "Ignored, LiCo clears stop";
  if (result.manualStopError) return result.manualStopError;
  if (result.manualStopActive) return `Active, lap ${manualStopLapOverride}`;
  return "Auto";
}

function fuelSummaryText(liters, bufferLaps) {
  const fuelText = `${formatNumber(liters, 1)} L`;
  return bufferLaps > 0 ? `${fuelText} incl. buffer` : fuelText;
}

function bufferPlanText(stintCapacityLaps, bufferLaps) {
  if (bufferLaps <= 0) return `${formatNumber(stintCapacityLaps, 2)} laps`;
  return `${formatNumber(stintCapacityLaps, 2)} laps + ${formatNumber(bufferLaps, 0)} lap buffer`;
}

function bufferVeText(bufferVePct) {
  if (bufferVePct <= 0) return "";
  return `${formatNumber(bufferVePct, 1)}% VE buffer`;
}

function renderStrategyPlan(result) {
  if (!result || !result.strategyPlan) {
    elements.strategyOutput.innerHTML = "";
    return;
  }

  const manualWarning = result.manualStopError
    ? `<div class="strategy-warning">${escapeHtml(result.manualStopError)} Auto plan shown below.</div>`
    : "";
  const licoNotice = result.manualStopIgnoredByLico
    ? `<div class="strategy-warning">Manual stop ignored because LiCo clears the stop.</div>`
    : "";

  elements.strategyOutput.innerHTML = manualWarning + licoNotice + result.strategyPlan.map(item => {
    if (item.type === "stint") return renderStintCard(item);
    return renderStopCard(item, result);
  }).join("");
}

function renderStintCard(stint) {
  const lapText = stint.bufferLaps > 0
    ? `${stint.stintLaps} laps + ${stint.bufferLaps} buffer`
    : `${stint.stintLaps} laps`;

  return `<article class="strategy-card">
    <h3>Stint ${stint.number}</h3>
    <dl class="data-list">${definitionRows([
      ["Laps", lapText],
      ["Lap range", `${stint.startLap}-${stint.endLap}`],
      ["VE start", `${formatNumber(stint.veAtStart, 1)}%`],
      ["VE end", `${formatNumber(stint.veAtEnd, 1)}%`],
      ["Tyre end", `${formatNumber(stint.tyreAtEnd, 1)}%`],
      ["Fuel", `${formatNumber(stint.fuelLiters, 1)} L`],
      ["Fuel ratio", formatNumber(stint.fuelRatio, 3)],
      ["Limiter", stint.limiter]
    ])}</dl>
  </article>`;
}

function renderStopCard(stop, result) {
  const nextText = stop.nextBufferLaps > 0
    ? `${stop.nextStintLaps} laps + ${stop.nextBufferLaps} buffer`
    : `${stop.nextStintLaps} laps`;
  const manualStopValue = result.manualStopActive ? manualStopLapOverride : stop.stopLap;

  return `<article class="strategy-card stop">
    <h3>Stop ${stop.number}</h3>
    <dl class="data-list">${definitionRows([
      ["Stop lap", manualStopInput(manualStopValue)],
      ["VE entry", `${formatNumber(stop.veAtEntry, 1)}%`],
      ["VE add", `${formatNumber(stop.veAdded, 1)}%`],
      ["VE exit", `${formatNumber(stop.veAtExit, 1)}%`],
      ["Next stint", nextText],
      ["Next fuel", `${formatNumber(stop.nextFuelLiters, 1)} L`],
      ["Fuel ratio", formatNumber(stop.fuelRatio, 3)],
      ["Tyres", stop.tyresChanged],
      ["Service", `${formatNumber(stop.serviceSeconds, 1)}s`],
      ["Next limiter", stop.limiterForNextStint]
    ])}</dl>
  </article>`;
}

function manualStopInput(value) {
  return {
    html: `<input id="manualStopLapInput" class="manual-stop-input" type="number" min="1" step="1" value="${escapeHtml(value)}" aria-label="Manual stop lap" />`
  };
}

function definitionRows(rows) {
  return rows
    .map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${value && value.html ? value.html : escapeHtml(value)}</dd>`)
    .join("");
}

function showError(message) {
  elements.errorMessage.textContent = message;
}

function clearError() {
  elements.errorMessage.textContent = "";
}

function lapTimeToSeconds(value) {
  const match = String(value).trim().match(/^(\d+):([0-5]?\d)(?:\.(\d+))?$/);
  if (!match) return 0;
  const minutes = Number(match[1]);
  const seconds = Number(`${match[2]}.${match[3] || "0"}`);
  return minutes * 60 + seconds;
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function toOptionalNumber(value) {
  if (value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function formatNumber(value, decimals) {
  return Number(value).toFixed(decimals);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

initApp();
