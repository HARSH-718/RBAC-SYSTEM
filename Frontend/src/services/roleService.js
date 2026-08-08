import api from "./api";

export const getRoles = async () => {
  return await api.get("/roles");
};

export const createRole = async (data) => {
  return await api.post("/roles", data);
};

export const updateRole = async (id, data) => {
  return await api.put(`/roles/${id}`, data);
};

export const deleteRole = async (id) => {
  return await api.delete(`/roles/${id}`);
};