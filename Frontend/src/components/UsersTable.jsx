import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService";

import { getRoles } from "../services/roleService";

function UserTable() {
const {
  user: loggedInUser,
  hasPermission,
} = useAuth();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  // const isSuperAdmin = loggedInUser?.role === "super_admin";
  // const isAdmin = loggedInUser?.role === "admin";

  // const canCreate = isSuperAdmin;
  // const canEdit = isSuperAdmin;
  // const canDelete = isSuperAdmin;
  const canCreate = hasPermission("create_user");
const canEdit = hasPermission("edit_user");
const canDelete = hasPermission("delete_user");

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    status: "Active",
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };
  const getRoleName = (role) => {
    // Agar backend populated role object bhej raha hai
    if (typeof role === "object") {
      return role?.name || "Unknown";
    }

    // Agar backend sirf role ID bhej raha hai
    const foundRole = roles.find((item) => item._id === role);

    return foundRole?.name || "Unknown";
  };
  const fetchRoles = async () => {
    try {
      const response = await getRoles();
      setRoles(response.data);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to fetch roles");
    }
  };

  const handleEdit = (user) => {
    if (!canEdit) return;

    setIsEdit(true);
    setEditId(user._id);

    const roleId = typeof user.role === "object" ? user.role?._id : user.role;

    setNewUser({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: roleId || "",
      status: user.status || "Active",
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!canDelete) {
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      // Delete user from backend
      await deleteUser(id);

      // =========================
      // SAVE RECENT ACTIVITY
      // =========================

      const activities = JSON.parse(localStorage.getItem("activities")) || [];

      const newActivity = {
        id: Date.now(),
        type: "delete",
        title: "User Deleted",
        description: `${loggedInUser?.name} deleted a user`,
        time: new Date().toLocaleTimeString(),

        // Kisne action kiya
        userId: loggedInUser?._id,
        userEmail: loggedInUser?.email,
      };

      activities.unshift(newActivity);

      // Latest 20 activities rakho
      localStorage.setItem(
        "activities",
        JSON.stringify(activities.slice(0, 20))
      );

      alert("User deleted successfully");

      // Refresh users
      await fetchUsers();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleAddUser = async () => {
    if (isEdit && !canEdit) {
      return;
    }

    if (!isEdit && !canCreate) {
      return;
    }

    if (
      !newUser.name.trim() ||
      !newUser.email.trim() ||
      (!isEdit && !newUser.password.trim()) ||
      !newUser.role
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const userData = {
        name: newUser.name.trim(),
        email: newUser.email.trim(),
        role: newUser.role,
        status: newUser.status,
      };

      // Password only send when available
      if (newUser.password.trim()) {
        userData.password = newUser.password;
      }

      // =========================
      // EDIT USER
      // =========================

      if (isEdit) {
        await updateUser(editId, userData);

        // Recent Activity
        const activities =
          JSON.parse(localStorage.getItem("activities")) || [];

        const newActivity = {
          id: Date.now(),
          type: "edit",
          title: "User Updated",
          description: `${loggedInUser?.name} updated user ${newUser.name}`,
          time: new Date().toLocaleTimeString(),
          userId: loggedInUser?._id,
          userEmail: loggedInUser?.email,
        };

        activities.unshift(newActivity);

        localStorage.setItem(
          "activities",
          JSON.stringify(activities.slice(0, 20))
        );

        alert("User updated successfully");
      } else {
        // =========================
        // CREATE USER
        // =========================

        await createUser(userData);

        // Recent Activity
        const activities =
          JSON.parse(localStorage.getItem("activities")) || [];

        const newActivity = {
          id: Date.now(),
          type: "add",
          title: "User Created",
          description: `${loggedInUser?.name} created user ${newUser.name}`,
          time: new Date().toLocaleTimeString(),
          userId: loggedInUser?._id,
          userEmail: loggedInUser?.email,
        };

        activities.unshift(newActivity);

        localStorage.setItem(
          "activities",
          JSON.stringify(activities.slice(0, 20))
        );

        alert("User created successfully");
      }

      await fetchUsers();

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
      role: roles.length > 0 ? roles[0]._id : "",
      status: "Active",
    });
  };

  const filteredUsers = users.filter((user) => {
    const name = user.name?.toLowerCase() || "";
    const email = user.email?.toLowerCase() || "";
    return (
      name.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col gap-5">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-slate-900">
            Users Management
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {users.length} total &middot; {filteredUsers.length} showing
          </p>
        </div>

    {canCreate && (
  <button
    type="button"
    onClick={() => {
      setIsEdit(false);
      setEditId(null);

      setNewUser({
        name: "",
        email: "",
        password: "",
        role: roles.length > 0 ? roles[0]._id : "",
        status: "Active",
      });

      setShowModal(true);
    }}
    className="group inline-flex cursor-pointer items-center gap-2 self-start sm:self-auto px-4 py-2.5 rounded-lg bg-[#3454D1] text-white text-sm font-semibold transition-all duration-200 hover:bg-[#2c46b3]"
  >
    <FiPlus size={16} />
    Add User
  </button>
)}
      </div>

      {/* SEARCH */}
      <div className="relative max-w-sm">
        <FiSearch
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
        />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-400 focus:border-[#3454D1] focus:ring-4 focus:ring-[#3454D1]/12"
        />
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-2.5 text-slate-400 text-sm">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#3454D1]" />
            Loading users…
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wider px-5 py-3.5">
                    S.No
                  </th>
                  <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wider px-5 py-3.5">
                    Name
                  </th>
                  <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wider px-5 py-3.5">
                    Email
                  </th>
                  <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wider px-5 py-3.5">
                    Role
                  </th>
                  <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wider px-5 py-3.5">
                    Status
                  </th>
                  <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wider px-5 py-3.5">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr
                      key={user._id || index}
                      className="group transition-colors duration-150 hover:bg-[#3454D1]/[0.03]"
                    >
                      <td className="px-5 py-4 text-slate-500">
                        {index + 1}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {user.name}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {user.email}
                      </td>
                      <td
                        data-label="Role"
                        className="px-5 py-4 text-sm font-medium text-slate-700 whitespace-nowrap"
                      >
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 transition-colors duration-150 group-hover:bg-slate-200">
                          {getRoleName(user.role)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-transform duration-150 group-hover:scale-105 ${
                            user.status === "Active"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              user.status === "Active"
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />
                          {user.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                  {canEdit && (
  <button
    type="button"
    title="Edit User"
    onClick={() => handleEdit(user)}
    className="flex cursor-pointer items-center justify-center w-8 h-8 rounded-lg text-[#3454D1] bg-[#3454D1]/10"
  >
    <FiEdit2 size={14} />
  </button>
)}{canDelete && (
  <button
    type="button"
    title="Delete User"
    onClick={() => handleDelete(user._id)}
    className="flex cursor-pointer items-center justify-center w-8 h-8 rounded-lg text-rose-600 bg-rose-50"
  >
    <FiTrash2 size={14} />
  </button>
)}  
{!canEdit && !canDelete && (
  <span className="text-xs text-slate-400">
    View only
  </span>
)}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-10 text-slate-400 text-sm"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-fade-in overflow-y-auto py-8">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-7">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-semibold text-slate-900">
                {isEdit ? "Edit User" : "Add User"}
              </h2>
              <button
                onClick={closeModal}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600"
                type="button"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-400 focus:border-[#3454D1] focus:ring-4 focus:ring-[#3454D1]/12"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-400 focus:border-[#3454D1] focus:ring-4 focus:ring-[#3454D1]/12"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  {isEdit ? "New Password (optional)" : "Password"}
                </label>
                <input
                  type="password"
                  placeholder={
                    isEdit
                      ? "Leave empty to keep current password"
                      : "Enter password"
                  }
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-400 focus:border-[#3454D1] focus:ring-4 focus:ring-[#3454D1]/12"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="w-full cursor-pointer px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-400 focus:border-[#3454D1] focus:ring-4 focus:ring-[#3454D1]/12 bg-white"
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Status
                </label>
                <select
                  value={newUser.status}
                  onChange={(e) =>
                    setNewUser({ ...newUser, status: e.target.value })
                  }
                  className="w-full cursor-pointer px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-400 focus:border-[#3454D1] focus:ring-4 focus:ring-[#3454D1]/12 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="cursor-pointer px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 transition-colors duration-150 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddUser}
                  className="cursor-pointer px-5 py-2.5 rounded-lg bg-[#3454D1] text-white text-sm font-semibold transition-all duration-200 hover:bg-[#2c46b3] hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#3454D1]/25 active:translate-y-0"
                >
                  {isEdit ? "Update User" : "Save User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserTable;