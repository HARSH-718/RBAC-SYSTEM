export const hasPermission = (user, permission) => {
  if (!user) {
    return false;
  }

  if (!Array.isArray(user.permissions)) {
    return false;
  }

  return user.permissions.some((p) => {
    if (typeof p === "string") {
      return p === permission;
    }

    return p?.name === permission;
  });
};