import { useEffect, useState } from "react";
import { getUsers } from "../services/userService";
import { getRoles } from "../services/roleService";

function LatestUsers() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH USERS + ROLES
  // =========================

  const fetchLatestUsers = async () => {
    try {
      setLoading(true);

      const [usersResponse, rolesResponse] =
        await Promise.all([
          getUsers(),
          getRoles(),
        ]);

      const allUsers = usersResponse.data || [];
      const allRoles = rolesResponse.data || [];

      setRoles(allRoles);

      // =========================
      // SORT LATEST USERS
      // =========================

      const sortedUsers = [...allUsers].sort((a, b) => {
        // Prefer createdAt
        if (a.createdAt && b.createdAt) {
          return (
            new Date(b.createdAt) -
            new Date(a.createdAt)
          );
        }

        // Fallback: MongoDB _id
        if (a._id && b._id) {
          return b._id.localeCompare(a._id);
        }

        return 0;
      });

      // Latest 5 users
      setUsers(sortedUsers.slice(0, 5));

    } catch (error) {
      console.log(
        "Latest users error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GET ROLE NAME
  // =========================

  const getRoleName = (role) => {
    // Backend populated role object bhej raha ho
    if (
      role &&
      typeof role === "object"
    ) {
      return role.name || "User";
    }

    // Backend sirf role ID bhej raha ho
    const foundRole = roles.find(
      (item) => item._id === role
    );

    return foundRole?.name || "User";
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    fetchLatestUsers();
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

      {/* =========================
          HEADER
      ========================= */}

      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-base font-semibold text-slate-900">
          Latest Users
        </h3>
      </div>

      {/* =========================
          LOADING
      ========================= */}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-sm text-slate-400">
            Loading users...
          </p>
        </div>

      ) : users.length === 0 ? (

        /* =========================
           NO USERS
        ========================= */

        <div className="text-center py-8">
          <p className="text-sm text-slate-400">
            No users found
          </p>
        </div>

      ) : (

        /* =========================
           USERS
        ========================= */

        <div className="flex flex-col divide-y divide-slate-100">

          {users.map((user, index) => (
            <div
              key={user._id || index}
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 transition-colors hover:bg-slate-50 -mx-2 px-2 rounded-lg"
            >

              {/* =========================
                  USER INFO
              ========================= */}

              <div className="flex items-center gap-3 min-w-0">

                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#3454D1]/10 text-[#3454D1] text-xs font-bold shrink-0">
                  #{index + 1}
                </span>

                <div className="min-w-0">

                  <h4 className="text-sm font-semibold text-slate-900 truncate">
                    {user.name}
                  </h4>

                  <span className="inline-block mt-0.5 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {getRoleName(user.role)}
                  </span>

                </div>
              </div>

              {/* =========================
                  STATUS
              ========================= */}

              <span
                className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  user.status === "Active"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {user.status || "Active"}
              </span>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default LatestUsers;