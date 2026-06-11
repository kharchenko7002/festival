// File-based storage for festival program overrides.
// The original festival data (datasett.json) is read-only and never modified.
// Overrides are stored in a small JSON file so the festival manager's changes
// survive on the server instead of only living in the browser's localStorage.
const fs = require('fs')
const path = require('path')

// Read-only festival dataset (used to validate lecture ids).
const DATASETT_PATH = path.join(
  process.cwd(),
  'app',
  'src',
  'data',
  'datasett.json',
)

// Storage location for the overrides file. Configurable via STORAGE_DIR.
const STORAGE_DIR =
  process.env.STORAGE_DIR || path.join(process.cwd(), 'server', 'storage')
const OVERRIDES_PATH = path.join(STORAGE_DIR, 'program-overrides.json')

// The only rooms the festival manager may assign lectures to.
const AUDITORIUM_ROOMS = ['Auditorium A', 'Auditorium B']

// Ensure the storage directory and file exist (created on first run).
function ensureStorage() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true })
  }
  if (!fs.existsSync(OVERRIDES_PATH)) {
    fs.writeFileSync(OVERRIDES_PATH, JSON.stringify({}, null, 2))
  }
}

// All lectures from the read-only dataset.
function getLectures() {
  const raw = fs.readFileSync(DATASETT_PATH, 'utf-8')
  return JSON.parse(raw).foredrag
}

// Single lecture by id, or undefined if not found.
function getLectureById(id) {
  return getLectures().find((lecture) => lecture.id === Number(id))
}

// Read all saved overrides as { [lectureId]: { rom, startTid, sluttTid } }.
function loadOverrides() {
  ensureStorage()
  try {
    return JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf-8'))
  } catch {
    // Corrupt or unreadable file: fall back to an empty set of overrides.
    return {}
  }
}

// Persist the full overrides object to disk.
function writeOverrides(overrides) {
  ensureStorage()
  fs.writeFileSync(OVERRIDES_PATH, JSON.stringify(overrides, null, 2))
}

// Merge overrides on top of the original lectures. `endret: true` marks the
// lectures the festival manager has changed. ledigePlasser is included when set.
function mergeProgram(overrides = loadOverrides()) {
  return getLectures().map((lecture) => {
    const override = overrides[lecture.id]
    if (!override) return { ...lecture, endret: false }
    return {
      ...lecture,
      rom: override.rom ?? lecture.rom,
      startTid: override.startTid ?? lecture.startTid,
      sluttTid: override.sluttTid ?? lecture.sluttTid,
      ...(override.ledigePlasser !== undefined && {
        ledigePlasser: override.ledigePlasser,
      }),
      endret: true,
    }
  })
}

// True if assigning lectureId to the given rom+startTid would create a
// double-booking. Checks the full merged program (original datasett.json data
// with overrides applied) so that original-data conflicts and override-created
// conflicts are both caught.
//
// Algorithm: build the program as it would look with the proposed override
// applied, then count how many lectures land in the same room at the same
// start time. More than one means conflict.
function hasConflict(rom, startTid, lectureId, overrides = loadOverrides()) {
  const normalizedRom = String(rom || '').trim()
  const normalizedTime = String(startTid || '').trim()
  if (!normalizedRom || !normalizedTime) return false

  // Simulate saving the proposed override without sluttTid (not needed for
  // conflict detection; mergeProgram falls back to the lecture's own sluttTid).
  const testOverrides = {
    ...overrides,
    [Number(lectureId)]: {
      ...(overrides[Number(lectureId)] || {}),
      rom: normalizedRom,
      startTid: normalizedTime,
    },
  }
  const merged = mergeProgram(testOverrides)

  // If more than one lecture occupies the same room+time, that is a conflict.
  const inSlot = merged.filter(
    (l) =>
      String(l.rom || '').trim() === normalizedRom &&
      String(l.startTid || '').trim() === normalizedTime,
  )
  return inSlot.length > 1
}

module.exports = {
  AUDITORIUM_ROOMS,
  OVERRIDES_PATH,
  STORAGE_DIR,
  ensureStorage,
  getLectures,
  getLectureById,
  loadOverrides,
  writeOverrides,
  mergeProgram,
  hasConflict,
}
