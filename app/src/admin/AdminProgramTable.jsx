import Badge from '../components/Badge.jsx'
import { getCompanyName } from '../utils/dataHelpers.js'

function AdminProgramTable({ program }) {
  const overriddenCount = program.filter((l) => l.endret).length

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-navy-900">Oppdatert program</h3>
        {overriddenCount > 0 && (
          <Badge variant="success">{overriddenCount} endring(er)</Badge>
        )}
      </div>
      <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-100">
        <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-semibold">Tidspunkt</th>
              <th className="px-4 py-3 font-semibold">Rom</th>
              <th className="px-4 py-3 font-semibold">Bedrift</th>
              <th className="px-4 py-3 font-semibold">Foredrag</th>
              <th className="px-4 py-3 font-semibold">Ledige plasser</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {program.map((lecture) => (
              <tr
                key={lecture.id}
                className={lecture.endret ? 'bg-emerald-50/60' : 'bg-white'}
              >
                <td className="whitespace-nowrap px-4 py-3 font-medium text-navy-900">
                  {lecture.startTid}–{lecture.sluttTid}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                  {lecture.rom}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {getCompanyName(lecture.holderBedriftId)}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <span className="flex items-center gap-2">
                    {lecture.tittel}
                    {lecture.endret && <Badge variant="success">Endret</Badge>}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {lecture.endret && lecture.ledigePlasser !== undefined
                    ? `${lecture.ledigePlasser} av ${lecture.maksPlasser} ledige`
                    : `Maks ${lecture.maksPlasser}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400">
        Endringer markeres som «Endret» og vises i program-seksjonen på forsiden.
      </p>
    </div>
  )
}

export default AdminProgramTable
