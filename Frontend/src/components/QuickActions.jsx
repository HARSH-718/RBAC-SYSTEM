import { useNavigate } from "react-router-dom";
import { FiUserPlus, FiShield, FiKey, FiArrowRight } from "react-icons/fi";

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Add User",
      description: "Create a new account",
      icon: <FiUserPlus size={17} />,
      path: "/users",
    },
    {
      label: "Manage Roles",
      description: "Edit role permissions",
      icon: <FiShield size={17} />,
      path: "/roles",
    },
    {
      label: "Permissions",
      description: "Define access rights",
      icon: <FiKey size={17} />,
      path: "/permissions",
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit transition-shadow duration-300 hover:shadow-md">
      <h3 className="font-display font-semibold text-slate-900 text-base mb-4">
        Quick Actions
      </h3>

      <div className="flex flex-col gap-3">
        {actions.map((action) => (
          <button
            key={action.path}
            type="button"
            onClick={() => navigate(action.path)}
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl bg-[#3454D1] px-4 py-3 text-left text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2c46b3] hover:shadow-md hover:shadow-[#3454D1]/25 active:translate-y-0"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 transition-colors duration-200 group-hover:bg-white/25">
              {action.icon}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold leading-tight">
                {action.label}
              </span>
              <span className="block truncate text-xs text-white/70">
                {action.description}
              </span>
            </span>

            <FiArrowRight
              size={15}
              className="shrink-0 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;