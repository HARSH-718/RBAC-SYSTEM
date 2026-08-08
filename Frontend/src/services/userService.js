import api from "./api";

export const getUsers = async () => {
  return await api.get("/users");
};

export const createUser = async (data) => {
  return await api.post("/users", data);
};

export const updateUser = async (id, data) => {
  return await api.put(`/users/${id}`, data);
};

export const deleteUser = async (id) => {
  return await api.delete(`/users/${id}`);
};