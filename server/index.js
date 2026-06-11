// Express server for 2INF Festival.
// Serves the React production build (app/dist) and exposes a small API that
// lets the festival manager store program changes server-side in a JSON file
// and allows students to register for workshops (påmelding).
const path = require('path')
const express = require('express')
const { checkCredentials, issueToken, requireAuth } = require('./auth')
const {
  AUDITORIUM_ROOMS,
  getLectures,
  getLectureById,
  loadOverrides,
  writeOverrides,
  hasConflict,
  ensureStorage,
} = require('./dataStore')
const {
  ensureRegistrationsFile,
  loadRegistrations,
  createRegistration,
  appendRegistration,
  markEmailSent,
  deleteRegistration,
  clearRegistrations,
} = require('./registrations')
const { sendReceiptEmail } = require('./mailer')

const app = express()
const PORT = process.env.PORT || 80
const STATIC_DIR = path.join(process.cwd(), 'app', 'dist')

app.use(express.json())

// --- API routes -----------------------------------------------------------

// Health check.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Demo login for the festival manager. Returns a bearer token on success.
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {}
  if (!checkCredentials(username, password)) {
    return res.status(401).json({ message: 'Feil brukernavn eller passord.' })
  }
  res.json({ token: issueToken() })
})

// Public: read the saved program overrides.
app.get('/api/program/overrides', (req, res) => {
  res.json(loadOverrides())
})

// Protected: save a single program override. Validates the input and blocks
// double-booking (same room + same start time as another lecture).
app.post('/api/program/overrides', requireAuth, (req, res) => {
  const { lectureId, rom, startTid, sluttTid, ledigePlasser } = req.body || {}
  const id = Number(lectureId)

  const lecture = getLectureById(id)
  if (!lecture) {
    return res.status(400).json({ message: 'Ukjent foredrag.' })
  }
  if (!AUDITORIUM_ROOMS.includes(rom)) {
    return res
      .status(400)
      .json({ message: 'Rom må være Auditorium A eller Auditorium B.' })
  }
  if (!startTid || !sluttTid) {
    return res.status(400).json({ message: 'Tidspunkt mangler.' })
  }

  // Validate ledigePlasser when provided
  if (ledigePlasser !== undefined && ledigePlasser !== null) {
    const lp = Number(ledigePlasser)
    if (!Number.isInteger(lp) || isNaN(lp)) {
      return res.status(400).json({ message: 'Ledige plasser må være et heltall.' })
    }
    if (lp < 0) {
      return res
        .status(400)
        .json({ message: 'Ledige plasser kan ikke være lavere enn 0 eller høyere enn maks kapasitet.' })
    }
    if (lp > lecture.maksPlasser) {
      return res
        .status(400)
        .json({ message: 'Ledige plasser kan ikke være lavere enn 0 eller høyere enn maks kapasitet.' })
    }
  }

  const overrides = loadOverrides()
  // Server-side conflict check is the authoritative one (the frontend can be
  // manipulated). Same room + same start time for another lecture = conflict.
  if (hasConflict(rom, startTid, id, overrides)) {
    return res
      .status(409)
      .json({ message: 'Dette tidspunktet er allerede opptatt i valgt rom.' })
  }

  const override = { rom, startTid, sluttTid }
  if (ledigePlasser !== undefined && ledigePlasser !== null) {
    override.ledigePlasser = Number(ledigePlasser)
  }
  overrides[id] = override
  writeOverrides(overrides)
  res.json(overrides)
})

// Protected: remove all overrides (used by the reset action).
app.delete('/api/program/overrides', requireAuth, (req, res) => {
  writeOverrides({})
  res.json({})
})

// --- Registration (påmelding) routes --------------------------------------

// Public: submit a new registration. Saves to disk and sends a receipt email.
app.post('/api/registrations', async (req, res) => {
  const { navn, klasse, epost, bedriftId, workshopId, tidspunkt, kommentar } =
    req.body || {}

  const result = createRegistration({
    navn,
    klasse,
    epost,
    bedriftId,
    workshopId,
    tidspunkt,
    kommentar,
  })

  if (!result.ok) {
    return res.status(400).json({ message: result.error })
  }

  const saved = appendRegistration(result.registration)

  const { sent } = await sendReceiptEmail(saved)
  markEmailSent(saved.id, sent)
  saved.emailSent = sent

  const message = sent
    ? 'Påmeldingen er lagret, og kvittering er sendt til e-posten din.'
    : 'Påmeldingen er lagret. E-postkvittering er ikke konfigurert i testmiljøet.'

  res.status(201).json({ registration: saved, emailSent: sent, message })
})

// Protected: list all registrations for the festival manager.
app.get('/api/admin/registrations', requireAuth, (req, res) => {
  const list = loadRegistrations()
  // Newest first
  res.json([...list].reverse())
})

// Protected: delete a single registration.
app.delete('/api/admin/registrations/:id', requireAuth, (req, res) => {
  const found = deleteRegistration(req.params.id)
  if (!found) return res.status(404).json({ message: 'Påmelding ikke funnet.' })
  res.json({ message: 'Påmelding slettet.' })
})

// Protected: clear all registrations.
app.delete('/api/admin/registrations', requireAuth, (req, res) => {
  clearRegistrations()
  res.json({ message: 'Alle påmeldinger er slettet.' })
})

// --- Static React build + SPA fallback ------------------------------------

app.use(express.static(STATIC_DIR))

// Anything not handled above falls back to the SPA entry point, except unknown
// API paths which return a JSON 404. (Plain middleware avoids wildcard-route
// differences between Express versions.)
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'Ukjent endepunkt.' })
  }
  res.sendFile(path.join(STATIC_DIR, 'index.html'))
})

ensureStorage()
ensureRegistrationsFile()
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`2INF Festival server lytter på port ${PORT}`)
})
