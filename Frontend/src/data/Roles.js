const roles = {
  super_admin: [
    "dashboard",
    "users",
    "roles",
    "permissions",
    "create_user",
    "edit_user",
    "delete_user",
  ],

  admin: [
    "dashboard",
    "users",
    "create_user",
    "edit_user",
  ],

  user: [
    "dashboard",
  ],
};

export default roles;