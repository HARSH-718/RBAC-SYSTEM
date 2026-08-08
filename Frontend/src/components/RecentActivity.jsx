import "./RecentActivity.css";
import {
  FiUserPlus,
  FiEdit,
  FiTrash2,
  FiShield,
} from "react-icons/fi";

function RecentActivity() {

  const activities =
    JSON.parse(localStorage.getItem("activities")) || [];

  const getIcon = (type) => {
    switch (type) {
      case "add":
        return <FiUserPlus />;

      case "edit":
        return <FiEdit />;

      case "delete":
        return <FiTrash2 />;

      default:
        return <FiShield />;
    }
  };

  return (
    <div className="activity-card">

      <div className="activity-header">
        <h3>Recent Activity</h3>
      </div>

      <div className="activity-list">

        {activities.length === 0 ? (
          <p>No Recent Activity</p>
        ) : (
        activities.slice(0, 5).map((item) => (
            <div className="activity-item" key={item.id}>

              <div className="activity-icon">
                {getIcon(item.type)}
              </div>

              <div className="activity-info">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>

              <span>{item.time}</span>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default RecentActivity;