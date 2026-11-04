import React from 'react'
import { Link } from 'react-router-dom'
import { MaterialTransfer } from '../../types'
import { formatDate, formatCurrency, formatKilometers } from '../../utils/formatters'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Truck, ArrowRight, MapPin } from 'lucide-react'

export const RecentMaterialTransfersList: React.FC<{ transfers: MaterialTransfer[] }> = ({
  transfers,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-teal-600" />
          <CardTitle>Recent Material Transfers</CardTitle>
        </div>
        <Link
          to="/transfers"
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {transfers.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No material transfers recorded this month yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transfers.slice(0, 5).map((item) => (
              <div key={item.id} className="p-4 hover:bg-slate-50/70 transition flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {formatDate(item.date, 'dd MMM yyyy')}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{item.from_location}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span>{item.to_location}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1 leading-relaxed">{item.activity}</p>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Distance: {formatKilometers(item.total_kilometer)}
                  </div>
                </div>

                <div className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md shrink-0">
                  {formatCurrency(item.cost)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

