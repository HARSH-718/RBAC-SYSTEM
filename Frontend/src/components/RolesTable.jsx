import "./RolesTable.css";
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import { useState, useEffect } from "react";
import { getPermissions } from "../services/permission";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../services/roleService";

function RolesTable() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [newRole, setNewRole] = useState({
    name: "",
    permissions: [],
  });

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await getRoles();
      setRoles(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await getPermissions();
      setPermissions(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePermissionChange = (id) => {
    setNewRole((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(id)
        ? prev.permissions.filter((p) => p !== id)
        : [...prev.permissions, id],
    }));
  };

  const handleEditRole = (role) => {
    setIsEdit(true);
    setEditId(role._id);

    setNewRole({
      name: role.name,
      permissions: role.permissions.map((p) => p._id || p),
    });

    setShowModal(true);
  };

  const handleDeleteRole = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;

    try {
      await deleteRole(id);
      fetchRoles();
    } catch (error) {
      console.log(error);
      alert("Failed to delete role");
    }
  };

  const handleAddRole = async (e) => {
    e.preventDefault();

    if (!newRole.name.trim()) {
      alert("Role name is required");
      return;
    }

    try {
      if (isEdit) {
        await updateRole(editId, newRole);
      } else {
        await createRole(newRole);
      }

      fetchRoles();
      closeModal();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEdit(false);
    setEditId(null);

    setNewRole({
      name: "",
      permissions: [],
    });
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="roles-container">
      {/* Header */}
      <div className="header">
        <h1>Roles Management</h1>

        <button
          className="add-btn"
          onClick={() => {
            closeModal();
            setShowModal(true);
          }}
        >
          <FiPlus />
          Add Role
        </button>
      </div>

      {/* Search Input */}
      <div className="search-box">
        <FiSearch />
        <input
          type="text"
          placeholder="Search role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table Section */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Role Name</th>
              <th>Permissions</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredRoles.length > 0 ? (
              filteredRoles.map((role, index) => (
                <tr key={role._id || index}>
                  <td data-label="#">{index + 1}</td>

                  <td data-label="Role Name" style={{ fontWeight: "600" }}>
                    {role.name}
                  </td>

                  <td data-label="Permissions">
                    <div className="permission-cell">
                      {role.permissions?.length > 0 ? (
                        role.permissions.map((p) => (
                          <span key={p._id || p} className="permission-badge">
                            {p.name || p}
                          </span>
                        ))
                      ) : (
                        <span className="no-permission">No Permissions</span>
                      )}
                    </div>
                  </td>

                  <td data-label="Actions">
                    <div className="action-cell">
                      <button
                        className="edit-btn"
                        title="Edit Role"
                        onClick={() => handleEditRole(role)}
                      >
                        <FiEdit2 />
                      </button>

                      <button
                        className="delete-btn"
                        title="Delete Role"
                        onClick={() => handleDeleteRole(role._id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "24px" }}>
                  No Roles Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{isEdit ? "Edit Role" : "Add Role"}</h2>

            <form onSubmit={handleAddRole}>
              <div className="form-group">
                <label>Role Name</label>
                <input
                  type="text"
                  placeholder="e.g. Administrator"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole({
                      ...newRole,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Permissions</label>
                <div className="permission-list">
                  {permissions.map((permission) => (
                    <label key={permission._id} className="permission-item">
                      <input
                        type="checkbox"
                        checked={newRole.permissions.includes(permission._id)}
                        onChange={() =>
                          handlePermissionChange(permission._id)
                        }
                      />
                      {permission.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit" className="save-btn">
                  {isEdit ? "Update Role" : "Save Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RolesTable;