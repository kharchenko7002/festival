// File-based storage for festival registrations (påmeldinger).
// Registrations are appended to a JSON file in the storage directory.
// datasett.json is used read-only for validating bedrift and workshop ids.
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const DATASETT_PATH = path.join(
  process.cwd(),
  'app',
  'src',
  'data',
  'datasett.json',
)

const STORAGE_DIR =
  process.env.STORAGE_DIR || path.join(process.cwd(), 'server', 'storage')
const REGISTRATIONS_PATH = path.join(STORAGE_DIR, 'registrations.json')

function ensureRegistrationsFile() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true })
  }
  if (!fs.existsSync(REGISTRATIONS_PATH)) {
    fs.writeFileSync(REGISTRATIONS_PATH, JSON.stringify([], null, 2))
  }
}

function loadDataset() {
  const raw = fs.readFileSync(DATASETT_PATH, 'utf-8')
  return JSON.parse(raw)
}

function getBedriftById(id) {
  return loadDataset().bedrifter.find((b) => b.id === Number(id))
}

function getWorkshopById(id) {
  return loadDataset().workshops.find((w) => w.id === Number(id))
}

function loadRegistrations() {
  ensureRegistrationsFile()
  try {
    return JSON.parse(fs.readFileSync(REGISTRATIONS_PATH, 'utf-8'))
  } catch {
    return []
  }
}

function saveRegistrations(registrations) {
  ensureRegistrationsFile()
  fs.writeFileSync(REGISTRATIONS_PATH, JSON.stringify(registrations, null, 2))
}

// Validate and create a registration object. Returns { ok, error, registration }.
function createRegistration({ navn, klasse, epost, bedriftId, workshopId, tidspunkt, kommentar }) {
  if (!navn || !String(navn).trim()) return { ok: false, error: 'Navn er påkrevd.' }
  if (!klasse || !String(klasse).trim()) return { ok: false, error: 'Klasse er påkrevd.' }
  if (!epost || !String(epost).trim()) return { ok: false, error: 'E-post er påkrevd.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(epost).trim())) {
    return { ok: false, error: 'E-postadressen ser ikke riktig ut.' }
  }
  if (!bedriftId) return { ok: false, error: 'Bedrift er påkrevd.' }
  if (!workshopId) return { ok: false, error: 'Workshop er påkrevd.' }
  if (!tidspunkt || !String(tidspunkt).trim()) return { ok: false, error: 'Tidspunkt er påkrevd.' }

  const bedrift = getBedriftById(bedriftId)
  if (!bedrift) return { ok: false, error: 'Ukjent bedrift.' }

  const workshop = getWorkshopById(workshopId)
  if (!workshop) return { ok: false, error: 'Ukjent workshop.' }

  const registration = {
    id: crypto.randomBytes(8).toString('hex'),
    createdAt: new Date().toISOString(),
    navn: String(navn).trim(),
    klasse: String(klasse).trim(),
    epost: String(epost).trim().toLowerCase(),
    bedriftId: Number(bedriftId),
    bedriftNavn: bedrift.navn,
    workshopId: Number(workshopId),
    workshopTittel: workshop.tittel,
    tidspunkt: String(tidspunkt).trim(),
    kommentar: kommentar ? String(kommentar).trim() : '',
    emailSent: false,
  }

  return { ok: true, registration }
}

// Append a validated registration to the file and return it.
function appendRegistration(registration) {
  const list = loadRegistrations()
  list.push(registration)
  saveRegistrations(list)
  return registration
}

// Mark a registration as having had its email sent (or not).
function markEmailSent(id, sent) {
  const list = loadRegistrations()
  const idx = list.findIndex((r) => r.id === id)
  if (idx >= 0) {
    list[idx].emailSent = sent
    saveRegistrations(list)
  }
}

// Remove a single registration by id. Returns true if found and removed.
function deleteRegistration(id) {
  const list = loadRegistrations()
  const filtered = list.filter((r) => r.id !== id)
  if (filtered.length === list.length) return false
  saveRegistrations(filtered)
  return true
}

// Remove all registrations.
function clearRegistrations() {
  saveRegistrations([])
}

module.exports = {
  ensureRegistrationsFile,
  loadRegistrations,
  createRegistration,
  appendRegistration,
  markEmailSent,
  deleteRegistration,
  clearRegistrations,
}
