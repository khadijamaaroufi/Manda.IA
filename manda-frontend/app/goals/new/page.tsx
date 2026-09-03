"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

type Goal = {
  id: number;
  name: string;
  category: string;
  target_amount: number;
  saved_amount: number;
};

const CATEGORY_ICONS: Record<string, string> = {
  home: "🏠", business: "🚀", emergency_fund: "🛡️",
  trip: "✈️", education: "🎓", car: "🚗", other: "🎯",
};

export default function GoalsPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(storedUser);

    fetch(`http://localhost:8000/users/${user.id}/goals`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data: Goal[]) => {
        setGoals(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  return (
    <div className="min-h-screen bg-white pb-24">
      <main className="max-w-sm mx-auto px-6 pt-8">
        <h1 className="text-[22px] font-bold text-[#0B1229] mb-6">Mes objectifs</h1>

        {loading ? (
          <p className="text-[#8B93A7] text-sm text-center py-10">Chargement...</p>
        ) : goals.length === 0 ? (
          <p className="text-[#8B93A7] text-sm text-center py-10">
            Aucun objectif pour l&apos;instant.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {goals.map((goal) => {
              const percent = Math.round((goal.saved_amount / goal.target_amount) * 100);
              return (
                <div key={goal.id} className="border border-gray-100 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{CATEGORY_ICONS[goal.category] || "🎯"}</span>
                    <span className="text-[14px] font-semibold text-[#0B1229] flex-1">
                      {goal.name}
                    </span>
                    <span className="text-[13px] font-semibold text-[#0B1229]">{percent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F0F2F5] rounded-full mb-1">
                    <div
                      className="h-1.5 rounded-full bg-[#2563EB]"
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#8B93A7]">
                    {goal.saved_amount.toLocaleString("fr-FR")} / {goal.target_amount.toLocaleString("fr-FR")} DH
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}