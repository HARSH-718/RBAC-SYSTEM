import "./PermissionsTable.css";
import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} from "../services/permission";

function PermissionsTable() {
  const [permissions, setPermissions] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [newPermission, setNewPermission] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await getPermissions();
      setPermissions(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (permission) => {
    setIsEdit(true);
    setEditId(permission._id);

    setNewPermission({
      name: permission.name,
      description: permission.description || "",
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this permission?")) return;

    try {
      await deletePermission(id);
      fetchPermissions();
    } catch (error) {
      console.log(error);
      alert("Failed to delete permission");
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    if (!newPermission.name.trim()) {
      alert("Permission name is required");
      return;
    }

    try {
      if (isEdit) {
        await updatePermission(editId, newPermission);
      } else {
        await createPermission(newPermission);
      }

      fetchPermissions();
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

    setNewPermission({
      name: "",
      description: "",
    });
  };

  const filteredPermissions = permissions.filter(
    (permission) =>
      permission.name.toLowerCase().includes(search.toLowerCase()) ||
      (permission.description &&
        permission.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="permission-container">
      {/* Header */}
      <div className="permission-header">
        <h2>Permissions Management</h2>

        <button
          className="add-btn"
          onClick={() => {
            closeModal();
            setShowModal(true);
          }}
        >
          <FiPlus />
          Add Permission
        </button>
      </div>

      {/* Search Field */}
      <div className="search-box">
        <FiSearch />
        <input
          type="text"
          placeholder="Search Permission..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table Container */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Permission Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPermissions.length > 0 ? (
              filteredPermissions.map((permission, index) => (
                <tr key={permission._id || index}>
                  <td data-label="#">{index + 1}</td>

                  <td data-label="Permission Name" style={{ fontWeight: "600" }}>
                    {permission.name}
                  </td>

                  <td data-label="Description">
                    {permission.description || "-"}
                  </td>

                  <td data-label="Actions">
                    <div className="action-cell">
                      <button
                        className="edit-btn"
                        title="Edit Permission"
                        onClick={() => handleEdit(permission)}
                      >
                        <FiEdit2 />
                      </button>

                      <button
                        className="delete-btn"
                        title="Delete Permission"
                        onClick={() => handleDelete(permission._id)}
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
                  No Permissions Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{isEdit ? "Edit Permission" : "Add Permission"}</h2>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Permission Name</label>
                <input
                  type="text"
                  placeholder="e.g. create_user"
                  value={newPermission.name}
                  onChange={(e) =>
                    setNewPermission({
                      ...newPermission,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="e.g. Allows user creation"
                  value={newPermission.description}
                  onChange={(e) =>
                    setNewPermission({
                      ...newPermission,
                      description: e.target.value,
                    })
                  }
                />
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
                  {isEdit ? "Update Permission" : "Save Permission"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PermissionsTable;