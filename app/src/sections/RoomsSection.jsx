import SectionTitle from '../components/SectionTitle.jsx'
import Badge from '../components/Badge.jsx'
import Reveal from '../components/Reveal.jsx'
import { groupRoomsByBuilding } from '../utils/dataHelpers.js'

// Rooms section: a simple area overview where rooms are grouped by building.
function RoomsSection() {
  const buildings = groupRoomsByBuilding()

  return (
    <section id="rom" className="bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-20 sm:px-6 lg:py-24">
        <Reveal>
          <SectionTitle
            eyebrow="Rom"
            title="Områdeoversikt"
            subtitle="Festivalen er fordelt på flere bygg. Her finner du rommene gruppert etter bygning, med kapasitet og utstyr."
          />
        </Reveal>

        {Object.entries(buildings).map(([building, rooms]) => (
          <Reveal key={building} className="flex flex-col gap-5">
            {/* Building header */}
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-lg text-brand-700">
                🏢
              </span>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {building}
                </h3>
                <p className="text-sm text-slate-500">
                  {rooms.length} rom i dette bygget
                </p>
              </div>
            </div>

            {/* Room cards as a simple map grid */}
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <li
                  key={room.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-brand-50/60 p-5 transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:bg-white hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900">
                      {room.romnummer}
                    </span>
                    <Badge variant="brand">{room.kapasitet} plasser</Badge>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {room.utstyr.map((item) => (
                      <Badge key={item} variant="neutral">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default RoomsSection
