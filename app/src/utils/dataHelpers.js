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

// --- Summary statistics ----------------------------------------------------

// Key figures used by the hero stat cards
export const getFestivalStats = () => ({
  bedrifter: data.bedrifter.length,
  foredrag: data.foredrag.length,
  workshops: data.workshops.length,
  rom: data.rom.length,
})
