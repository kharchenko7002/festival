// Central data-access helpers for the festival dataset.
// All UI components read festival data through these functions so the
// JSON structure is only referenced in one place.
import data from '../data/datasett.json'

// --- Raw collections -------------------------------------------------------

export const getFestival = () => data.festival
export const getCompanies = () => data.bedrifter
export const getLectures = () => data.foredrag
export const getWorkshops = () => data.workshops
export const getRooms = () => data.rom
export const getTeachers = () => data.laerere

// --- Lookups ---------------------------------------------------------------

// Find a single company by its id
export const getCompanyById = (id) =>
  data.bedrifter.find((company) => company.id === id)

// Find a single room by its id
export const getRoomById = (id) => data.rom.find((room) => room.id === id)

// Resolve a company name from an id, with a safe fallback
export const getCompanyName = (id) =>
  getCompanyById(id)?.navn ?? 'Ukjent bedrift'

// Resolve a room label (room number) from an id, with a safe fallback
export const getRoomName = (id) => getRoomById(id)?.romnummer ?? 'Ukjent rom'

// --- Transformations -------------------------------------------------------

// Convert a "HH:MM" string into minutes since midnight for reliable sorting
const toMinutes = (time) => {
  const [hours, minutes] = String(time).split(':').map(Number)
  return hours * 60 + minutes
}

// Return a new array sorted ascending by start time (startTid)
export const sortByStartTime = (items) =>
  [...items].sort((a, b) => toMinutes(a.startTid) - toMinutes(b.startTid))

// Unique, alphabetically sorted list of lecture categories
export const getLectureCategories = () => {
  const categories = data.foredrag.map((lecture) => lecture.kategori)
  return [...new Set(categories)].sort((a, b) => a.localeCompare(b, 'no'))
}

// Group rooms by their building, returned as { bygning: rom[] }
export const groupRoomsByBuilding = () =>
  data.rom.reduce((groups, room) => {
    const building = room.bygning
    if (!groups[building]) groups[building] = []
    groups[building].push(room)
    return groups
  }, {})

// Return teachers whose responsibility area is in the provided list,
// keeping the order of the requested areas.
export const getTeachersByAreas = (areas) =>
  areas
    .map((area) =>
      data.laerere.find((teacher) => teacher.ansvarsomraade === area),
    )
    .filter(Boolean)

// --- Registration form options ---------------------------------------------
// Helpers that feed the dropdowns in the front-end-only Påmelding section.

// Companies as dropdown options, alphabetically sorted: { value, label }
export const getCompanyOptions = () =>
  [...data.bedrifter]
    .sort((a, b) => a.navn.localeCompare(b.navn, 'no'))
    .map((company) => ({ value: company.id, label: company.navn }))

// Workshops as dropdown options, sorted by start time. The label includes
// the time span so visitors can tell overlapping sessions apart.
export const getWorkshopOptions = () =>
  sortByStartTime(data.workshops).map((workshop) => ({
    value: workshop.id,
    label: `${workshop.tittel} (${workshop.startTid}–${workshop.sluttTid})`,
  }))

// Unique time slots derived from the workshop schedule, sorted ascending.
// A whole-day option is added first for visitors without a fixed preference.
export const getAvailableTimeSlots = () => {
  const slots = data.workshops.map(
    (workshop) => `${workshop.startTid}–${workshop.sluttTid}`,
  )
  const unique = [...new Set(slots)].sort(
    (a, b) => toMinutes(a.split('–')[0]) - toMinutes(b.split('–')[0]),
  )
  const festival = data.festival
  return [`Hele dagen (${festival.startTid}–${festival.sluttTid})`, ...unique]
}

// Full detail object for a selected workshop, used by the registration
// summary. Resolves company and room via the related ids.
export const getWorkshopDetails = (id) => {
  const workshop = data.workshops.find((item) => item.id === Number(id))
  if (!workshop) return null
  return {
    tittel: workshop.tittel,
    bedrift: getCompanyName(workshop.holderBedriftId),
    rom: getRoomName(workshop.romId),
    tid: `${workshop.startTid}–${workshop.sluttTid}`,
    maksPlasser: workshop.maksPlasser,
    forkunnskaper: workshop.forkunnskaper,
  }
}

// Short company info for the registration summary
export const getCompanyDetails = (id) => {
  const company = getCompanyById(Number(id))
  if (!company) return null
  return {
    navn: company.navn,
    bransje: company.bransje,
    standnummer: company.standnummer,
    nettside: company.nettside,
  }
}

// --- Summary statistics ----------------------------------------------------

// Key figures used by the hero stat cards
export const getFestivalStats = () => ({
  bedrifter: data.bedrifter.length,
  foredrag: data.foredrag.length,
  workshops: data.workshops.length,
  rom: data.rom.length,
})

// --- Festivalsjef: program overrides ---------------------------------------
// The festival manager reassigns a lecture's room and time slot. The changes
// (overrides) are stored server-side via the API (see utils/apiClient.js) and
// merged on top of the original program from datasett.json. datasett.json
// itself is never modified.

// The only rooms the festival manager assigns lectures to.
export const AUDITORIUM_ROOMS = ['Auditorium A', 'Auditorium B']
export const getAuditoriumRooms = () => [...AUDITORIUM_ROOMS]

// Companies that actually hold at least one lecture, sorted by name.
export const getLectureCompanies = () => {
  const ids = new Set(data.foredrag.map((lecture) => lecture.holderBedriftId))
  return data.bedrifter
    .filter((company) => ids.has(company.id))
    .sort((a, b) => a.navn.localeCompare(b.navn, 'no'))
}

// Lectures as dropdown options, optionally filtered by the holding company.
// Sorted by start time; the label includes the time span.
export const getLectureOptions = (companyId) => {
  const list = companyId
    ? data.foredrag.filter(
        (lecture) => lecture.holderBedriftId === Number(companyId),
      )
    : data.foredrag
  return sortByStartTime(list).map((lecture) => ({
    value: lecture.id,
    label: `${lecture.tittel} (${lecture.startTid}–${lecture.sluttTid})`,
  }))
}

// Distinct time slots derived from the program, sorted ascending.
// Returns [{ startTid, sluttTid }] so the manager picks a whole slot.
export const getProgramTimeSlots = () => {
  const slots = new Map()
  data.foredrag.forEach((lecture) => {
    if (!slots.has(lecture.startTid)) {
      slots.set(lecture.startTid, {
        startTid: lecture.startTid,
        sluttTid: lecture.sluttTid,
      })
    }
  })
  return [...slots.values()].sort(
    (a, b) => toMinutes(a.startTid) - toMinutes(b.startTid),
  )
}

// Lookup a lecture's maksPlasser by id (used by the backend validator mirror).
export const getLectureMaksPlasser = (id) =>
  data.foredrag.find((l) => l.id === Number(id))?.maksPlasser ?? null

// Return the program with overrides applied on top of the original data.
// `endret: true` marks lectures the festival manager has changed.
// `ledigePlasser` is included when the festival manager has set it.
export const mergeProgramWithOverrides = (overrides = {}) =>
  data.foredrag.map((lecture) => {
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

// Frontend mirror of the backend conflict check (the backend is authoritative).
// True if another of the festival manager's overrides already uses the given
// room at the given start time. Same time in a different room, or a different
// time in the same room, is allowed.
export const hasRoomTimeConflict = (
  rom,
  startTid,
  excludeLectureId,
  overrides = {},
) =>
  Object.entries(overrides).some(
    ([id, override]) =>
      Number(id) !== Number(excludeLectureId) &&
      override.rom === rom &&
      override.startTid === startTid,
  )
