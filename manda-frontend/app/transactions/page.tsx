"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";

const CATEGORIES = [
  { id: "food", icon: "🍔", label: "Alimentation" },
  { id: "transport", icon: "🚕", label: "Transport" },
  { id: "housing", icon: "🏠", label: "Logement" },
  { id: "leisure", icon: "🎮", label: "Loisirs" },
  { id: "shopping", icon: "🛍️", label: "Shopping" },
  { id: "health", icon: "💊", label: "Santé" },
  { id: "other", icon: "📦", label: "Autre" },
];

interface Transaction {
  id: number;
  amount: number;
  category: string;
  description: string | null;
  date: string; // ou Date
}

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [errorList, setErrorList] = useState("");

  // États pour le formulaire d'ajout
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Récupération des transactions
  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(storedUser);

    try {
      const res = await fetch(`http://localhost:8000/users/${user.id}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Erreur de chargement");
      }
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      setErrorList(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Ajout d'une nouvelle transaction
  async function handleSubmit() {
    setError("");
    if (!amount || !category) {
      setError("Montant et catégorie sont nécessaires");
      return;
    }
    setLoading(true);

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(storedUser);

    try {
      const res = await fetch(`http://localhost:8000/users/${user.id}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          category,
          description: description || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Erreur lors de l'ajout");
      }

      // Réinitialiser le formulaire et rafraîchir la liste
      setAmount("");
      setCategory("");
      setDescription("");
      setShowForm(false);
      fetchTransactions(); // recharger la liste
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-6">
      <div className="max-w-sm w-full mx-auto flex-1 flex flex-col">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[18px] font-bold text-[#0B1229]">Mes transactions</h1>
          <button onClick={() => router.push("/dashboard")}>
            <X className="w-5 h-5 text-[#8B93A7]" />
          </button>
        </div>

        {/* Liste des transactions */}
        {loadingList ? (
          <div className="text-center text-gray-500 py-8">Chargement...</div>
        ) : errorList ? (
          <div className="text-red-500 text-center py-8">{errorList}</div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-gray-400 py-8">Aucune transaction pour l'instant</div>
        ) : (
          <ul className="space-y-3 flex-1 overflow-auto">
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className="flex justify-between items-center border-b border-gray-100 py-2"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {CATEGORIES.find((c) => c.id === tx.category)?.icon || "📄"}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-[#0B1229]">
                      {tx.description || tx.category}
                    </div>
                    <div className="text-xs text-[#8B93A7]">
                      {new Date(tx.date).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-bold text-[#0B1229]">
                  {tx.amount.toFixed(2)} DH
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Formulaire d'ajout (affiché uniquement si showForm est vrai) */}
        {showForm && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[16px] font-bold text-[#0B1229]">Nouvelle dépense</h2>
              <button onClick={() => setShowForm(false)}>
                <X className="w-5 h-5 text-[#8B93A7]" />
              </button>
            </div>

            {/* Montant */}
            <div className="flex justify-center items-baseline gap-2 mb-4">
              <input
                type="number"
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="text-[36px] font-bold text-[#0B1229] text-center w-32 focus:outline-none"
              />
              <span className="text-[16px] text-[#8B93A7]">DH</span>
            </div>

            {/* Catégories */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border ${
                    category === cat.id ? "border-[#2563EB] bg-[#EAF2FF]" : "border-gray-100"
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-[9px] text-[#8B93A7] text-center leading-tight">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Note */}
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Note (optionnel)"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] mb-4"
            />

            {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#0B1229] text-white font-medium py-3 rounded-full disabled:opacity-50"
            >
              {loading ? "Ajout..." : "Ajouter"}
            </button>
          </div>
        )}
      </div>

      {/* Bouton + flottant pour ouvrir le formulaire (caché si déjà ouvert) */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-[#2563EB] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#1D4ED8] transition"
        >
          <Plus className="w-7 h-7" />
        </button>
      )}
    </div>
  );
}