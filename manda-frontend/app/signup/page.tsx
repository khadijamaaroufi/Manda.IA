"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle, XCircle, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const passwordLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Erreur lors de l'inscription");
      }

      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <main className="w-full max-w-sm flex flex-col items-center">
        {/* Logo */}
        <div className="text-center motion-safe:animate-[fadeInUp_0.5s_ease-out]">
          <h2 className="text-[28px] font-extrabold tracking-[-0.02em] leading-none">
            <span className="text-[#0B1229]">manda</span>
            <span className="text-[#C8102E]">.</span>
            <span className="text-[#2563EB]">IA</span>
          </h2>
          <div className="w-6 h-[2px] bg-[#C8102E] mx-auto mt-1.5 opacity-40 rounded-full" />
          <p className="text-[#8B93A7] text-[13px] font-medium tracking-wide mt-2.5">
            Ton assistant financier intelligent
          </p>
        </div>

        {/* Titre */}
        <div className="mt-8 text-center motion-safe:animate-[fadeInUp_0.5s_ease-out_0.1s_both]">
          <h1 className="text-[28px] font-extrabold text-[#0B1229] tracking-[-0.02em]">
            Créer ton compte
          </h1>
          <p className="text-[#8B93A7] text-[15px] font-medium mt-1.5">
            Commence à mieux comprendre et gérer ton argent.
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="w-full mt-7 space-y-4 motion-safe:animate-[fadeInUp_0.5s_ease-out_0.2s_both]">
          <input
            type="text"
            placeholder="Ton nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-white border border-[#E5E9F0] rounded-2xl px-5 py-4 text-[15px] text-[#0B1229] placeholder:text-[#B0B8C8] focus:outline-none focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] transition-all duration-200"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white border border-[#E5E9F0] rounded-2xl px-5 py-4 text-[15px] text-[#0B1229] placeholder:text-[#B0B8C8] focus:outline-none focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] transition-all duration-200"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (!passwordTouched) setPasswordTouched(true);
              }}
              required
              className="w-full bg-white border border-[#E5E9F0] rounded-2xl px-5 py-4 pr-12 text-[15px] text-[#0B1229] placeholder:text-[#B0B8C8] focus:outline-none focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B93A7] hover:text-[#0B1229] transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {passwordTouched && (
            <div className="space-y-1.5 text-sm transition-all duration-300">
              <ValidationItem valid={passwordLength} text="8 caractères minimum" />
              <ValidationItem valid={hasUpperCase} text="Une majuscule" />
              <ValidationItem valid={hasNumber} text="Un chiffre" />
            </div>
          )}

          {error && (
            <p className="text-[#C8102E] text-sm text-center font-medium animate-[fadeInUp_0.3s_ease-out]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full group relative flex items-center justify-center gap-2.5 bg-[#0B1229] text-white font-semibold text-[16px] py-4.5 rounded-full shadow-[0_6px_24px_rgba(11,18,41,0.20)] hover:shadow-[0_10px_36px_rgba(11,18,41,0.28)] hover:bg-[#1A2A4A] active:scale-[0.97] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden mt-2"
          >
            <span className="relative z-10">
              {loading ? "Création en cours…" : "Créer mon compte"}
            </span>
            {!loading && (
              <ArrowRight className="relative z-10 w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-1.5" />
            )}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </form>

        <p className="text-center text-[15px] text-[#8B93A7] mt-6 font-medium">
          Déjà un compte ?{" "}
          <a href="/login" className="text-[#2563EB] font-semibold hover:underline">
            Se connecter
          </a>
        </p>

        <p className="text-center text-[11px] text-[#B0B8C8] mt-8 max-w-[260px] leading-relaxed">
          En créant un compte, vous acceptez nos{" "}
          <a href="#" className="text-[#8B93A7] underline hover:text-[#0B1229] transition-colors">
            conditions d'utilisation
          </a>{" "}
          et notre{" "}
          <a href="#" className="text-[#8B93A7] underline hover:text-[#0B1229] transition-colors">
            politique de confidentialité
          </a>.
        </p>
      </main>
    </div>
  );
}

function ValidationItem({ valid, text }: { valid: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-[#8B93A7]">
      {valid ? (
        <CheckCircle size={14} className="text-[#22C55E]" />
      ) : (
        <XCircle size={14} className="text-[#C8102E]" />
      )}
      <span className={valid ? "text-[#0B1229]" : "text-[#B0B8C8]"}>
        {text}
      </span>
    </div>
  );
}