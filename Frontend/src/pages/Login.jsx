import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiShield, FiLock, FiMail, FiAlertCircle } from "react-icons/fi";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(formData.email, formData.password);
    setLoading(false);

    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* Left brand panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0B1220]">
        {/* subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* radial accent glow */}
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-[#3454D1]/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[360px] h-[360px] rounded-full bg-[#3454D1]/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-14 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#3454D1] flex items-center justify-center">
              <FiShield className="text-white" size={20} />
            </div>
            <span className="font-semibold text-lg tracking-tight">RBAC System</span>
          </div>

          <div className="max-w-md">
            <h1 className="font-display text-4xl font-semibold leading-tight mb-4">
              Access control, organized.
            </h1>
            <p className="text-slate-300 text-[15px] leading-relaxed">
              Manage roles, permissions, and user access from a single,
              secure workspace built for your team.
            </p>
          </div>

          <p className="text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} RBAC System. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile-only brand mark */}
          <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-lg bg-[#3454D1] flex items-center justify-center">
              <FiShield className="text-white" size={20} />
            </div>
            <span className="font-semibold text-lg text-slate-900 tracking-tight">
              RBAC System
            </span>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-slate-900">
              Welcome back
            </h2>
            <p className="text-slate-500 text-sm mt-1.5">
              Sign in to manage roles &amp; permissions
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide uppercase"
              >
                Email address
              </label>
              <div className="relative">
                <FiMail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={17}
                />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-[15px] placeholder:text-slate-400 outline-none transition focus:border-[#3454D1] focus:ring-4 focus:ring-[#3454D1]/12"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide uppercase"
              >
                Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={17}
                />
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-[15px] placeholder:text-slate-400 outline-none transition focus:border-[#3454D1] focus:ring-4 focus:ring-[#3454D1]/12"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-rose-600 text-sm">
                <FiAlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#3454D1] text-white text-[15px] font-semibold tracking-wide transition hover:bg-[#2c46b3] active:bg-[#25399a] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#3454D1]/25"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;