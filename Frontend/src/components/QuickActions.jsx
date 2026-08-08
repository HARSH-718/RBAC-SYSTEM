import "./QuickActions.css";
import { useNavigate } from "react-router-dom";
import {
  FiUserPlus,
  FiShield,
  FiKey,
} from "react-icons/fi";

function QuickActions() {

  const navigate = useNavigate();

  return (

    <div className="quick-actions">

      <h3>Quick Actions</h3>

      <div className="action-buttons">

        <button onClick={() => navigate("/users")}>
          <FiUserPlus />
          <span>Add User</span>
        </button>

        <button onClick={() => navigate("/roles")}>
          <FiShield />
          <span>Manage Roles</span>
        </button>

        <button onClick={() => navigate("/permissions")}>
          <FiKey />
          <span>Permissions</span>
        </button>

      </div>

    </div>

  );
}

export default QuickActions;