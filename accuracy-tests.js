const fs = require("fs");
const vm = require("vm");
const path = require("path");

const dataCode = fs.readFileSync(path.join(__dirname, "data.js"), "utf8") + "\nthis.TEST_DB = FUELSTACHE_DB;";
const context = { console };
vm.createContext(context);
vm.runInContext(dataCode, context, { filename: "data.js" });

const TEST_TRACKS = ["Interlagos", "Barcelona", "Sebring", "Bahrain"];
const TEST_CAR = "Ferrari 296 LMGT3";
const TEST_DURATIONS_MINUTES = [30, 60, 90];
const TYRE_THRESHOLD_PCT = 70;
const RACE_BUFFER_LAPS = 3;
const QUALI_BUFFER_LAPS = 0.5;

function lapTimeToSeconds(value) {
  const match = String(value).trim().match(/^(\d+):([0-5]?\d)(?:\.(\d+))?$/);
  if (!match) return 0;
  return Number(match[1]) * 60 + Number(`${match[2]}.${match[3] || "0"}`);
}

function round(value, decimals = 2) {
  return Number(value).toFixed(decimals);
}

function getLimiter(fuelRange, nrgRange, tyreRange) {
  const shortest = Math.min(fuelRange, nrgRange, tyreRange);
  if (shortest === fuelRange) return "Fuel";
  if (shortest === nrgRange) return "NRG/VE";
  return "Tyres";
}

function calculateAutoStopLaps(raceLaps, stintCapacityLaps) {
  if (raceLaps <= stintCapacityLaps) return [];

  const regularStintLaps = Math.floor(stintCapacityLaps);
  if (regularStintLaps < 1) return [];

  const stopLaps = [];
  let completedLaps = 0;

  while (raceLaps - completedLaps > stintCapacityLaps && stopLaps.length < 20) {
    completedLaps += regularStintLaps;

    if (completedLaps <= 0 || completedLaps >= raceLaps) break;

    stopLaps.push(completedLaps);
  }

  return stopLaps;
}

function buildCase(track, minutes) {
  const entry = context.TEST_DB.getEntry(track, TEST_CAR);
  if (!entry) throw new Error(`${track}: missing DB entry for ${TEST_CAR}`);

  const lapSeconds = lapTimeToSeconds(entry.avgLapTime);
  if (lapSeconds <= 0) throw new Error(`${track}: invalid average lap time`);

  const suggestedRatio = entry.fuelPerLapL / entry.nrgPerLapPct;
  const fuelRange = entry.tankLiters / entry.fuelPerLapL;
  const nrgRange = 100 / entry.nrgPerLapPct;
  const finalBufferNrgPct = RACE_BUFFER_LAPS * entry.nrgPerLapPct;
  const tyreRange = (100 - TYRE_THRESHOLD_PCT) / entry.tyreDegPerLapPct;
  const stintCapacity = Math.min(fuelRange, nrgRange, tyreRange);
  const finalStintCapacity = stintCapacity;
  const raceLaps = Math.ceil((minutes * 60) / lapSeconds);
  const qualiLaps = Math.ceil((10 * 60) / lapSeconds);
  const stops = calculateAutoStopLaps(raceLaps, stintCapacity);

  return {
    track,
    minutes,
    raceLaps,
    qualiLaps,
    raceBufferLaps: RACE_BUFFER_LAPS,
    qualiBufferLaps: QUALI_BUFFER_LAPS,
    suggestedRatio: round(suggestedRatio, 3),
    fuelNeeded: `${round((raceLaps + RACE_BUFFER_LAPS) * entry.fuelPerLapL, 1)} L`,
    qualiFuel: `${round((qualiLaps + QUALI_BUFFER_LAPS) * entry.fuelPerLapL, 1)} L`,
    fuelRange: `${round(fuelRange, 2)} laps`,
    nrgRange: `${round(nrgRange, 2)} laps`,
    finalNrgPlan: RACE_BUFFER_LAPS > 0
      ? `${round(finalStintCapacity, 2)} laps + ${RACE_BUFFER_LAPS} lap buffer`
      : `${round(finalStintCapacity, 2)} laps`,
    finalBufferVE: `${round(finalBufferNrgPct, 1)}%`,
    tyreRange: `${round(tyreRange, 2)} laps`,
    stintCapacity: `${round(stintCapacity, 2)} laps`,
    finalStintCapacity: `${round(finalStintCapacity, 2)} laps`,
    limiter: getLimiter(fuelRange, nrgRange, tyreRange),
    finalLimiter: getLimiter(fuelRange, nrgRange, tyreRange),
    stops: stops.length ? stops.join(", ") : "None",
    nrgNeededInclBuffer: `${round((raceLaps + RACE_BUFFER_LAPS) * entry.nrgPerLapPct, 1)}%`,
    tyreAtFinish: `${round(Math.max(0, 100 - raceLaps * entry.tyreDegPerLapPct), 1)}%`
  };
}

const failures = [];
const rows = [];

for (const track of TEST_TRACKS) {
  for (const minutes of TEST_DURATIONS_MINUTES) {
    try {
      const testCase = buildCase(track, minutes);
      rows.push(testCase);
    } catch (error) {
      failures.push(error.message);
    }
  }
}

console.table(rows);

if (failures.length) {
  console.error("Accuracy tests failed:");
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Accuracy tests passed: ${rows.length} cases`);
}
