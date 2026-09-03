"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Target, PlusCircle, Wallet, MessageCircle } from "lucide-react";
import { useState } from "react";
import ActionSheet from "./ActionSheet";

export default function BottomNav() {
  const pathname = usePathname();
  const [showActions, setShowActions] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 z-30">
        <div className="max-w-sm mx-auto flex items-center justify-between">
          <Link
            href="/dashboard"
            className={`flex flex-col items-center gap-1 ${isActive("/dashboard") ? "text-[#2563EB]" : "text-[#8B93A7]"}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Accueil</span>
          </Link>

          <Link
            href="/goals"
            className={`flex flex-col items-center gap-1 ${isActive("/goals") ? "text-[#2563EB]" : "text-[#8B93A7]"}`}
          >
            <Target className="w-5 h-5" />
            <span className="text-[10px] font-medium">Objectifs</span>
          </Link>

          <button
            onClick={() => setShowActions(true)}
            className="w-12 h-12 rounded-full bg-[#0B1229] text-white flex items-center justify-center -mt-4 shadow-lg"
          >
            <PlusCircle className="w-6 h-6" />
          </button>

          <Link
            href="/budget"
            className={`flex flex-col items-center gap-1 ${isActive("/budget") ? "text-[#2563EB]" : "text-[#8B93A7]"}`}
          >
            <Wallet className="w-5 h-5" />
            <span className="text-[10px] font-medium">Budget</span>
          </Link>

          <Link
            href="/chat"
            className={`flex flex-col items-center gap-1 ${isActive("/chat") ? "text-[#2563EB]" : "text-[#8B93A7]"}`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-[10px] font-medium">Coach</span>
          </Link>
        </div>
      </nav>

      {showActions && <ActionSheet onClose={() => setShowActions(false)} />}
    </>
  );
}