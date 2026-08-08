import "./LatestUsers.css";
import UsersData from "../data/Users";

function LatestUsers() {
  const users = JSON.parse(localStorage.getItem("users")) || UsersData;

  const latestUsers = [...users]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);
    

  return (
    <div className="latest-users">
      <div className="latest-header">
        <h3>Latest Users</h3>
      </div>

      {/* Mobile & Desktop Friendly Card List Layout */}
      <div className="latest-users-list">
        {latestUsers.map((user) => (
          <div className="latest-user-card" key={user.id}>
            <div className="user-info-group">
              <span className="user-id">#{user.id}</span>
              <div>
                <h4 className="user-name">{user.name}</h4>
                <span className="role-badge">{user.role}</span>
              </div>
            </div>
            <div>
              <span
                className={
                  user.status === "Active"
                    ? "status active"
                    : "status inactive"
                }
              >
                {user.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LatestUsers;