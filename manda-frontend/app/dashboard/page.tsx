"use client";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Home,
  Target,
  Plus,
  Wallet,
  MessageCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  PiggyBank,
  Bell,
  Receipt,
} from "lucide-react";

type Goal = {
  id: number;
  name: string;
  category: string;
  target_amount: number;
  saved_amount: number;
  status: string;
};

type User = {
  id: number;
  name: string;
  email: string;
};

const CATEGORY_ICONS: Record<string, string> = {
  home: "🏠",
  business: "🚀",
  emergency_fund: "🛡️",
  trip: "✈️",
  education: "🎓",
  car: "🚗",
  other: "🎯",
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser: User = JSON.parse(storedUser);
    setUser(parsedUser);

    fetch(`http://localhost:8000/users/${parsedUser.id}/goals`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data: Goal[]) => {
        setGoals(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-[#E7EEF9]" />
            <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-transparent border-t-[#2563EB] animate-spin" />
            <Sparkles
              size={14}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2563EB]"
            />
          </div>
          <p className="text-[12px] text-[#8B93A7]">
            manda prépare ton espace...
          </p>
        </div>
      </div>
    );
  }

  const totalSaved = goals.reduce((sum, goal) => sum + goal.saved_amount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target_amount, 0);
  const globalPercent =
    totalTarget > 0
      ? Math.min(Math.round((totalSaved / totalTarget) * 100), 100)
      : 0;
  const remaining = Math.max(totalTarget - totalSaved, 0);

  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (globalPercent / 100) * circumference;

  return (
    <div className="min-h-screen bg-white text-[#0B1229] pb-32">
      <main className="max-w-md mx-auto px-5 pt-6">
        {/* HEADER (inchangé) */}
        <header className="mb-6">
          <div className="flex items-center justify-between mb-7">
            <Link
              href="/"
              className="text-[23px] tracking-[-1px] font-extrabold"
            >
              <span className="text-[#0B1229]">manda</span>
              <span className="text-[#E63946]">.</span>
              <span className="text-[#2563EB]">IA</span>
            </Link>
            <div className="flex items-center gap-3">
              <button className="relative w-9 h-9 rounded-full border border-[#EDF1F6] bg-white flex items-center justify-center text-[#5F6B82] shadow-[0_3px_12px_rgba(11,18,41,0.04)]">
                <Bell size={16} />
                <span className="absolute top-[7px] right-[7px] w-[5px] h-[5px] rounded-full bg-[#E63946]" />
              </button>
              <div className="w-9 h-9 rounded-full bg-[#EEF4FF] border border-[#DCE8FF] flex items-center justify-center text-[12px] font-bold text-[#2563EB]">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            </div>
          </div>
          <h1 className="text-[25px] leading-[1.15] font-extrabold tracking-[-0.7px] text-[#0B1229]">
            Bonjour {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="mt-1.5 text-[12px] leading-5 text-[#7F899C]">
            Chaque dirham compte. Continue comme ça !
          </p>
        </header>

        {/* GLOBAL PROGRESS CARD (inchangé) */}
        <section className="relative overflow-hidden rounded-[25px] border border-[#E9EEF5] bg-white shadow-[0_8px_30px_rgba(11,18,41,0.055)] mb-5">
          <div className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#DCEAFF] blur-[45px] opacity-70" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 w-36 h-36 rounded-full bg-[#EEF6FF] blur-[40px]" />
          <div className="relative p-5">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
                  <circle cx="60" cy="60" r={radius} stroke="#E8EDF4" strokeWidth="9" fill="none" />
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="#2563EB"
                    strokeWidth="9"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[23px] font-extrabold tracking-[-0.5px] text-[#0B1229]">
                    {globalPercent}%
                  </span>
                  <span className="text-[9px] text-[#8B93A7] mt-0.5">Progression</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp size={13} className="text-[#2563EB]" />
                  <span className="text-[10px] font-bold text-[#2563EB]">Épargne</span>
                </div>
                <p className="text-[21px] font-extrabold tracking-[-0.5px] text-[#0B1229]">
                  {totalSaved.toLocaleString("fr-FR")} DH
                </p>
                <p className="text-[10px] text-[#8B93A7]">Épargné</p>
                <div className="mt-3">
                  <p className="text-[14px] font-bold text-[#3E4960]">
                    {totalTarget.toLocaleString("fr-FR")} DH
                  </p>
                  <p className="text-[10px] text-[#8B93A7]">Objectif total</p>
                </div>
              </div>
              <div className="absolute top-5 right-5 w-10 h-10 rounded-[13px] bg-[#EEF5FF] flex items-center justify-center">
                <PiggyBank size={19} className="text-[#2563EB]" />
              </div>
            </div>
            <div className="h-px bg-[#EEF1F5] my-4" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-[#0B1229]">
                  {totalSaved.toLocaleString("fr-FR")} DH{" "}
                  <span className="font-normal text-[#8B93A7]">
                    sur {totalTarget.toLocaleString("fr-FR")} DH
                  </span>
                </p>
                <p className="text-[9px] text-[#8B93A7] mt-1">
                  Plus que{" "}
                  <span className="text-[#2563EB] font-bold">
                    {remaining.toLocaleString("fr-FR")} DH
                  </span>{" "}
                  pour atteindre ton objectif.
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#F6F9FD] flex items-center justify-center">
                <ArrowRight size={14} className="text-[#2563EB]" />
              </div>
            </div>
          </div>
        </section>

        {/* AI ASSISTANT (inchangé) */}
        <section className="relative overflow-hidden rounded-[24px] border border-[#D9E7FF] bg-white shadow-[0_10px_35px_rgba(37,99,235,0.09)] mb-7">
          <div className="absolute -right-10 -top-14 w-36 h-36 rounded-full bg-[#DDEBFF] blur-[42px] opacity-80" />
          <div className="absolute left-10 -bottom-14 w-28 h-28 rounded-full bg-[#EDF6FF] blur-[35px]" />
          <div className="relative p-5">
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <div className="absolute inset-[-5px] rounded-[15px] bg-[#DDEBFF] blur-[8px] opacity-80" />
                <div className="relative w-11 h-11 rounded-[15px] bg-[#EEF5FF] border border-[#DCE9FF] flex items-center justify-center overflow-hidden">
                  <Image
                    src="/petit.png"
                    alt="petit"
                    width={44}
                    height={44}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 pr-2">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <h3 className="text-[14px] font-extrabold text-[#0B1229]">
                    Conseil de manda
                  </h3>
                  <Sparkles size={11} className="text-[#2563EB]" />
                </div>
                <p className="text-[11px] leading-[1.6] text-[#748096]">
                  Tu progresses de{" "}
                  <span className="font-bold text-[#2563EB]">
                    {globalPercent}%
                  </span>{" "}
                  vers ton objectif. Continue tes efforts !
                </p>
              </div>
            </div>
            <button className="mt-4 flex items-center gap-2 text-[11px] font-bold text-[#2563EB] group">
              Voir mon conseil
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>
          </div>
        </section>

        {/* OBJECTIVES (inchangé) */}
        <section className="mb-7">
          <div className="flex items-end justify-between mb-3">
            <div>
              <h2 className="text-[16px] font-extrabold text-[#0B1229]">
                Mes objectifs{" "}
                <span className="font-medium text-[#9AA3B2]">
                  ({goals.length})
                </span>
              </h2>
              <p className="text-[10px] text-[#9AA3B2] mt-1">
                Tes projets en cours
              </p>
            </div>
            {goals.length > 0 && (
              <Link href="/goals" className="text-[10px] font-bold text-[#2563EB]">
                Voir tous
              </Link>
            )}
          </div>
          {goals.length === 0 ? (
            <div className="rounded-[21px] border border-dashed border-[#DCE4EF] bg-[#FBFCFE] p-7 text-center">
              <div className="mx-auto w-11 h-11 rounded-[14px] bg-[#EEF5FF] flex items-center justify-center mb-3">
                <Target size={19} className="text-[#2563EB]" />
              </div>
              <p className="text-[13px] font-bold text-[#0B1229]">
                Aucun objectif pour l'instant
              </p>
              <p className="text-[11px] text-[#8B93A7] mt-1 mb-4">
                Crée ton premier objectif.
              </p>
              <Link
                href="/goals/new"
                className="inline-flex items-center gap-2 rounded-full bg-[#0B1229] text-white px-4 py-2.5 text-[11px] font-bold"
              >
                Créer un objectif
                <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {goals.map((goal) => {
                const percent =
                  goal.target_amount > 0
                    ? Math.min(
                        Math.round(
                          (goal.saved_amount / goal.target_amount) * 100
                        ),
                        100
                      )
                    : 0;
                const onTrack = percent >= 50;
                return (
                  <Link
                    href={`/goals/${goal.id}`}
                    key={goal.id}
                    className="block rounded-[20px] border border-[#E9EEF4] bg-white p-4 shadow-[0_4px_18px_rgba(11,18,41,0.025)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_8px_25px_rgba(11,18,41,0.06)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-[14px] bg-[#F6F8FB] border border-[#EEF1F5] flex items-center justify-center text-[21px] shrink-0">
                        {CATEGORY_ICONS[goal.category] || "🎯"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[13px] font-bold text-[#0B1229] truncate pr-2">
                            {goal.name}
                          </span>
                          <span className="text-[12px] font-extrabold text-[#2563EB]">
                            {percent}%
                          </span>
                        </div>
                        <div className="w-full h-[6px] bg-[#EEF1F5] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#2563EB] transition-all duration-700"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span
                            className={`text-[9px] font-bold px-2.5 py-1 rounded-full ${
                              onTrack
                                ? "bg-[#EAF8F0] text-[#16A34A]"
                                : "bg-[#FFF4E7] text-[#D97706]"
                            }`}
                          >
                            {onTrack ? "En bonne voie" : "À surveiller"}
                          </span>
                          <span className="text-[9px] text-[#8B93A7]">
                            {goal.saved_amount.toLocaleString("fr-FR")} /{" "}
                            {goal.target_amount.toLocaleString("fr-FR")} DH
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/*  */}
        <section>
          <div className="mb-3">
            <h2 className="text-[14px] font-extrabold text-[#0B1229]">
              Actions rapides
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/goals/new"
              className="flex items-center gap-3 rounded-[18px] border border-[#E9EEF4] bg-white p-3 transition hover:shadow-sm"
            >
              <div className="w-9 h-9 rounded-[12px] bg-[#EEF5FF] flex items-center justify-center shrink-0">
                <Plus size={17} className="text-[#2563EB]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#0B1229]">Ajouter</p>
                <p className="text-[9px] text-[#8B93A7]">un objectif</p>
              </div>
            </Link>
            <button className="flex items-center gap-3 rounded-[18px] border border-[#DDE9FF] bg-[#F9FBFF] p-3 text-left transition hover:shadow-sm">
              <div className="w-9 h-9 rounded-[12px] bg-[#EEF5FF] flex items-center justify-center shrink-0">
                <Sparkles size={16} className="text-[#2563EB]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#0B1229]">Conseil</p>
                <p className="text-[9px] text-[#2563EB]">de manda</p>
              </div>
            </button>
          </div>
        </section>
      </main>


<BottomNav />
    </div>
  );
}