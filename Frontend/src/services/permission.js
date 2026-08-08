import api from "./api";

// Get All Permissions
export const getPermissions = async () => {
  return await api.get("/permissions");
};

// Create Permission
export const createPermission = async (data) => {
  return await api.post("/permissions", data);
};

// Update Permission
export const updatePermission = async (id, data) => {
  return await api.put(`/permissions/${id}`, data);
};

// Delete Permission
export const deletePermission = async (id) => {
  return await api.delete(`/permissions/${id}`);
};