import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Star } from "lucide-react";
import Logo from "../components/Logo";
import Spinner from "../components/ui/Spinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import { cn } from "../lib/utils";

const IMG =
  "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1400&q=80";

const DEMO = [
  { label: "Admin", email: "admin@gmail.com", password: "admin123" },
  { label: "Manager", email: "manager@gmail.com", password: "manager123" },
  { label: "User", email: "user@gmail.com", password: "user123" },
];

function homeFor(role) {
  if (role === "admin") return "/admin";
  if (role === "manager") return "/manager";
  return "/app";
}

export default function AuthPage() {
  const { login, register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [busy, setBusy] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({
    userName: "",
    email: "",
    password: "",
    role: "user",
    referralCode: "",
    withdrawCode: "",
  });

  const onLogin = async (e) => {
    e.preventDefault();
    setBusy(true);
    const res = await login(loginForm.email, loginForm.password);
    setBusy(false);
    if (res.ok) {
      toast.success(`Welcome back, ${res.user.userName}`);
      navigate(homeFor(res.user.role), { replace: true });
    } else {
      toast.error(res.message);
    }
  };

  const onRegister = async (e) => {
    e.preventDefault();
    setBusy(true);
    const res = await register(regForm);
    setBusy(false);
    if (res.ok) {
      toast.success("Account created — you can sign in now");
      setLoginForm({ email: regForm.email, password: "" });
      setTab("login");
    } else {
      toast.error(res.message);
    }
  };

  const quickFill = (d) => {
    setLoginForm({ email: d.email, password: d.password });
    setTab("login");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Visual panel */}
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-ink-900" />
        <img src={IMG} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-ink-950/50" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Link to="/">
            <Logo dark />
          </Link>
          <div className="max-w-md">
            <div className="mb-4 flex gap-1 text-sand-300">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <p className="font-display text-3xl font-500 italic leading-snug text-white">
              "The most beautiful way I've found to plan trips — and I earn while I dream up the next
              one."
            </p>
            <p className="mt-5 text-sm font-medium text-white/70">Amara Okafor · Traveler, Lagos</p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between">
            <Link to="/" className="lg:hidden">
              <Logo />
            </Link>
            <Link
              to="/"
              className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-sky-900/60 transition hover:text-ocean-700"
            >
              <ArrowLeft className="h-4 w-4" /> Back to site
            </Link>
          </div>

          <div className="mt-10">
            <h1 className="font-display text-3xl font-700 text-sky-950">
              {tab === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 text-sky-900/60">
              {tab === "login"
                ? "Sign in to continue your journey."
                : "Join Travel Leaders and start exploring."}
            </p>
          </div>

          <div className="mt-7 inline-flex rounded-full border border-ocean-200 bg-white p-1">
            {["login", "register"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "cursor-pointer rounded-full px-6 py-2 text-sm font-600 capitalize transition",
                  tab === t ? "bg-sand-500 text-white shadow-sm" : "text-sky-900/60 hover:text-sky-900"
                )}
              >
                {t === "login" ? "Sign in" : "Register"}
              </button>
            ))}
          </div>

          {tab === "login" ? (
            <form onSubmit={onLogin} className="mt-7 space-y-4 animate-fade-up">
              <div>
                <label className="label" htmlFor="login-email">Email</label>
                <input id="login-email" type="email" required className="input" placeholder="you@example.com"
                  value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="login-password">Password</label>
                <input id="login-password" type="password" required className="input" placeholder="••••••••"
                  value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
              </div>
              <button type="submit" disabled={busy} className="btn-primary w-full">
                {busy ? <Spinner /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
              </button>

              <div className="pt-2">
                <p className="mb-2 text-center text-xs uppercase tracking-wider text-sky-900/45">
                  Quick demo login
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {DEMO.map((d) => (
                    <button key={d.label} type="button" onClick={() => quickFill(d)} className="btn-ghost px-2 py-2 text-xs">
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={onRegister} className="mt-7 space-y-4 animate-fade-up">
              <div>
                <label className="label" htmlFor="reg-name">Username</label>
                <input id="reg-name" required className="input" placeholder="janetraveler"
                  value={regForm.userName} onChange={(e) => setRegForm({ ...regForm, userName: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="reg-email">Email</label>
                <input id="reg-email" type="email" required className="input" placeholder="you@example.com"
                  value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="reg-pass">Password</label>
                <input id="reg-pass" type="password" required className="input" placeholder="••••••••"
                  value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} />
              </div>
              <div>
                <label className="label">Account type</label>
                <div className="grid grid-cols-2 gap-2">
                  {["user", "manager"].map((r) => (
                    <button key={r} type="button" onClick={() => setRegForm({ ...regForm, role: r })}
                      className={cn(
                        "cursor-pointer rounded-xl border px-3 py-2.5 text-sm font-600 capitalize transition",
                        regForm.role === r
                          ? "border-ocean-500 bg-ocean-50 text-ocean-700"
                          : "border-ocean-200 bg-white text-sky-900/60 hover:text-sky-900"
                      )}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label" htmlFor="reg-ref">
                    Referral code
                  </label>
                  <input id="reg-ref" required className="input"
                    placeholder={regForm.role === "manager" ? "ADMIN100" : "MANAGER100"}
                    value={regForm.referralCode} onChange={(e) => setRegForm({ ...regForm, referralCode: e.target.value })} />
                </div>
                <div>
                  <label className="label" htmlFor="reg-wd">Withdraw code</label>
                  <input id="reg-wd" className="input" placeholder="Set a code"
                    value={regForm.withdrawCode} onChange={(e) => setRegForm({ ...regForm, withdrawCode: e.target.value })} />
                </div>
              </div>
              <button type="submit" disabled={busy} className="btn-iris w-full">
                {busy ? <Spinner /> : <>Create account <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
