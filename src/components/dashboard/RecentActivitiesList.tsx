import React from 'react'
import { Link } from 'react-router-dom'
import { MonthlyActivity } from '../../types'
import { formatDate, formatKilometers } from '../../utils/formatters'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { CalendarCheck2, ArrowRight, MapPin, Landmark } from 'lucide-react'

export const RecentActivitiesList: React.FC<{ activities: MonthlyActivity[] }> = ({
  activities,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarCheck2 className="w-4 h-4 text-blue-600" />
          <CardTitle>Recent Monthly Activities & TA</CardTitle>
        </div>
        <Link
          to="/activities"
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {activities.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No activities recorded this month yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activities.slice(0, 5).map((act) => (
              <div key={act.id} className="p-4 hover:bg-slate-50/70 transition flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {formatDate(act.date, 'dd MMM yyyy')}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                      <Landmark className="w-3.5 h-3.5 text-emerald-600" />
                      {act.site_name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1 leading-relaxed">{act.activity}</p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {act.from_location} → {act.to_location}
                    </span>
                    <span>•</span>
                    <span>RA: {act.ra}</span>
                  </div>
                </div>

                <div className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md shrink-0">
                  {formatKilometers(act.to_kilometer)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

