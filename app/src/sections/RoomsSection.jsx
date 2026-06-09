import SectionTitle from '../components/SectionTitle.jsx'
import Badge from '../components/Badge.jsx'
import Reveal from '../components/Reveal.jsx'
import { groupRoomsByBuilding } from '../utils/dataHelpers.js'

// Rooms section: a simple area overview where rooms are grouped by building.
function RoomsSection() {
  const buildings = groupRoomsByBuilding()

  return (
    <section id="rom" className="bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-14 px-4 py-24 sm:px-6 lg:py-28">
        <Reveal>
          <SectionTitle
            eyebrow="Rom"
            title="Områdeoversikt"
            subtitle="Festivalen er fordelt på flere bygg. Her finner du rommene gruppert etter bygning, med kapasitet og utstyr."
          />
        </Reveal>

        {Object.entries(buildings).map(([building, rooms]) => (
          <Reveal key={building} className="flex flex-col gap-6">
            {/* Building header */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-800 text-lg text-gold-400"
              >
                🏢
              </span>
              <div>
                <h3 className="text-xl font-semibold text-navy-900">
                  {building}
                </h3>
                <p className="text-sm text-slate-500">
                  {rooms.length} rom i dette bygget
                </p>
              </div>
            </div>

            {/* Room cards as a simple map grid */}
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room, index) => (
                <Reveal
                  as="li"
                  key={room.id}
                  delay={(index % 3) * 80}
                  className="card-lift flex flex-col gap-3 p-5 ring-1 ring-slate-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-navy-900">
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
                </Reveal>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default RoomsSection
