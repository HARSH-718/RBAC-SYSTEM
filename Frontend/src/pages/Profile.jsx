import { useAuth } from "../context/AuthContext";
import {
  FiUser,
  FiMail,
  FiShield,
  FiCheckCircle,
  FiHash,
} from "react-icons/fi";

function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <h2 className="text-slate-500 text-sm font-medium">User not found</h2>
      </div>
    );
  }

  const details = [
    {
      icon: <FiHash />,
      label: "User ID",
      value: `USR-${user.id.slice(-4).toUpperCase()}`,
    },
    { icon: <FiMail size={16} />, label: "Email", value: user.email },
    { icon: <FiShield size={16} />, label: "Role", value: user.role },
    { icon: <FiCheckCircle size={16} />, label: "Status", value: user.status },
  ];

  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-lg">
        {/* Header banner */}
        <div className="relative h-28 rounded-t-2xl bg-[#0B1220] overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#3454D1]/30 blur-3xl" />
        </div>

        {/* Avatar — absolutely positioned so it never gets clipped by the banner */}
        <div className="absolute left-1/2 top-28 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white p-1.5 shadow-md">
          <div className="w-full h-full rounded-full bg-[#3454D1]/10 flex items-center justify-center text-[#3454D1]">
            <FiUser size={40} />
          </div>
        </div>

        {/* Card body */}
        <div className="bg-white border border-slate-200 border-t-0 rounded-b-2xl shadow-sm px-6 pb-6 pt-14 flex flex-col items-center">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            {user.name}
          </h2>
          <span className="mt-1 text-xs font-semibold text-[#3454D1] bg-[#3454D1]/10 px-3 py-1 rounded-full uppercase tracking-wide">
            {user.role}
          </span>

          {/* Details */}
          <div className="w-full mt-7 flex flex-col divide-y divide-slate-100">
            {details.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3.5 py-3.5 transition-colors hover:bg-slate-50 -mx-2 px-2 rounded-lg"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-slate-500 shrink-0">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
