const VERSION = "FuelStache v0.6.14";
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
  finalBufferInfo: document.getElementById("finalBufferInfo"),
  summaryStrip: document.getElementById("summaryStrip"),
  results: document.getElementById("results"),
  strategyOutput: document.getElementById("strategyOutput")
};

let selectedEntry = null;
let manualStopLapOverride = null;
let tyreOverridesByStopLap = {};

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
    elements.fuelPerLapInput,
    elements.nrgPerLapInput,
    elements.tyreDegInput,
    elements.tyreThresholdInput,
    elements.tankInput,
    elements.licoPercentInput
  ].forEach(input => wireDeferredNumberInput(input, () => {
    clampNumberInput(input);
    recalculate();
  }));

  elements.avgLapTimeInput.addEventListener("input", recalculate);

  elements.multiplierSelect.addEventListener("change", () => {
    resetManualStopLap();
    recalculate();
  });
  elements.saveStrategyBtn.addEventListener("click", saveCurrentStrategy);
  elements.reloadSavedBtn.addEventListener("click", reloadSavedValues);
  elements.saveVisibleBtn.addEventListener("click", saveVisibleValues);

  elements.strategyOutput.addEventListener("input", event => {
    if (!event.target.classList.contains("manual-number-input")) return;
    event.target.dataset.dirty = "true";
    if (event.target.dataset.keyboardEdit === "true") return;
    commitManualStrategyInput(event.target);
  });

  elements.strategyOutput.addEventListener("focusin", event => {
    if (!event.target.classList.contains("manual-number-input")) return;
    event.target.dataset.initialValue = event.target.value;
    event.target.dataset.dirty = "false";
  });

  elements.strategyOutput.addEventListener("focusout", event => {
    if (event.target.classList.contains("manual-number-input") && event.target.dataset.dirty === "true") {
      commitManualStrategyInput(event.target);
    }
  });

  elements.strategyOutput.addEventListener("keydown", event => {
    if (!event.target.classList.contains("manual-number-input")) return;
    if (event.key === "Enter") {
      commitManualStrategyInput(event.target);
      event.target.blur();
      return;
    }
    if (isNumberTextEditKey(event.key)) {
      event.target.dataset.keyboardEdit = "true";
      event.target.dataset.dirty = "true";
    }
  });
}

function wireDeferredNumberInput(input, onCommit) {
  input.addEventListener("focusin", () => {
    input.dataset.initialValue = input.value;
    input.dataset.dirty = "false";
  });

  input.addEventListener("input", () => {
    input.dataset.dirty = "true";
    if (input.dataset.keyboardEdit === "true") return;
    commitDeferredNumberInput(input, onCommit);
  });

  input.addEventListener("focusout", () => {
    if (input.dataset.dirty === "true") commitDeferredNumberInput(input, onCommit);
  });

  input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      commitDeferredNumberInput(input, onCommit);
      input.blur();
      return;
    }
    if (isNumberTextEditKey(event.key)) {
      input.dataset.keyboardEdit = "true";
      input.dataset.dirty = "true";
    }
  });
}

function commitDeferredNumberInput(input, onCommit) {
  clampNumberInput(input);
  input.dataset.dirty = "false";
  input.dataset.keyboardEdit = "false";
  onCommit();
}

function resetManualStopLap() {
  manualStopLapOverride = null;
  tyreOverridesByStopLap = {};
}

function commitManualStrategyInput(input) {
  const value = clampNumberInput(input);
  const role = input.dataset.role;

  if (role === "manual-stop") {
    manualStopLapOverride = value === null ? null : Math.round(value);
    input.value = manualStopLapOverride === null ? "" : String(manualStopLapOverride);
  }

  if (role === "tyre-change") {
    const stopLap = input.dataset.stopLap;
    const tyresChanged = Math.round(value ?? 0);
    tyreOverridesByStopLap[stopLap] = tyresChanged;
    input.value = String(tyresChanged);
  }

  input.dataset.dirty = "false";
  input.dataset.keyboardEdit = "false";
  recalculate();
}

function isNumberTextEditKey(key) {
  return key.length === 1 || ["Backspace", "Delete"].includes(key);
}

function clampNumberInput(input) {
  if (input.value === "") return null;
  let value = Number(input.value);
  if (!Number.isFinite(value)) return null;

  const min = input.min === "" ? null : Number(input.min);
  const max = input.max === "" ? null : Number(input.max);

  if (Number.isFinite(min) && value < min) value = min;
  if (Number.isFinite(max) && value > max) value = max;

  input.value = formatInputNumber(value);
  return value;
}

function formatInputNumber(value) {
  return String(Math.round(value * 1000) / 1000);
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
    tyreOverridesByStopLap: { ...tyreOverridesByStopLap },
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
  renderBufferInfo(inputs);
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
  const nrgNeededPct = (raceLaps + inputs.raceBufferLaps) * effectiveNrgPerLapPct;
  const tyreAtFinishPct = Math.max(0, 100 - raceLaps * effectiveTyreDegPerLapPct);
  const autoPlan = calculateAutoStopPlan(raceLaps, stintCapacityLaps, finalStintCapacityLaps);
  const manualStopError = validateManualStop(inputs.manualStopLap, raceLaps, stintCapacityLaps, finalStintCapacityLaps);
  const suggestedFuelRatio = calculateSuggestedFuelRatio(calculationInputs);
  const manualStopActive = inputs.manualStopLap !== null && !manualStopError;
  const chosenStopLaps = manualStopActive ? [inputs.manualStopLap] : autoPlan.stopLaps;
  const licoSuggestion = calculateFinalStintLicoSuggestion(calculationInputs, chosenStopLaps, tyreRangeLaps);
  const manualStopBounds = getManualStopBounds(raceLaps, stintCapacityLaps, finalStintCapacityLaps);
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
    licoSuggestion,
    tyreAtFinishPct,
    stopNeeded: autoPlan.stopNeeded,
    calculatedStopLap: autoPlan.stopLaps[0] || null,
    autoStopLaps: autoPlan.stopLaps,
    autoStopCount: autoPlan.stopLaps.length,
    plannedStopLaps: chosenStopLaps,
    plannedStopCount: chosenStopLaps.length,
    manualStopError,
    manualStopActive,
    manualStopMinLap: manualStopBounds.min,
    manualStopMaxLap: manualStopBounds.max,
    suggestedFuelRatio,
    startFuelLiters,
    startFuelRatio,
    strategyPlan
  };
}


function calculateSuggestedFuelRatio(inputs) {
  if (!inputs || inputs.fuelPerLapL <= 0 || inputs.nrgPerLapPct <= 0) return 0;
  return inputs.fuelPerLapL / inputs.nrgPerLapPct;
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
      const defaultTyresChanged = tyreAtEnd <= inputs.tyreThresholdPct ? 4 : 0;
      const tyreOverride = inputs.tyreOverridesByStopLap?.[String(endLap)];
      const tyresChanged = Number.isFinite(tyreOverride) ? tyreOverride : defaultTyresChanged;
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

function getManualStopBounds(raceLaps, stintCapacityLaps, finalStintCapacityLaps) {
  const min = Math.max(1, raceLaps - Math.floor(finalStintCapacityLaps));
  const max = Math.min(raceLaps - 1, Math.floor(stintCapacityLaps));
  if (min > max) return { min: 1, max: Math.max(1, raceLaps - 1) };
  return { min, max };
}

function calculateFinalStintLicoSuggestion(inputs, stopLaps, tyreRangeLaps) {
  if (!stopLaps.length) {
    return { possible: false, status: "not-needed" };
  }

  const finalStopLap = stopLaps[stopLaps.length - 1];
  const stretchStartLap = stopLaps.length > 1 ? stopLaps[stopLaps.length - 2] : 0;
  const stretchLaps = inputs.raceLaps - stretchStartLap;
  const maxLicoPct = inputs.licoPercent;

  if (stretchLaps > tyreRangeLaps) {
    return { possible: false, status: "tyres-block", finalStopLap, stretchLaps, maxLicoPct };
  }

  const fullBufferOption = calculateLicoBufferOption(inputs, stretchLaps, inputs.raceBufferLaps);
  if (fullBufferOption.requiredLicoPct <= maxLicoPct) {
    return {
      possible: true,
      status: "full-buffer",
      finalStopLap,
      stretchLaps,
      originalBufferLaps: inputs.raceBufferLaps,
      bufferLaps: inputs.raceBufferLaps,
      requiredLicoPct: fullBufferOption.requiredLicoPct,
      maxLicoPct
    };
  }

  if (inputs.raceBufferLaps <= 0 || maxLicoPct <= 0) {
    return { possible: false, status: "not-enough-lico", finalStopLap, stretchLaps, maxLicoPct };
  }

  const licoFactor = 1 - maxLicoPct / 100;
  const fuelBufferLimit = inputs.tankLiters / (inputs.fuelPerLapL * licoFactor) - stretchLaps;
  const nrgBufferLimit = 100 / (inputs.nrgPerLapPct * licoFactor) - stretchLaps;
  const reducedBufferLaps = Math.max(0, Math.min(inputs.raceBufferLaps, fuelBufferLimit, nrgBufferLimit));
  const reducedBufferOption = calculateLicoBufferOption(inputs, stretchLaps, reducedBufferLaps);

  if (reducedBufferOption.requiredLicoPct <= maxLicoPct) {
    return {
      possible: true,
      status: reducedBufferLaps <= 0 ? "no-buffer" : "reduced-buffer",
      finalStopLap,
      stretchLaps,
      originalBufferLaps: inputs.raceBufferLaps,
      bufferLaps: reducedBufferLaps,
      requiredLicoPct: reducedBufferOption.requiredLicoPct,
      maxLicoPct
    };
  }

  return { possible: false, status: "not-enough-lico", finalStopLap, stretchLaps, maxLicoPct };
}

function calculateLicoBufferOption(inputs, stretchLaps, bufferLaps) {
  const requiredLaps = stretchLaps + bufferLaps;
  const fuelRequiredPct = 1 - inputs.tankLiters / (requiredLaps * inputs.fuelPerLapL);
  const nrgRequiredPct = 1 - 100 / (requiredLaps * inputs.nrgPerLapPct);
  return {
    requiredLicoPct: Math.max(0, fuelRequiredPct, nrgRequiredPct) * 100
  };
}

function getTyreServiceSeconds(tyresChanged) {
  if (tyresChanged === 0) return 0;
  if (tyresChanged <= 2) return 5;
  return 12;
}

function renderBufferInfo(inputs) {
  if (!elements.finalBufferInfo) return;
  const bufferText = `${formatLapCount(inputs.raceBufferLaps)} ${pluralize("lap", inputs.raceBufferLaps)}`;
  elements.finalBufferInfo.textContent = inputs.raceBufferLaps > 0
    ? `Final stint lap length is unchanged. The app shows the extra ${bufferText} NRG/VE buffer separately.`
    : "Final stint lap length is unchanged. No race buffer is currently configured.";
}

function formatLapCount(value) {
  return String(Math.round(Number(value) * 10) / 10);
}

function pluralize(word, value) {
  return Number(value) === 1 ? word : `${word}s`;
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
    ["Ratio note", "Suggested uses fuel/lap divided by NRG/lap."],
    ["Stop needed", result.stopNeeded ? "Yes" : "No"],
    ["Planned stops", result.plannedStopLaps.length ? result.plannedStopLaps.join(", ") : "None"],
    ["Manual stop", manualStopStatusText(result)],
    ["Max LiCo", `${formatNumber(result.licoPercent, 0)}%`],
    ["LiCo suggestion", licoSuggestionText(result.licoSuggestion)],
    ["NRG needed incl. buffer", `${formatNumber(result.nrgNeededPct, 1)}%`],
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
    summaryCard("Strategy", result.plannedStopCount ? `${result.plannedStopCount} stop${result.plannedStopCount === 1 ? "" : "s"}` : "No stop", result.licoSuggestion.possible ? "LiCo can remove final stop" : (result.plannedStopLaps.length ? `laps ${result.plannedStopLaps.join(", ")}` : "race to finish"), stopClass),
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
  if (result.manualStopError) return result.manualStopError;
  if (result.manualStopActive) return `Active, lap ${manualStopLapOverride}`;
  return "Auto";
}

function licoSuggestionText(suggestion) {
  if (!suggestion || suggestion.status === "not-needed") return "Not needed";
  if (suggestion.possible && suggestion.status === "full-buffer") {
    return `Remove stop ${suggestion.finalStopLap} with ${formatNumber(suggestion.requiredLicoPct, 1)}% LiCo; full ${formatLapCount(suggestion.bufferLaps)} lap buffer kept.`;
  }
  if (suggestion.possible && suggestion.status === "reduced-buffer") {
    return `Remove stop ${suggestion.finalStopLap} with ${formatNumber(suggestion.requiredLicoPct, 1)}% LiCo if buffer is reduced from ${formatLapCount(suggestion.originalBufferLaps)} to ${formatLapCount(suggestion.bufferLaps)} laps.`;
  }
  if (suggestion.possible && suggestion.status === "no-buffer") {
    return `Remove stop ${suggestion.finalStopLap} with ${formatNumber(suggestion.requiredLicoPct, 1)}% LiCo only with no race buffer.`;
  }
  if (suggestion.status === "tyres-block") return "No option: tyres block the stretched final stint.";
  return `No final-stop option up to ${formatNumber(suggestion.maxLicoPct || 0, 0)}% LiCo.`;
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
  const licoNotice = result.licoSuggestion.possible
    ? `<div class="strategy-warning">${escapeHtml(licoSuggestionText(result.licoSuggestion))}</div>`
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
      ["Stop lap", manualStopInput(manualStopValue, result.manualStopMinLap, result.manualStopMaxLap)],
      ["VE entry", `${formatNumber(stop.veAtEntry, 1)}%`],
      ["VE add", `${formatNumber(stop.veAdded, 1)}%`],
      ["VE exit", `${formatNumber(stop.veAtExit, 1)}%`],
      ["Next stint", nextText],
      ["Next fuel", `${formatNumber(stop.nextFuelLiters, 1)} L`],
      ["Fuel ratio", formatNumber(stop.fuelRatio, 3)],
      ["Tyres", tyreChangeInput(stop.tyresChanged, stop.stopLap)],
      ["Service", `${formatNumber(stop.serviceSeconds, 1)}s`],
      ["Next limiter", stop.limiterForNextStint]
    ])}</dl>
  </article>`;
}

function manualStopInput(value, min, max) {
  return {
    html: `<input class="manual-number-input" type="number" min="${escapeHtml(min)}" max="${escapeHtml(max)}" step="1" value="${escapeHtml(value)}" data-role="manual-stop" aria-label="Manual stop lap" />`
  };
}

function tyreChangeInput(value, stopLap) {
  return {
    html: `<input class="manual-number-input tyre-change-input" type="number" min="0" max="4" step="1" value="${escapeHtml(value)}" data-role="tyre-change" data-stop-lap="${escapeHtml(stopLap)}" aria-label="Tyres changed at stop ${escapeHtml(stopLap)}" />`
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
