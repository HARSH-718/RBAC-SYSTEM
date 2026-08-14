import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiX,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import { getPermissions } from "../services/permission";

import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../services/roleService";

function RolesTable() {
  const { user } = useAuth();

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

  const isSuperAdmin = user?.role === "super_admin";

  // =========================
  // RECENT ACTIVITY
  // =========================

  const addActivity = (type, title, description) => {
    const oldActivities =
      JSON.parse(localStorage.getItem("activities")) || [];

    const newActivity = {
      id: Date.now(),
      type,
      title,
      description,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedActivities = [newActivity, ...oldActivities].slice(0, 20);

    localStorage.setItem("activities", JSON.stringify(updatedActivities));

    // Same tab me RecentActivity ko update karne ke liye
    window.dispatchEvent(new Event("activityUpdated"));
  };

  // =========================
  // FETCH
  // =========================

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await getRoles();
      setRoles(response.data);
    } catch (error) {
      console.log("Fetch roles error:", error);

      alert(error?.response?.data?.message || "Failed to fetch roles");
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await getPermissions();
      setPermissions(response.data);
    } catch (error) {
      console.log("Fetch permissions error:", error);
    }
  };

  // =========================
  // PERMISSION CHECKBOX
  // =========================

  const handlePermissionChange = (permissionId) => {
    setNewRole((prev) => {
      const alreadySelected = prev.permissions.includes(permissionId);

      return {
        ...prev,

        permissions: alreadySelected
          ? prev.permissions.filter((id) => id !== permissionId)
          : [...prev.permissions, permissionId],
      };
    });
  };

  // =========================
  // EDIT ROLE
  // =========================

  const handleEditRole = (role) => {
    if (!isSuperAdmin) return;

    setIsEdit(true);
    setEditId(role._id);

    setNewRole({
      name: role.name,
      permissions:
        role.permissions?.map((permission) =>
          typeof permission === "object" ? permission._id : permission
        ) || [],
    });

    setShowModal(true);
  };

  // =========================
  // DELETE ROLE
  // =========================

  const handleDeleteRole = async (id) => {
    if (!isSuperAdmin) return;

    const roleToDelete = roles.find((role) => role._id === id);

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this role?"
    );

    if (!confirmDelete) return;

    try {
      await deleteRole(id);

      // Recent Activity
      addActivity(
        "delete",
        "Role Deleted",
        `${roleToDelete?.name || "Role"} was deleted`
      );

      await fetchRoles();

      alert("Role deleted successfully");
    } catch (error) {
      console.log("Delete role error:", error);

      alert(error?.response?.data?.message || "Failed to delete role");
    }
  };

  // =========================
  // CREATE / UPDATE ROLE
  // =========================

  const handleAddRole = async (e) => {
    e.preventDefault();

    if (!isSuperAdmin) return;

    if (!newRole.name.trim()) {
      alert("Role name is required");
      return;
    }

    try {
      if (isEdit) {
        await updateRole(editId, newRole);

        // Recent Activity
        addActivity(
          "edit",
          "Role Updated",
          `${newRole.name} role was updated`
        );

        alert("Role updated successfully");
      } else {
        await createRole(newRole);

        // Recent Activity
        addActivity(
          "add",
          "Role Created",
          `${newRole.name} role was created`
        );

        alert("Role created successfully");
      }

      await fetchRoles();

      closeModal();
    } catch (error) {
      console.log("Role save error:", error);

      alert(error?.response?.data?.message || "Something went wrong");
    }
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const closeModal = () => {
    setShowModal(false);
    setIsEdit(false);
    setEditId(null);

    setNewRole({
      name: "",
      permissions: [],
    });
  };

  // =========================
  // SEARCH
  // =========================

  const filteredRoles = roles.filter((role) =>
    role.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5">
      {/* ================= HEADER ================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-slate-900">
            Roles Management
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {roles.length} total &middot; {filteredRoles.length} showing
          </p>
        </div>

        {isSuperAdmin && (
          <button
            type="button"
            onClick={() => {
              closeModal();
              setShowModal(true);
            }}
            className="group inline-flex cursor-pointer items-center gap-2 self-start sm:self-auto px-4 py-2.5 rounded-lg bg-[#3454D1] text-white text-sm font-semibold transition-all duration-200 hover:bg-[#2c46b3] hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#3454D1]/25 active:translate-y-0"
          >
            <FiPlus
              size={16}
              className="transition-transform duration-200 group-hover:rotate-90"
            />
            Add Role
          </button>
        )}
      </div>

      {/* ================= SEARCH ================= */}

      <div className="relative max-w-sm">
        <FiSearch
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
        />

        <input
          type="text"
          placeholder="Search role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-400 focus:border-[#3454D1] focus:ring-4 focus:ring-[#3454D1]/12"
        />
      </div>

      {/* ================= TABLE ================= */}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wider px-5 py-3.5">
                  #
                </th>

                <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wider px-5 py-3.5">
                  Role Name
                </th>

                <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wider px-5 py-3.5">
                  Permissions
                </th>

                {isSuperAdmin && (
                  <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wider px-5 py-3.5">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredRoles.length > 0 ? (
                filteredRoles.map((role, index) => (
                  <tr
                    key={role._id || index}
                    className="group transition-colors duration-150 hover:bg-[#3454D1]/[0.03]"
                  >
                    <td className="px-5 py-4 text-slate-500">{index + 1}</td>

                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {role.name}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {role.permissions?.length > 0 ? (
                          role.permissions.map((permission, permissionIndex) => (
                            <span
                              key={permission._id || permissionIndex}
                              className="cursor-default text-xs font-medium text-[#3454D1] bg-[#3454D1]/10 px-2.5 py-1 rounded-full transition-colors duration-150 hover:bg-[#3454D1]/20"
                            >
                              {permission.name || permission}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">
                            No permissions
                          </span>
                        )}
                      </div>
                    </td>

                    {isSuperAdmin && (
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {/* EDIT */}

                          <button
                            type="button"
                            title="Edit Role"
                            onClick={() => handleEditRole(role)}
                            className="flex cursor-pointer items-center justify-center w-8 h-8 rounded-lg text-[#3454D1] bg-[#3454D1]/10 transition-all duration-150 hover:bg-[#3454D1]/20 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0"
                          >
                            <FiEdit2 size={14} />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            title="Delete Role"
                            onClick={() => handleDeleteRole(role._id)}
                            className="flex cursor-pointer items-center justify-center w-8 h-8 rounded-lg text-rose-600 bg-rose-50 transition-all duration-150 hover:bg-rose-100 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={isSuperAdmin ? 4 : 3}
                    className="text-center py-10 text-slate-400 text-sm"
                  >
                    No roles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL ================= */}

      {showModal && isSuperAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-semibold text-slate-900">
                {isEdit ? "Edit Role" : "Add Role"}
              </h2>

              <button
                onClick={closeModal}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600"
                type="button"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleAddRole} className="flex flex-col gap-5">
              {/* ROLE NAME */}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Role Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Administrator"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-400 focus:border-[#3454D1] focus:ring-4 focus:ring-[#3454D1]/12"
                />
              </div>

              {/* PERMISSIONS */}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                  Permissions
                </label>

                <div className="flex flex-col gap-1 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-2">
                  {permissions.length > 0 ? (
                    permissions.map((permission) => (
                      <label
                        key={permission._id}
                        className="flex items-center gap-2.5 px-2 py-2 rounded-md text-sm text-slate-700 cursor-pointer transition-colors duration-150 hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={newRole.permissions.includes(
                            permission._id
                          )}
                          onChange={() =>
                            handlePermissionChange(permission._id)
                          }
                          className="w-4 h-4 cursor-pointer rounded border-slate-300 text-[#3454D1] focus:ring-[#3454D1]/30"
                        />

                        <span>{permission.name}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 px-2 py-2">
                      No permissions available
                    </p>
                  )}
                </div>
              </div>

              {/* BUTTONS */}

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="cursor-pointer px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 transition-colors duration-150 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="cursor-pointer px-5 py-2.5 rounded-lg bg-[#3454D1] text-white text-sm font-semibold transition-all duration-200 hover:bg-[#2c46b3] hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#3454D1]/25 active:translate-y-0"
                >
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