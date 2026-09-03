import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white flex items-center justify-center px-6 overflow-hidden">
      {/* Bouton N en bas à gauche */}
      <button className="absolute bottom-8 left-6 z-20 w-9 h-9 rounded-full bg-[#0B1229] text-white text-sm font-semibold shadow-[0_4px_12px_rgba(11,18,41,0.15)] hover:shadow-[0_6px_20px_rgba(11,18,41,0.25)] hover:bg-[#1A2A4A] transition-all duration-300">
        N
      </button>

      <main className="w-full max-w-sm flex flex-col items-center py-8 relative z-10">
        {/* ===== LOGO manda.IA ===== */}
        <div className="text-center motion-safe:animate-[fadeInUp_0.5s_ease-out]">
          <h2 className="text-[28px] font-extrabold tracking-[-0.02em] leading-none">
            <span className="text-[#0B1229]">manda</span>
            <span className="text-[#C8102E]">.</span>
            <span className="text-[#2563EB]">IA</span>
          </h2>
          {/* Petite ligne décorative rouge */}
          <div className="w-6 h-[2px] bg-[#C8102E] mx-auto mt-1.5 opacity-40 rounded-full" />
          <p className="text-[#8B93A7] text-[13px] font-medium tracking-wide mt-2.5">
            Ton assistant financier intelligent
          </p>
        </div>

        {/* ===== Badge Assistant IA ===== */}
        <span className="mt-8 motion-safe:animate-[fadeInUp_0.5s_ease-out_0.1s_both] inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-[#D6E4FF] text-[#2563EB] text-[11px] font-semibold px-3.5 py-1.5 rounded-full shadow-[0_2px_8px_rgba(37,99,235,0.06)] relative overflow-hidden">
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB] fill-[#2563EB]/20" />
          Assistant IA
          <span className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </span>

        {/* ===== Robot 3D avec halo et ombre flottante ===== */}
        <div className="relative w-full flex justify-center mt-4 mb-6 motion-safe:animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#2563EB]/5 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-[#2563EB]/8 blur-2xl pointer-events-none" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 h-5 bg-[#0B1229]/10 rounded-full blur-xl motion-safe:animate-[shadowPulse_4s_ease-in-out_infinite]" />
          <Image
            src="/robot1.png"
            alt="Manada, ton coach financier IA"
            width={320}
            height={320}
            priority
            className="relative z-10 motion-safe:animate-[floatSoft_4s_ease-in-out_infinite] drop-shadow-[0_12px_40px_rgba(11,18,41,0.08)]"
          />
        </div>

        {/* ===== Titre principal ===== */}
        <div className="text-center mt-1 motion-safe:animate-[fadeInUp_0.6s_ease-out_0.3s_both]">
          <h1 className="text-[34px] leading-[1.1] font-extrabold text-[#0B1229] tracking-[-0.02em]">
            Ton argent,
            <br />
            un plan <span className="text-[#2563EB]">clair.</span>
          </h1>
        </div>

        {/* ===== Description ===== */}
        <p className="mt-3 motion-safe:animate-[fadeInUp_0.6s_ease-out_0.4s_both] text-[#8B93A7] text-[15px] font-medium leading-relaxed max-w-[260px] mx-auto text-center">
          Manada comprend ta situation et
          <br />
          t&apos;accompagne vers tes objectifs.
        </p>

        {/* ===== Bouton CTA ===== */}
       <Link
  href="/signup"
  className="mt-9 motion-safe:animate-[fadeInUp_0.6s_ease-out_0.5s_both] group relative flex items-center gap-2.5 bg-[#0B1229] text-white font-semibold text-[16px] pl-8 pr-7 py-4.5 rounded-full shadow-[0_6px_24px_rgba(11,18,41,0.20)] hover:shadow-[0_10px_36px_rgba(11,18,41,0.28)] hover:bg-[#1A2A4A] active:scale-[0.97] transition-all duration-300 overflow-hidden"
>
  <span className="relative z-10">Commencer</span>
  <ArrowRight className="relative z-10 w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-1.5" />
  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
</Link>

        {/* ===== Pagination élégante ===== */}
        <div className="flex items-center gap-2.5 mt-10 motion-safe:animate-[fadeInUp_0.6s_ease-out_0.6s_both]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C8102E] shadow-[0_0_0_4px_rgba(200,16,46,0.12)] motion-safe:animate-[pulseDot_2s_ease-in-out_infinite]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#DCE0E8] transition-colors duration-300 hover:bg-[#BCC0CC]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#DCE0E8] transition-colors duration-300 hover:bg-[#BCC0CC]" />
        </div>
      </main>
    </div>
  );
}