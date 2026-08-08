const permissions = {
  "Super_Admin": {
    Users: {
      view: true,
      create: true,
      edit: true,
      delete: true,
    },
    Roles: {
      view: true,
      create: true,
      edit: true,
      delete: true,
    },
  },

  Admin: {
    Users: {
      view: true,
      create: true,
      edit: false,
      delete: true,
    },
    Roles: {
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
  },

  User: {
    Users: {
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
    Roles: {
      view: false,
      create: false,
      edit: false,
      delete: false,
    },
  },
};

export default permissions;