import "./Profile.css";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiMail, FiShield, FiCheckCircle, FiHash } from "react-icons/fi";

function Profile() {
  const { user } = useAuth();

  if (!user) {
    return <h2>User not found</h2>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">

        <div className="profile-avatar">
          <FiUser size={70} />
        </div>

        <h2>{user.name}</h2>
        <p>{user.role}</p>

        <div className="profile-details">

          <div className="profile-item">
            <FiHash />
            <span>ID : {user.id}</span>
          </div>

          <div className="profile-item">
            <FiMail />
            <span>{user.email}</span>
          </div>

          <div className="profile-item">
            <FiShield />
            <span>{user.role}</span>
          </div>

          <div className="profile-item">
            <FiCheckCircle />
            <span>{user.status}</span>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Profile;