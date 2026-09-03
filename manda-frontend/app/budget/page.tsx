"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

type Summary = {
  monthly_salary: number;
  fixed_charges: number;
  monthly_expenses: number;
  available_budget: number;
};

export default function BudgetPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(storedUser);

    fetch(`http://localhost:8000/users/${user.id}/financial-summary`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data: Summary) => {
        setSummary(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  return (
    <div className="min-h-screen bg-white pb-24">
      <main className="max-w-sm mx-auto px-6 pt-8">
        <h1 className="text-[22px] font-bold text-[#0B1229] mb-6">Mon budget</h1>

        {loading ? (
          <p className="text-[#8B93A7] text-sm text-center py-10">Chargement...</p>
        ) : summary ? (
          <>
            <div className="bg-[#F8FAFC] rounded-3xl p-6 mb-6">
              <p className="text-[13px] text-[#8B93A7] mb-1">Disponible ce mois-ci</p>
              <p className="text-[32px] font-bold text-[#0B1229] mb-4">
                {summary.available_budget.toLocaleString("fr-FR")} DH
              </p>
              <div className="flex justify-between text-[13px] border-t border-gray-200 pt-3">
                <span className="text-[#8B93A7]">Salaire</span>
                <span className="font-semibold text-[#0B1229]">
                  {summary.monthly_salary.toLocaleString("fr-FR")} DH
                </span>
              </div>
              <div className="flex justify-between text-[13px] mt-1.5">
                <span className="text-[#8B93A7]">Charges fixes</span>
                <span className="font-semibold text-[#0B1229]">
                  -{summary.fixed_charges.toLocaleString("fr-FR")} DH
                </span>
              </div>
              <div className="flex justify-between text-[13px] mt-1.5">
                <span className="text-[#8B93A7]">Dépenses ce mois</span>
                <span className="font-semibold text-[#0B1229]">
                  -{summary.monthly_expenses.toLocaleString("fr-FR")} DH
                </span>
              </div>
            </div>

            <Link
              href="/transactions"
              className="block text-center bg-[#0B1229] text-white font-medium py-3.5 rounded-full mb-3"
            >
              Voir mes dépenses
            </Link>
            <Link
              href="/onboarding/profile"
              className="block text-center text-[#2563EB] text-sm font-medium py-2"
            >
              Modifier mon profil financier
            </Link>
          </>
        ) : (
          <p className="text-[#8B93A7] text-sm text-center py-10">
            Configure d&apos;abord ton profil financier.
          </p>
        )}
      </main>
      <BottomNav />
    </div>
  );
}