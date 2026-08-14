import {
  FiUserPlus,
  FiEdit,
  FiTrash2,
  FiShield,
  FiClock,
} from "react-icons/fi";

import { useEffect, useState } from "react";

function RecentActivity() {
  const [activities, setActivities] = useState([]);

  // =========================
  // LOAD ACTIVITIES
  // =========================

  const loadActivities = () => {
    const savedActivities =
      JSON.parse(localStorage.getItem("activities")) || [];

    setActivities(savedActivities);
  };

  // =========================
  // INITIAL LOAD + UPDATE
  // =========================

  useEffect(() => {
    loadActivities();

    const handleActivityUpdate = () => {
      loadActivities();
    };

    window.addEventListener(
      "activityUpdated",
      handleActivityUpdate
    );

    return () => {
      window.removeEventListener(
        "activityUpdated",
        handleActivityUpdate
      );
    };
  }, []);

  // =========================
  // ICON
  // =========================

  const getIcon = (type) => {
    switch (type) {
      case "add":
        return <FiUserPlus size={17} />;

      case "edit":
        return <FiEdit size={17} />;

      case "delete":
        return <FiTrash2 size={17} />;

      default:
        return <FiShield size={17} />;
    }
  };

  // =========================
  // ICON COLOR
  // =========================

  const getIconColor = (type) => {
    switch (type) {
      case "add":
        return {
          bg: "#16A34A15",
          fg: "#16A34A",
        };

      case "edit":
        return {
          bg: "#3454D115",
          fg: "#3454D1",
        };

      case "delete":
        return {
          bg: "#E11D4815",
          fg: "#E11D48",
        };

      default:
        return {
          bg: "#0EA5A015",
          fg: "#0EA5A0",
        };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-base font-semibold text-slate-900">
          Recent Activity
        </h3>
      </div>

      {/* NO ACTIVITY */}

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-10">

          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-3">
            <FiClock size={22} />
          </div>

          <p className="text-slate-500 text-sm">
            No recent activity yet
          </p>

          <p className="text-slate-400 text-xs mt-1">
            Actions across your workspace will show up here
          </p>

        </div>
      ) : (

        /* ACTIVITIES */

        <div className="flex flex-col divide-y divide-slate-100">

          {activities.slice(0, 5).map((item) => {

            const colors =
              getIconColor(item.type);

            return (
              <div
                key={item.id}
                className="flex items-center gap-3.5 py-3 first:pt-0 last:pb-0 transition-colors hover:bg-slate-50 -mx-2 px-2 rounded-lg"
              >

                {/* ICON */}

                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.fg,
                  }}
                >
                  {getIcon(item.type)}
                </div>

                {/* CONTENT */}

                <div className="min-w-0 flex-1">

                  <h4 className="text-sm font-semibold text-slate-900 truncate">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-500 truncate">
                    {item.description}
                  </p>

                </div>

                {/* TIME */}

                <span className="text-xs text-slate-400 shrink-0">
                  {item.time}
                </span>

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}

export default RecentActivity;