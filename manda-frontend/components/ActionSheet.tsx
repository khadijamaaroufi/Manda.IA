"use client";

import Link from "next/link";
import { X, Target, Receipt } from "lucide-react";

export default function ActionSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-white rounded-t-3xl p-6 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[16px] font-bold text-[#0B1229]">Que veux-tu faire ?</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-[#8B93A7]" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/goals/new"
            className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] flex items-center justify-center">
              <Target className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#0B1229]">Nouvel objectif</p>
              <p className="text-[12px] text-[#8B93A7]">Définis un nouveau projet à financer</p>
            </div>
          </Link>

          <Link
            href="/transactions"
            className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] flex items-center justify-center">
              <Receipt className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#0B1229]">Nouvelle dépense</p>
              <p className="text-[12px] text-[#8B93A7]">Enregistre une dépense récente</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}