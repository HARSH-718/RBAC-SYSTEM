import { FiArrowUpRight } from "react-icons/fi";

function DashboardCard({ title, value, icon: Icon, color = "#3454D1", trend }) {
  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl p-5 overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300">
      {/* soft accent glow on hover */}
      <div
        className="absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-20"
        style={{ backgroundColor: color }}
      />

      <div className="relative flex items-start justify-between">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {Icon && <Icon size={20} />}
        </div>

        {trend && (
          <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <FiArrowUpRight size={12} />
            {trend}
          </span>
        )}
      </div>

      <div className="relative mt-4 min-w-0">
        <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
          {title}
        </h4>
        <h2 className="mt-1 text-2xl font-bold text-slate-900 truncate">
          {value}
        </h2>
      </div>
    </div>
  );
}

export default DashboardCard;