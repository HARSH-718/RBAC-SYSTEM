import "./DashboardCard.css";

function DashboardCard({ title, value, icon, color }) {
  return (
    <div className="dashboard-card">
      <div className="card-icon" style={{ backgroundColor: color ? `${color}15` : '#eff6ff', color: color || '#2563eb' }}>
        {icon}
      </div>
      <div className="card-info">
        <h4>{title}</h4>
        <h2>{value}</h2>
      </div>
    </div>
  );
}

export default DashboardCard;