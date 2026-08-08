import "./UsersTable.css";
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/HasPermission";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService";

function UserTable() {
  const { user: loggedInUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    status: "Active",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setIsEdit(true);
    setEditId(user._id);

    setNewUser({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?"))
      return;

    try {
      await deleteUser(id);
      alert("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.log(error);
      alert("Failed to delete user");
    }
  };

  const handleAddUser = async () => {
    if (
      !newUser.name ||
      !newUser.email ||
      (!isEdit && !newUser.password)
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      if (isEdit) {
        await updateUser(editId, newUser);
        alert("User updated successfully");
      } else {
        await createUser(newUser);
        alert("User created successfully");
      }

      fetchUsers();
      closeModal();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEdit(false);
    setEditId(null);

    setNewUser({
      name: "",
      email: "",
      password: "",
      role: "user",
      status: "Active",
    });
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  });
    return (
    <div className="user-container">
      <div className="table-header">
        <h2>Users Management</h2>

        {hasPermission(loggedInUser, "create_user") && (
          <button
            className="add-btn"
            onClick={() => {
              setIsEdit(false);
              setNewUser({
                name: "",
                email: "",
                password: "",
                role: "user",
                status: "Active",
              });
              setShowModal(true);
            }}
          >
            <FiPlus />
            Add User
          </button>
        )}
      </div>

      <div className="search-box">
        <FiSearch />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <h3 style={{ textAlign: "center", marginTop: "30px" }}>
          Loading Users...
        </h3>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td data-label="S.No">{index + 1}</td>
                    <td data-label="Name">{user.name}</td>
                    <td data-label="Email">{user.email}</td>
                    <td data-label="Role">{user.role}</td>

                    <td data-label="Status">
                      <span
                        className={
                          user.status === "Active"
                            ? "status active"
                            : "status inactive"
                        }
                      >
                        {user.status}
                      </span>
                    </td>

                    <td data-label="Action">
                      <div className="action-cell">
                        {hasPermission(loggedInUser, "edit_user") && (
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(user)}
                          >
                            <FiEdit2 />
                          </button>
                        )}

                        {hasPermission(loggedInUser, "delete_user") && (
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(user._id)}
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{isEdit ? "Edit User" : "Add User"}</h2>

            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) =>
                setNewUser({ ...newUser, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder={
                isEdit
                  ? "Leave blank to keep same password"
                  : "Password"
              }
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />

            <select
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
            >
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>

            <select
              value={newUser.status}
              onChange={(e) =>
                setNewUser({ ...newUser, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <div className="modal-buttons">
              <button className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>

              <button className="save-btn" onClick={handleAddUser}>
                {isEdit ? "Update User" : "Save User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserTable;