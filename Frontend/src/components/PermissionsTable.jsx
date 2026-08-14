import { useState, useEffect } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiX,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";

import {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} from "../services/permission";

function PermissionsTable() {
  const { user: loggedInUser } = useAuth();

  const [permissions, setPermissions] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [newPermission, setNewPermission] = useState({
    name: "",
    description: "",
  });

  // ========================================
  // CHECK PERMISSION
  // ========================================

  const hasPermission = (permissionName) => {
    // Super Admin = Full Access
    if (loggedInUser?.role === "super_admin") {
      return true;
    }

    if (!loggedInUser?.permissions) {
      return false;
    }

    return loggedInUser.permissions.some((permission) => {
      if (typeof permission === "string") {
        return permission === permissionName;
      }

      return permission?.name === permissionName;
    });
  };

  // ========================================
  // FETCH PERMISSIONS
  // ========================================

  const fetchPermissions = async () => {
    try {
      const response = await getPermissions();

      setPermissions(response.data || []);
    } catch (error) {
      console.log("Fetch permissions error:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to fetch permissions"
      );
    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    fetchPermissions();
  }, []);

  // ========================================
  // EDIT PERMISSION
  // ========================================

  const handleEdit = (permission) => {
    if (!hasPermission("edit_permission")) {
      alert("You don't have permission to edit permissions.");
      return;
    }

    setIsEdit(true);
    setEditId(permission._id);

    setNewPermission({
      name: permission.name,
      description: permission.description || "",
    });

    setShowModal(true);
  };

  // ========================================
  // DELETE PERMISSION
  // ========================================

  const handleDelete = async (id) => {
    if (!hasPermission("delete_permission")) {
      alert("You don't have permission to delete permissions.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this permission?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deletePermission(id);

      alert("Permission deleted successfully");

      await fetchPermissions();
    } catch (error) {
      console.log("Delete permission error:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to delete permission"
      );
    }
  };

  // ========================================
  // CREATE / UPDATE
  // ========================================

  const handleSave = async (e) => {
    e.preventDefault();

    // ----------------------------------------
    // CREATE
    // ----------------------------------------

    if (!isEdit && !hasPermission("create_permission")) {
      alert(
        "You don't have permission to create permissions."
      );
      return;
    }

    // ----------------------------------------
    // UPDATE
    // ----------------------------------------

    if (isEdit && !hasPermission("edit_permission")) {
      alert(
        "You don't have permission to edit permissions."
      );
      return;
    }

    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (!newPermission.name.trim()) {
      alert("Permission name is required");
      return;
    }

    if (!newPermission.description.trim()) {
      alert("Permission description is required");
      return;
    }

    try {
      // --------------------------------------
      // UPDATE
      // --------------------------------------

      if (isEdit) {
        await updatePermission(
          editId,
          newPermission
        );

        alert("Permission updated successfully");
      }

      // --------------------------------------
      // CREATE
      // --------------------------------------

      else {
        await createPermission(
          newPermission
        );

        alert("Permission created successfully");
      }

      await fetchPermissions();

      closeModal();
    } catch (error) {
      console.log(
        "Permission save error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  // ========================================
  // CLOSE MODAL
  // ========================================

  const closeModal = () => {
    setShowModal(false);
    setIsEdit(false);
    setEditId(null);

    setNewPermission({
      name: "",
      description: "",
    });
  };

  // ========================================
  // SEARCH
  // ========================================

  const filteredPermissions =
    permissions.filter((permission) => {
      const name =
        permission.name?.toLowerCase() || "";

      const description =
        permission.description?.toLowerCase() || "";

      const searchText =
        search.toLowerCase();

      return (
        name.includes(searchText) ||
        description.includes(searchText)
      );
    });

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="flex flex-col gap-5">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h2 className="font-display text-2xl font-semibold text-slate-900">
            Permissions Management
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {permissions.length} total &middot;{" "}
            {filteredPermissions.length} showing
          </p>
        </div>

        {/* ================================= */}
        {/* CREATE BUTTON */}
        {/* ================================= */}

        {hasPermission("create_permission") && (
          <button
            type="button"
            onClick={() => {
              closeModal();
              setShowModal(true);
            }}
            className="group inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2.5 rounded-lg bg-[#3454D1] text-white text-sm font-semibold transition-all duration-200 hover:bg-[#2c46b3] hover:-translate-y-0.5 hover:shadow-md"
          >
            <FiPlus
              size={16}
              className="transition-transform group-hover:rotate-90"
            />

            Add Permission
          </button>
        )}

      </div>

      {/* ================================= */}
      {/* SEARCH */}
      {/* ================================= */}

      <div className="relative max-w-sm">

        <FiSearch
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
        />

        <input
          type="text"
          placeholder="Search permission..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#3454D1] focus:ring-4 focus:ring-[#3454D1]/12"
        />

      </div>

      {/* ================================= */}
      {/* TABLE */}
      {/* ================================= */}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">

                <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wider px-5 py-3.5">
                  #
                </th>

                <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wider px-5 py-3.5">
                  Permission Name
                </th>

                <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wider px-5 py-3.5">
                  Description
                </th>

                {(hasPermission("edit_permission") ||
                  hasPermission("delete_permission")) && (
                  <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wider px-5 py-3.5">
                    Actions
                  </th>
                )}

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredPermissions.length > 0 ? (

                filteredPermissions.map(
                  (permission, index) => (

                    <tr
                      key={
                        permission._id ||
                        index
                      }
                      className="hover:bg-[#3454D1]/[0.03]"
                    >

                      {/* NUMBER */}

                      <td className="px-5 py-4 text-slate-500">
                        {index + 1}
                      </td>

                      {/* NAME */}

                      <td className="px-5 py-4 font-semibold text-slate-900">

                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-600">
                          {permission.name}
                        </span>

                      </td>

                      {/* DESCRIPTION */}

                      <td className="px-5 py-4 text-slate-600">
                        {permission.description || "-"}
                      </td>

                      {/* ACTIONS */}

                      {(hasPermission(
                        "edit_permission"
                      ) ||
                        hasPermission(
                          "delete_permission"
                        )) && (

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            {/* EDIT */}

                            {hasPermission(
                              "edit_permission"
                            ) && (

                              <button
                                type="button"
                                title="Edit Permission"
                                onClick={() =>
                                  handleEdit(
                                    permission
                                  )
                                }
                                className="flex items-center justify-center w-8 h-8 rounded-lg text-[#3454D1] bg-[#3454D1]/10 hover:bg-[#3454D1]/20"
                              >
                                <FiEdit2 size={14} />
                              </button>

                            )}

                            {/* DELETE */}

                            {hasPermission(
                              "delete_permission"
                            ) && (

                              <button
                                type="button"
                                title="Delete Permission"
                                onClick={() =>
                                  handleDelete(
                                    permission._id
                                  )
                                }
                                className="flex items-center justify-center w-8 h-8 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100"
                              >
                                <FiTrash2 size={14} />
                              </button>

                            )}

                          </div>

                        </td>

                      )}

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan={
                      hasPermission(
                        "edit_permission"
                      ) ||
                      hasPermission(
                        "delete_permission"
                      )
                        ? 4
                        : 3
                    }
                    className="text-center py-10 text-slate-400"
                  >
                    No permissions found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================================= */}
      {/* MODAL */}
      {/* ================================= */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">

          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-7">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between mb-5">

              <h2 className="font-display text-lg font-semibold text-slate-900">
                {isEdit
                  ? "Edit Permission"
                  : "Add Permission"}
              </h2>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <FiX size={20} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSave}
              className="flex flex-col gap-5"
            >

              {/* NAME */}

              <div>

                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Permission Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. create_user"
                  value={
                    newPermission.name
                  }
                  onChange={(e) =>
                    setNewPermission(
                      (prev) => ({
                        ...prev,
                        name:
                          e.target.value,
                      })
                    )
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:border-[#3454D1] focus:ring-4 focus:ring-[#3454D1]/12"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Description
                </label>

                <input
                  type="text"
                  placeholder="e.g. Allows user creation"
                  value={
                    newPermission.description
                  }
                  onChange={(e) =>
                    setNewPermission(
                      (prev) => ({
                        ...prev,
                        description:
                          e.target.value,
                      })
                    )
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:border-[#3454D1] focus:ring-4 focus:ring-[#3454D1]/12"
                />

              </div>

              {/* BUTTONS */}

              <div className="flex items-center justify-end gap-3 pt-1">

                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#3454D1] text-white text-sm font-semibold hover:bg-[#2c46b3]"
                >
                  {isEdit
                    ? "Update Permission"
                    : "Save Permission"}
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