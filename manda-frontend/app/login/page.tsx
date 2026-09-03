"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Email ou mot de passe incorrect");
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Vérifie si le profil financier existe déjà
      const profileRes = await fetch(
        `http://localhost:8000/users/${data.user.id}/financial-profile`,
        { headers: { Authorization: `Bearer ${data.access_token}` } }
      );

      if (profileRes.status === 404) {
        router.push("/onboarding/profile");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <main className="w-full max-w-sm flex flex-col items-center">
        {/* ===== LOGO manda.IA ===== */}
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

        {/* ===== Titre du formulaire ===== */}
        <div className="mt-8 text-center motion-safe:animate-[fadeInUp_0.5s_ease-out_0.1s_both]">
          <h1 className="text-[28px] font-extrabold text-[#0B1229] tracking-[-0.02em]">
            Bon retour 👋
          </h1>
          <p className="text-[#8B93A7] text-[15px] font-medium mt-1.5">
            Connecte-toi pour retrouver ton espace financier.
          </p>
        </div>

        {/* ===== Formulaire ===== */}
        <form onSubmit={handleSubmit} className="w-full mt-7 space-y-4 motion-safe:animate-[fadeInUp_0.5s_ease-out_0.2s_both]">
          {/* Champ Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white border border-[#E5E9F0] rounded-2xl px-5 py-4 text-[15px] text-[#0B1229] placeholder:text-[#B0B8C8] focus:outline-none focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] transition-all duration-200"
          />

          {/* Champ Mot de passe avec icône œil */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white border border-[#E5E9F0] rounded-2xl px-5 py-4 pr-12 text-[15px] text-[#0B1229] placeholder:text-[#B0B8C8] focus:outline-none focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B93A7] hover:text-[#0B1229] transition-colors"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Lien Mot de passe oublié */}
          <div className="text-right">
            <a href="#" className="text-[#2563EB] text-sm font-semibold hover:underline">
              Mot de passe oublié ?
            </a>
          </div>

          {/* Message d'erreur */}
          {error && (
            <p className="text-[#C8102E] text-sm text-center font-medium animate-[fadeInUp_0.3s_ease-out]">
              {error}
            </p>
          )}

          {/* Bouton CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full group relative flex items-center justify-center gap-2.5 bg-[#0B1229] text-white font-semibold text-[16px] py-4.5 rounded-full shadow-[0_6px_24px_rgba(11,18,41,0.20)] hover:shadow-[0_10px_36px_rgba(11,18,41,0.28)] hover:bg-[#1A2A4A] active:scale-[0.97] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden mt-2"
          >
            <span className="relative z-10">
              {loading ? "Connexion…" : "Se connecter"}
            </span>
            {!loading && (
              <ArrowRight className="relative z-10 w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-1.5" />
            )}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </form>

        {/* Lien vers Inscription */}
        <p className="text-center text-[15px] text-[#8B93A7] mt-6 font-medium">
          Pas encore de compte ?{" "}
          <a href="/signup" className="text-[#2563EB] font-semibold hover:underline">
            Créer un compte
          </a>
        </p>

        {/* ===== Séparateur social ===== */}
        <div className="flex items-center w-full mt-8 gap-4">
          <div className="flex-1 h-px bg-[#E5E9F0]" />
          <span className="text-[#8B93A7] text-sm font-medium">ou continuer avec</span>
          <div className="flex-1 h-px bg-[#E5E9F0]" />
        </div>

        {/* ===== Boutons sociaux ===== */}
        <div className="flex gap-3 w-full mt-4">
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#E5E9F0] rounded-2xl py-3.5 hover:border-[#2563EB] hover:shadow-[0_2px_12px_rgba(37,99,235,0.06)] transition-all duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.478,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
            </svg>
            <span className="text-[15px] font-medium text-[#0B1229]">Google</span>
          </button>
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#E5E9F0] rounded-2xl py-3.5 hover:border-[#2563EB] hover:shadow-[0_2px_12px_rgba(37,99,235,0.06)] transition-all duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.152,6.896c-0.948,0-2.07-0.489-2.689-1.276c-0.648-0.789-0.848-1.849-0.536-2.875c0.355-1.069,1.142-1.825,2.178-2.025c0.324-0.077,0.662-0.118,0.999-0.118c0.932,0,2.029,0.467,2.645,1.273c0.648,0.811,0.853,1.881,0.531,2.876c-0.347,1.069-1.133,1.825-2.169,2.025C12.826,6.855,12.488,6.896,12.152,6.896z M14.301,8.963h-4.301c-0.564,0-1.021,0.457-1.021,1.021v4.301c0,0.564,0.457,1.021,1.021,1.021h4.301c0.564,0,1.021-0.457,1.021-1.021V9.984C15.322,9.42,14.865,8.963,14.301,8.963z M17.332,8.963h-0.412v-3.3c0-0.564-0.457-1.021-1.021-1.021h-2.859v4.321h3.292v3.3h-3.292v4.301h3.292v3.3h-3.292v4.321h2.859c0.564,0,1.021-0.457,1.021-1.021v-3.3h0.412c0.564,0,1.021-0.457,1.021-1.021v-2.859C18.353,9.42,17.896,8.963,17.332,8.963z" />
            </svg>
            <span className="text-[15px] font-medium text-[#0B1229]">Apple</span>
          </button>
        </div>

        <div className="mt-6" /> {/*  */}
      </main>
    </div>
  );
}